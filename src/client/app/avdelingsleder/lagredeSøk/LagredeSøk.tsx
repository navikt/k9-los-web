import React from 'react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, Button } from '@navikt/ds-react';
import { useHentLagredeSøk } from 'api/queries/avdelingslederQueries';
import { LagredeSøkTabell } from 'avdelingsleder/lagredeSøk/LagredeSøkTabell';
import { OpprettLagretSøkModal } from 'avdelingsleder/lagredeSøk/OpprettLagretSøkModal';
import ModalButton from 'sharedComponents/ModalButton';

export function LagredeSøk() {
	const { data, isSuccess, isError } = useHentLagredeSøk({ retry: false });
	return (
		<>
			<ModalButton
				renderButton={({ openModal }) => (
					<Button className="mb-7" variant="primary" onClick={openModal} icon={<PlusCircleIcon />} disabled={isError}>
						Legg til nytt lagret søk
					</Button>
				)}
				renderModal={({ open, closeModal }) => <OpprettLagretSøkModal open={open} closeModal={closeModal} />}
			/>
			{isError && (
				<div>
					<Alert variant="warning">
						Innlogget bruker er ikke i saksbehandler-tabellen. For å opprette lagrede søk må du være lagt til som
						saksbehandler.
					</Alert>
				</div>
			)}
			{isSuccess && data.length > 0 && <LagredeSøkTabell lagredeSøk={data} />}
			{isSuccess && data.length === 0 && (
				<div>
					<i>Du har ingen lagrede søk ennå</i>
				</div>
			)}
		</>
	);
}

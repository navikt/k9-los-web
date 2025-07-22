import React from 'react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useHentLagredeSøk } from 'api/queries/avdelingslederQueries';
import { LagredeSøkTabell } from 'avdelingsleder/lagredeSøk/LagredeSøkTabell';
import { OpprettLagretSøkModal } from 'avdelingsleder/lagredeSøk/OpprettLagretSøkModal';
import ModalButton from 'sharedComponents/ModalButton';

export function LagredeSøk() {
	const { data, isSuccess } = useHentLagredeSøk();
	return (
		<>
			<ModalButton
				renderButton={({ openModal }) => (
					<Button className="mb-7" variant="primary" onClick={openModal} icon={<PlusCircleIcon />}>
						Legg til nytt lagret søk
					</Button>
				)}
				renderModal={({ open, closeModal }) => <OpprettLagretSøkModal open={open} closeModal={closeModal} />}
			/>
			{isSuccess && data.length > 0 && <LagredeSøkTabell lagredeSøk={data} />}
		</>
	);
}

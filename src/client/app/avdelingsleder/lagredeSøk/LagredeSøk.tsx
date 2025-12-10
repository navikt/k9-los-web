import React from 'react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, HelpText } from '@navikt/ds-react';
import { useHentLagredeSøk } from 'api/queries/avdelingslederQueries';
import { LagredeSøkTabell } from 'avdelingsleder/lagredeSøk/LagredeSøkTabell';
import { OpprettLagretSøkModal } from 'avdelingsleder/lagredeSøk/OpprettLagretSøkModal';
import { UttrekkTabell } from 'avdelingsleder/lagredeSøk/uttrekk/UttrekkTabell';
import ModalButton from 'sharedComponents/ModalButton';

export function LagredeSøk() {
	const { data, isSuccess, isError } = useHentLagredeSøk({ retry: false });
	return (
		<>
			<div className="flex justify-between items-center mb-10">
				<Heading size="medium" className="flex gap-2 items-center">
					Dine lagrede søk
					<HelpText>
						<p>Dette er funksjonalitet under utvikling.</p>
						<p>
							Lagrede søk er personlige, og de vil ikke være synlige for andre. Man kan kun se antall oppgaver i et
							lagret søk. Reserverte oppgaver telles med i antallet.
						</p>
						<p className="mb-0">Muligheter for videre utvikling, som prioriteres etter behov:</p>
						<ul className="mt-0.5">
							<li>Dele lagrede søk med andre.</li>
							<li>Bruke lagrede søk som utgangspunkt for uttrekk av data.</li>
							<li>Lagring av historikk, slik at man for eksempel kan få antallet av et søk kjørt hver uke.</li>
						</ul>
					</HelpText>
				</Heading>
				<ModalButton
					renderButton={({ openModal }) => (
						<Button variant="secondary" onClick={openModal} icon={<PlusCircleIcon />} disabled={isError}>
							Legg til nytt lagret søk
						</Button>
					)}
					renderModal={({ open, closeModal }) => <OpprettLagretSøkModal open={open} closeModal={closeModal} />}
				/>
			</div>
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
			{isSuccess && <UttrekkTabell />}
		</>
	);
}

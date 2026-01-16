import React, { useEffect, useState } from 'react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, HelpText } from '@navikt/ds-react';
import { LagretSøk, useHentLagredeSøk, useOpprettLagretSøk } from 'api/queries/avdelingslederQueries';
import { EndreKriterierLagretSøkModal } from 'avdelingsleder/lagredeSøk/EndreKriterierLagretSøkModal';
import { LagredeSøkTabell } from 'avdelingsleder/lagredeSøk/LagredeSøkTabell';
import { UttrekkTabell } from 'avdelingsleder/lagredeSøk/uttrekk/UttrekkTabell';

export function LagredeSøk() {
	const { data, isSuccess, isError } = useHentLagredeSøk({ retry: false });
	const { mutate: opprettLagretSøk, isPending: oppretterSøk } = useOpprettLagretSøk();
	const [nyttSøkId, setNyttSøkId] = useState<number | null>(null);
	const [nyttSøk, setNyttSøk] = useState<LagretSøk | null>(null);

	// Når vi har en nyttSøkId og data er oppdatert, finn det opprettede søket
	useEffect(() => {
		if (nyttSøkId !== null && data) {
			const søk = data.find((s) => s.id === nyttSøkId);
			if (søk) {
				setNyttSøk(søk);
				setNyttSøkId(null);
			}
		}
	}, [nyttSøkId, data]);

	const handleOpprettSøk = () => {
		opprettLagretSøk(
			{ tittel: '' },
			{
				onSuccess: (id: number) => {
					setNyttSøkId(id);
				},
			},
		);
	};

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
				<Button
					variant="secondary"
					onClick={handleOpprettSøk}
					icon={<PlusCircleIcon />}
					disabled={isError}
					loading={oppretterSøk}
				>
					Legg til nytt lagret søk
				</Button>
			</div>
			{nyttSøk && (
				<EndreKriterierLagretSøkModal
					lagretSøk={nyttSøk}
					open={true}
					closeModal={() => setNyttSøk(null)}
				/>
			)}
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

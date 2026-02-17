import React, { useState } from 'react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, HelpText } from '@navikt/ds-react';
import { useHentAlleUttrekk, useHentLagredeSøk, useHentLagredeSøkDefaultQuery } from 'api/queries/avdelingslederQueries';
import { EndreKriterierLagretSøkModal } from 'avdelingsleder/lagredeSøk/EndreKriterierLagretSøkModal';
import { LagredeSøkTabell } from 'avdelingsleder/lagredeSøk/LagredeSøkTabell';
import { UttrekkKort } from 'avdelingsleder/lagredeSøk/uttrekk/UttrekkKort';

export function LagredeSøk() {
	const { data, isSuccess, isError } = useHentLagredeSøk({ retry: false });
	const { data: uttrekk } = useHentAlleUttrekk();
	const { data: defaultQuery } = useHentLagredeSøkDefaultQuery();
	const [visOpprettModal, setVisOpprettModal] = useState(false);

	// Finn uttrekk som ikke har tilhørende lagret søk (foreldreløse)
	const lagretSøkIder = new Set(data?.map((s) => s.id) ?? []);
	const foreldreløseUttrekk = uttrekk?.filter((u) => !u.lagretSøkId || !lagretSøkIder.has(u.lagretSøkId)) ?? [];

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
							<li>Lagring av historikk, slik at man for eksempel kan få antallet av et søk kjørt hver uke.</li>
						</ul>
					</HelpText>
				</Heading>
				<Button
					variant="secondary"
					onClick={() => setVisOpprettModal(true)}
					icon={<PlusCircleIcon />}
					disabled={isError || !defaultQuery}
				>
					Legg til nytt lagret søk
				</Button>
			</div>
			{visOpprettModal && defaultQuery && (
				<EndreKriterierLagretSøkModal
					tittel="Nytt lagret søk"
					initialQuery={defaultQuery}
					open
					closeModal={() => setVisOpprettModal(false)}
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
			{isSuccess && data.length > 0 && <LagredeSøkTabell lagredeSøk={data} uttrekk={uttrekk ?? []} />}
			{isSuccess && data.length === 0 && (
				<div>
					<i>Du har ingen lagrede søk ennå</i>
				</div>
			)}
			{isSuccess && !isError && foreldreløseUttrekk.length > 0 && (
				<div className="mt-12">
					<Heading size="xsmall" className="mb-4">
						Uttrekk fra slettede søk
					</Heading>
					<div>
						{foreldreløseUttrekk.map((u) => (
							<UttrekkKort key={u.id} uttrekk={u} />
						))}
					</div>
				</div>
			)}
		</>
	);
}

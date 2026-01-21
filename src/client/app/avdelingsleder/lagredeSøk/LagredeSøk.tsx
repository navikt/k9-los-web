import React, { useEffect, useState } from 'react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, HelpText } from '@navikt/ds-react';
import {
	LagretSøk,
	useHentAlleUttrekk,
	useHentLagredeSøk,
	useOpprettLagretSøk,
	useSlettLagretSøk,
} from 'api/queries/avdelingslederQueries';
import { EndreKriterierLagretSøkModal } from 'avdelingsleder/lagredeSøk/EndreKriterierLagretSøkModal';
import { LagredeSøkTabell } from 'avdelingsleder/lagredeSøk/LagredeSøkTabell';
import { UttrekkKort } from 'avdelingsleder/lagredeSøk/uttrekk/UttrekkKort';

export function LagredeSøk() {
	const { data, isSuccess, isError } = useHentLagredeSøk({ retry: false });
	const { data: uttrekk } = useHentAlleUttrekk();
	const { mutate: opprettLagretSøk, isPending: oppretterSøk } = useOpprettLagretSøk();
	const { mutate: slettLagretSøk } = useSlettLagretSøk();
	const [nyttSøkId, setNyttSøkId] = useState<number | null>(null);
	const [nyttSøk, setNyttSøk] = useState<LagretSøk | null>(null);
	const [highlightSøkId, setHighlightSøkId] = useState<number | null>(null);

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

	const handleLagreNyttSøk = () => {
		if (nyttSøk) {
			setHighlightSøkId(nyttSøk.id);
		}
		setNyttSøk(null);
	};

	const handleAvbrytNyttSøk = () => {
		if (nyttSøk) {
			slettLagretSøk(nyttSøk.id);
		}
		setNyttSøk(null);
	};

	// Finn uttrekk som ikke har tilhørende lagret søk (foreldreløse)
	const lagretSøkIder = new Set(data?.map((s) => s.id) ?? []);
	const foreldreløseUttrekk = uttrekk?.filter((u) => !u.lagretSøkId || !lagretSøkIder.has(u.lagretSøkId)) ?? [];

	// Filtrer bort søket som er under opprettelse fra listen
	const visbareLagredeSøk = data?.filter((s) => s.id !== nyttSøk?.id) ?? [];

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
					tittel="Nytt lagret søk"
					lagretSøk={nyttSøk}
					open
					onLagre={handleLagreNyttSøk}
					onAvbryt={handleAvbrytNyttSøk}
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
			{isSuccess && visbareLagredeSøk.length > 0 && (
				<LagredeSøkTabell
					lagredeSøk={visbareLagredeSøk}
					uttrekk={uttrekk ?? []}
					highlightSøkId={highlightSøkId}
					onHighlightComplete={() => setHighlightSøkId(null)}
				/>
			)}
			{isSuccess && visbareLagredeSøk.length === 0 && !nyttSøk && (
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

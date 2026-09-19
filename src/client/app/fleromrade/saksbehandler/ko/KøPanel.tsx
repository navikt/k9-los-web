import {
	BodyShort,
	Box,
	Button,
	Detail,
	Heading,
	HGrid,
	InlineMessage,
	Loader,
	Modal,
	ReadMore,
	Select,
	Skeleton,
	VStack,
} from '@navikt/ds-react';
import type { OppgaveKo, OppgaveSammendragDto } from 'api/generated/los.schemas';
import {
	useAntallIKø,
	useOppgaverIKø,
	usePlukkOppgave,
	useSaksbehandlereIKø,
	useSaksbehandlersKøer,
	useÅpneOppgave,
} from 'fleromrade/api/saksbehandlerQueries';
import { useOmråde } from 'fleromrade/OmrådeContext';
import { useId, useState } from 'react';
import { getValueFromLocalStorage, setValueInLocalStorage } from 'utils/localStorageHelper';
import OppgaveModal from '../oppgave/OppgaveModal';
import OppgaveTabell from '../oppgave/OppgaveTabell';
import ReserverteOppgaver from '../reservasjoner/ReserverteOppgaver';
import SammenleggbarOverskrift from '../SammenleggbarOverskrift';

const NesteOppgaver = ({ kø }: { kø: OppgaveKo }) => {
	const { data: oppgaver, isPending, isError } = useOppgaverIKø(kø.id);
	const [valgtOppgave, setValgtOppgave] = useState<OppgaveSammendragDto>();

	if (isPending) {
		return <Loader title="Henter oppgaver i køen" />;
	}
	if (isError) {
		return <InlineMessage status="error">Kunne ikke hente de neste oppgavene i køen</InlineMessage>;
	}
	if (oppgaver.length === 0) {
		return <BodyShort size="small">Det er ingen flere oppgaver i køen som kan plukkes</BodyShort>;
	}

	return (
		<>
			<OppgaveTabell oppgaver={oppgaver} onVelgOppgave={kø.frittValgAvOppgave ? setValgtOppgave : undefined} />
			{valgtOppgave && <OppgaveModal oppgave={valgtOppgave} lukk={() => setValgtOppgave(undefined)} />}
		</>
	);
};

const KøDetaljer = ({ kø }: { kø: OppgaveKo }) => {
	const { data: antall, isPending: henterAntall } = useAntallIKø(kø.id);
	const { data: saksbehandlere } = useSaksbehandlereIKø(kø.id);

	return (
		<VStack gap="space-8">
			{henterAntall ? (
				<Skeleton width={120} />
			) : (
				<BodyShort>{`Antall i kø: ${antall?.antallUtenReserverte}`}</BodyShort>
			)}
			<ReadMore size="small" header="Saksbehandlere i køen">
				<ul>
					{(saksbehandlere ?? [])
						.toSorted((a, b) => a.epost.localeCompare(b.epost))
						.map((saksbehandler) => (
							<li key={saksbehandler.id}>{saksbehandler.navn ?? saksbehandler.epost}</li>
						))}
				</ul>
			</ReadMore>
		</VStack>
	);
};

const KøPanel = () => {
	const { urlSegment } = useOmråde();
	const lagringsnøkkel = `valgtOppgaveko-${urlSegment}`;
	const { data: køer, isPending, isError } = useSaksbehandlersKøer();
	const { plukk, isPending: plukker } = usePlukkOppgave();
	const { åpne } = useÅpneOppgave();
	const [valgtKøId, setValgtKøId] = useState<number>();
	const [melding, setMelding] = useState<'ingen-oppgaver' | 'mangler-lenke'>();
	const [visNesteOppgaver, setVisNesteOppgaver] = useState(false);
	const nesteOppgaverId = useId();

	if (isPending) {
		return <Loader title="Henter oppgavekøer" />;
	}
	if (isError) {
		return <InlineMessage status="error">Kunne ikke hente oppgavekøene dine</InlineMessage>;
	}

	const sorterteKøer = køer.toSorted((a, b) => a.tittel.localeCompare(b.tittel));
	const lagretKøId = Number(getValueFromLocalStorage(lagringsnøkkel));
	const kø =
		sorterteKøer.find((k) => k.id === valgtKøId) ?? sorterteKøer.find((k) => k.id === lagretKøId) ?? sorterteKøer[0];

	const velgKø = (id: number) => {
		setValgtKøId(id);
		setValueInLocalStorage(lagringsnøkkel, String(id));
	};

	const plukkNesteOppgave = () =>
		plukk(kø.id, {
			onSuccess: ([reservasjon]) => {
				if (!reservasjon) {
					setMelding('ingen-oppgaver');
				} else if (!reservasjon.oppgavebehandlingsUrl) {
					setMelding('mangler-lenke');
				} else {
					åpne(reservasjon.oppgaveNøkkelDto, reservasjon.oppgavebehandlingsUrl);
				}
			},
		});

	return (
		<VStack gap="space-24">
			<Heading level="2" size="small">
				Oppgavekøer
			</Heading>
			{!kø ? (
				<BodyShort>Fant ingen oppgavekøer for deg.</BodyShort>
			) : (
				<>
					{/* Køvelgeren og neste oppgaver står i et lyseblått område, som i legacy-K9. */}
					<Box background="accent-moderate" borderRadius="4" padding="space-16">
						<VStack gap="space-16">
							<HGrid columns={{ xs: 1, md: '20rem 1fr' }} gap="space-32">
								<VStack gap="space-16">
									<Select label="Velg oppgavekø" value={kø.id} onChange={(event) => velgKø(Number(event.target.value))}>
										{sorterteKøer.map((k) => (
											<option key={k.id} value={k.id}>
												{k.tittel}
											</option>
										))}
									</Select>
									<KøDetaljer kø={kø} />
									<div>
										<Button loading={plukker} onClick={plukkNesteOppgave}>
											Gi meg neste oppgave i køen
										</Button>
									</div>
								</VStack>
								<div>
									<Detail>Beskrivelse av køen</Detail>
									<BodyShort className="mt-4">{kø.beskrivelse || '–'}</BodyShort>
								</div>
							</HGrid>
							{melding === 'mangler-lenke' && (
								<InlineMessage status="warning">
									Oppgaven er reservert på deg, men mangler lenke til fagsystemet. Du finner den under reserverte
									oppgaver.
								</InlineMessage>
							)}
							<div>
								<SammenleggbarOverskrift
									tittel="Neste oppgaver"
									åpen={visNesteOppgaver}
									onToggle={() => setVisNesteOppgaver(!visNesteOppgaver)}
									innholdId={nesteOppgaverId}
								/>
								<div id={nesteOppgaverId}>{visNesteOppgaver && <NesteOppgaver kø={kø} />}</div>
							</div>
						</VStack>
					</Box>
					<ReserverteOppgaver />
				</>
			)}
			<Modal
				open={melding === 'ingen-oppgaver'}
				onClose={() => setMelding(undefined)}
				header={{ heading: 'Ingen flere ureserverte oppgaver i køen' }}
				width="small"
			>
				<Modal.Body>
					<BodyShort>
						Det er ikke flere ureserverte oppgaver i den valgte køen. Velg en annen kø for å fortsette.
					</BodyShort>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={() => setMelding(undefined)}>Lukk</Button>
				</Modal.Footer>
			</Modal>
		</VStack>
	);
};

export default KøPanel;

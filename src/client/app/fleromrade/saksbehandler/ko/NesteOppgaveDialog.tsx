import { BodyShort, Button, Dialog, HStack, InlineMessage, Loader, UNSAFE_Combobox, VStack } from '@navikt/ds-react';
import type { OppgaveSammendragDto } from 'api/generated/los.schemas';
import { useInnloggetBruker } from 'fleromrade/api/innloggetBrukerQueries';
import {
	useReserverOppgave,
	useReserverOppgaveForSaksbehandler,
	useSaksbehandlereForReservasjon,
	useÅpneOppgave,
} from 'fleromrade/api/saksbehandlerQueries';
import { useState } from 'react';
import OppgaveOppsummering from '../oppgave/OppgaveOppsummering';

interface Props {
	oppgave: OppgaveSammendragDto;
	lukk: () => void;
}

const feilVedReservasjon =
	'Kunne ikke reservere oppgaven. Den kan ha blitt reservert av en annen, eller du mangler tilgang. Prøv igjen.';

const SaksbehandlerVelger = ({
	navident,
	setNavident,
	valideringsfeil,
	readOnly,
}: {
	navident: string;
	setNavident: (navident: string) => void;
	valideringsfeil: string | undefined;
	readOnly: boolean;
}) => {
	const { data: saksbehandlere, isPending, isError } = useSaksbehandlereForReservasjon();

	if (isPending) {
		return <Loader title="Henter saksbehandlere" />;
	}
	if (isError || !saksbehandlere) {
		return <InlineMessage status="error">Kunne ikke hente saksbehandlere. Prøv igjen.</InlineMessage>;
	}

	const valg = saksbehandlere
		.map(({ brukerIdent, navn }) => ({ value: brukerIdent, label: `${navn} (${brukerIdent})` }))
		.toSorted((a, b) => a.label.localeCompare(b.label));

	return (
		<UNSAFE_Combobox
			label="Saksbehandler"
			options={valg}
			selectedOptions={valg.filter(({ value }) => value === navident)}
			onToggleSelected={(verdi, valgt) => setNavident(valgt ? verdi : '')}
			readOnly={readOnly}
			shouldAutocomplete
			error={valideringsfeil}
		/>
	);
};

const NesteOppgaveDialog = ({ oppgave, lukk }: Props) => {
	const { data: bruker } = useInnloggetBruker();
	const { reserver, isPending: reserverer } = useReserverOppgave();
	const { reserver: reserverForAnnen, isPending: reservererForAnnen } = useReserverOppgaveForSaksbehandler();
	const { åpne, isPending: åpner } = useÅpneOppgave();
	const [åpen, setÅpen] = useState(true);
	const [visVelger, setVisVelger] = useState(false);
	const [navident, setNavident] = useState('');
	const [valideringsfeil, setValideringsfeil] = useState<string>();
	const [feilmelding, setFeilmelding] = useState<string>();

	const kanReservere = bruker?.tilganger.reservering ?? false;
	const venter = reserverer || reservererForAnnen || åpner;

	const åpneUtenReservasjon = () => {
		if (!oppgave.oppgavebehandlingsUrl) {
			setFeilmelding('Fant ikke lenke til oppgaven i fagsystemet.');
			return;
		}
		åpne(oppgave.oppgaveNøkkel, oppgave.oppgavebehandlingsUrl);
	};

	const reserverOgÅpne = () => {
		setFeilmelding(undefined);
		reserver(oppgave.oppgaveNøkkel, {
			onSuccess: (status) => {
				if (!status.erReservertAvInnloggetBruker) {
					setFeilmelding('Oppgaven ble reservert av en annen saksbehandler. Velg en annen oppgave.');
				} else if (!oppgave.oppgavebehandlingsUrl) {
					setFeilmelding(
						'Oppgaven er reservert på deg, men mangler lenke til fagsystemet. Du finner den under reserverte oppgaver.',
					);
				} else {
					åpne(oppgave.oppgaveNøkkel, oppgave.oppgavebehandlingsUrl);
				}
			},
			onError: () => setFeilmelding(feilVedReservasjon),
		});
	};

	const reserverForValgtSaksbehandler = () => {
		if (!navident) {
			setValideringsfeil('Velg en saksbehandler fra lista');
			return;
		}
		setFeilmelding(undefined);
		reserverForAnnen(oppgave.oppgaveNøkkel, navident, {
			onSuccess: () => setÅpen(false),
			onError: () => setFeilmelding(feilVedReservasjon),
		});
	};

	return (
		<Dialog
			open={åpen}
			onOpenChange={(nyÅpen, event) => {
				if (!nyÅpen && venter) {
					event.preventDefault();
					return;
				}
				setÅpen(nyÅpen);
			}}
			onOpenChangeComplete={(nyÅpen) => {
				if (!nyÅpen) {
					lukk();
				}
			}}
		>
			<Dialog.Popup width="large">
				<Dialog.Header>
					<Dialog.Title>Oppgave fra kø</Dialog.Title>
				</Dialog.Header>
				<Dialog.Body>
					<VStack gap="space-24">
						<OppgaveOppsummering oppgave={oppgave} />
						<BodyShort>Hva ønsker du å gjøre med oppgaven?</BodyShort>
						{feilmelding && (
							<InlineMessage status="error" role="alert">
								{feilmelding}
							</InlineMessage>
						)}
						<HStack gap="space-8" wrap></HStack>
						{visVelger && (
							<VStack gap="space-16">
								<SaksbehandlerVelger
									navident={navident}
									setNavident={(nyNavident) => {
										setNavident(nyNavident);
										setValideringsfeil(undefined);
									}}
									valideringsfeil={valideringsfeil}
									readOnly={reservererForAnnen}
								/>
								<div>
									<Button loading={reservererForAnnen} disabled={venter} onClick={reserverForValgtSaksbehandler}>
										Reserver oppgave
									</Button>
								</div>
							</VStack>
						)}
					</VStack>
				</Dialog.Body>
				<Dialog.Footer>
					<Dialog.CloseTrigger>
						<Button type="button" variant="tertiary" disabled={venter}>
							Avbryt
						</Button>
					</Dialog.CloseTrigger>
					<Button variant="secondary" loading={åpner} disabled={venter} onClick={åpneUtenReservasjon}>
						Åpne oppgave
					</Button>
					{kanReservere && (
						<>
							<Button loading={reserverer} disabled={venter} onClick={reserverOgÅpne}>
								Reserver og åpne
							</Button>
							<Button
								variant="secondary"
								disabled={venter}
								aria-expanded={visVelger}
								onClick={() => setVisVelger((vis) => !vis)}
							>
								Reserver for en annen
							</Button>
						</>
					)}
				</Dialog.Footer>
			</Dialog.Popup>
		</Dialog>
	);
};

export default NesteOppgaveDialog;

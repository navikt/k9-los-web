import { BodyShort, Button, HStack, InlineMessage, Loader, Modal, VStack } from '@navikt/ds-react';
import type { OppgaveSammendragDto } from 'api/generated/los.schemas';
import { useInnloggetBruker } from 'fleromrade/api/innloggetBrukerQueries';
import {
	useAktivReservasjon,
	useEndreReservasjoner,
	useOpphevReservasjoner,
	useReserverOppgave,
	useÅpneOppgave,
} from 'fleromrade/api/saksbehandlerQueries';
import { useState } from 'react';
import { oppgaveModalInnhold } from './oppgaveModalInnhold';

interface Props {
	oppgave: OppgaveSammendragDto;
	lukk: () => void;
}

const OppgaveModal = ({ oppgave, lukk }: Props) => {
	const [feilmelding, setFeilmelding] = useState<string>();
	const { data: bruker } = useInnloggetBruker();
	const { åpne, isPending: åpner } = useÅpneOppgave();
	const { reserver, isPending: reserverer } = useReserverOppgave();
	const { endre, isPending: endrer } = useEndreReservasjoner();
	const { opphev, isPending: opphever } = useOpphevReservasjoner();
	const venter = åpner || reserverer || endrer || opphever;
	const { data: reservasjon, isPending: henterReservasjon } = useAktivReservasjon(oppgave.oppgaveNøkkel, !venter);

	const åpneOppgave = () => {
		if (!oppgave.oppgavebehandlingsUrl) {
			setFeilmelding('Fant ikke lenke til oppgaven i fagsystemet.');
			return;
		}
		åpne(oppgave.oppgaveNøkkel, oppgave.oppgavebehandlingsUrl);
	};

	const reserverOgÅpne = () =>
		reserver(oppgave.oppgaveNøkkel, {
			onSuccess: (status) => {
				if (status.erReservertAvInnloggetBruker) {
					åpneOppgave();
				} else {
					setFeilmelding(`Oppgaven ble reservert av ${status.reservertAvNavn ?? 'en annen saksbehandler'}.`);
				}
			},
			onError: () =>
				setFeilmelding('Reservering av oppgave feilet. Dette kan skyldes at oppgaven ble reservert av noen andre.'),
		});

	const overtaOgÅpne = () =>
		endre([{ reservasjonsnøkkel: oppgave.reservasjonsnøkkel, brukerIdent: bruker.brukerIdent }], {
			onSuccess: åpneOppgave,
			onError: () =>
				setFeilmelding('Endring av reservasjon feilet. Dette kan skyldes at oppgaven ikke lenger er reservert.'),
		});

	const leggTilbake = () =>
		opphev([oppgave.reservasjonsnøkkel], {
			onSuccess: lukk,
			onError: () =>
				setFeilmelding('Legg tilbake i kø feilet. Dette kan skyldes at oppgaven ikke lenger er reservert.'),
		});

	const innhold = henterReservasjon ? undefined : oppgaveModalInnhold(oppgave, bruker, reservasjon);

	return (
		<Modal open onClose={lukk} closeOnBackdropClick header={{ heading: innhold?.tittel ?? 'Henter reservasjon' }}>
			<Modal.Body>
				{innhold ? (
					<VStack gap="space-8">
						{innhold.tekst && <BodyShort>{innhold.tekst}</BodyShort>}
						<BodyShort>Hva ønsker du å gjøre med oppgaven?</BodyShort>
						{feilmelding && <InlineMessage status="error">{feilmelding}</InlineMessage>}
					</VStack>
				) : (
					<Loader title="Henter reservasjon" />
				)}
			</Modal.Body>
			{innhold && (
				<Modal.Footer>
					<HStack gap="space-8" wrap>
						<Button onClick={åpneOppgave} loading={åpner} disabled={venter}>
							Åpne oppgave
						</Button>
						{innhold.visReserver && (
							<Button variant="secondary" onClick={reserverOgÅpne} loading={reserverer} disabled={venter}>
								Reserver og åpne oppgave
							</Button>
						)}
						{innhold.visOvertaReservasjon && (
							<Button variant="secondary" onClick={overtaOgÅpne} loading={endrer} disabled={venter}>
								Overta reservasjon og åpne oppgave
							</Button>
						)}
						{innhold.visLeggTilbake && (
							<Button variant="secondary" onClick={leggTilbake} loading={opphever} disabled={venter}>
								Legg tilbake i kø
							</Button>
						)}
						<Button variant="tertiary" onClick={lukk}>
							Avbryt
						</Button>
					</HStack>
				</Modal.Footer>
			)}
		</Modal>
	);
};

export default OppgaveModal;

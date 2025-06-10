import React, { FunctionComponent, useEffect } from 'react';
import dayjs from 'dayjs';
import { BodyShort, Button, Modal } from '@navikt/ds-react';
import {
	useEndreReservasjoner,
	useInnloggetSaksbehandler,
	useOpphevReservasjoner,
	useReserverOppgaveMutation,
	useSøk,
} from 'api/queries/saksbehandlerQueries';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { getDateAndTime } from 'utils/dateUtils';

interface OwnProps {
	oppgave: Oppgave;
	setValgtOppgave: (oppgave: Oppgave) => void;
	goToFagsak: (oppgave: Oppgave) => void;
}

const erReservertAvAnnenSaksbehandler = (oppgave: Oppgave) =>
	oppgave.status.erReservert && !oppgave.status.erReservertAvInnloggetBruker;
const erReservertAvInnloggetSaksbehandler = (oppgave: Oppgave) =>
	oppgave.status.erReservert && oppgave.status.erReservertAvInnloggetBruker;
const erSattPåVent = (oppgave: Oppgave) => oppgave.paaVent;

export const ValgtOppgaveModal: FunctionComponent<OwnProps> = ({ oppgave, setValgtOppgave, goToFagsak }) => {
	const { mutate: endreReservasjoner } = useEndreReservasjoner();
	const { mutate: reserverOppgave, isSuccess: harReservertNyOppgave } = useReserverOppgaveMutation();
	const { mutate: opphevReservasjoner, isSuccess: harOpphevetReservasjon } = useOpphevReservasjoner();
	const { reset: resetSøk } = useSøk();
	const { data: saksbehandler } = useInnloggetSaksbehandler();

	const onClose = () => setValgtOppgave(undefined);

	// Åpner oppgave etter at den er reservert
	useEffect(() => {
		if (harReservertNyOppgave) {
			goToFagsak(oppgave);
		}
	}, [harReservertNyOppgave]);

	useEffect(() => {
		if (harOpphevetReservasjon) {
			resetSøk();
			onClose();
		}
	}, [harOpphevetReservasjon]);

	const reserverValgtOppgave = () =>
		erReservertAvAnnenSaksbehandler(oppgave)
			? endreReservasjoner([{ oppgaveNøkkel: oppgave.oppgaveNøkkel, brukerIdent: saksbehandler.brukerIdent }])
			: reserverOppgave(oppgave.oppgaveNøkkel);

	if (erSattPåVent(oppgave)) {
		return (
			<Modal open className="min-w-[550px]" onClose={onClose} header={{ heading: 'Oppgaven er satt på vent' }}>
				<Modal.Body>
					<BodyShort>
						{`Oppgaven er satt på vent til ${dayjs(oppgave.behandlingsfrist).format(
							'DD.MM.YYYY',
						)}.  Hva ønsker du å gjøre med oppgaven?`}
					</BodyShort>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" size="small" onClick={() => goToFagsak(oppgave)}>
						Åpne oppgaven
					</Button>
					{saksbehandler?.kanReservere && !erReservertAvInnloggetSaksbehandler(oppgave) && (
						<Button variant="secondary" size="small" onClick={reserverValgtOppgave}>
							Reserver og åpne oppgave
						</Button>
					)}
					{erReservertAvInnloggetSaksbehandler(oppgave) && (
						<Button
							variant="secondary"
							size="small"
							onClick={() => opphevReservasjoner([{ oppgaveNøkkel: oppgave.oppgaveNøkkel }])}
						>
							Legg tilbake i kø
						</Button>
					)}

					<Button variant="secondary" size="small" onClick={onClose}>
						Avbryt
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	if (erReservertAvInnloggetSaksbehandler(oppgave)) {
		return (
			<Modal open onClose={onClose} header={{ heading: 'Oppgaven er reservert av deg' }} className="min-w-[550px]">
				<Modal.Body>
					<BodyShort> Hva ønsker du å gjøre med oppgaven?</BodyShort>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" size="small" onClick={() => goToFagsak(oppgave)}>
						Åpne oppgaven
					</Button>
					<Button
						variant="secondary"
						size="small"
						onClick={() => opphevReservasjoner([{ oppgaveNøkkel: oppgave.oppgaveNøkkel }])}
					>
						Legg tilbake i kø
					</Button>
					<Button variant="secondary" size="small" onClick={onClose}>
						Avbryt
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	if (erReservertAvAnnenSaksbehandler(oppgave)) {
		const { date, time } = getDateAndTime(oppgave.status.reservertTilTidspunkt);
		return (
			<Modal open onClose={onClose} header={{ heading: 'En annen saksbehandler arbeider nå med denne oppgaven' }}>
				<Modal.Body>
					<BodyShort>
						{`${
							oppgave.status.reservertAvNavn || ''
						} arbeider nå med denne oppgaven (reservert fram t.o.m ${date} - ${time}).  Hva ønsker du å gjøre med oppgaven?`}
					</BodyShort>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" size="small" onClick={() => goToFagsak(oppgave)}>
						Åpne oppgaven
					</Button>
					{saksbehandler?.kanReservere && (
						<Button variant="secondary" size="small" onClick={reserverValgtOppgave}>
							Reserver og åpne oppgave
						</Button>
					)}
					<Button variant="secondary" size="small" onClick={onClose}>
						Avbryt
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	return (
		<Modal open onClose={onClose} header={{ heading: 'Hva ønsker du å gjøre med oppgaven?' }} className="min-w-[550px]">
			<Modal.Footer>
				<Button variant="primary" size="small" onClick={() => goToFagsak(oppgave)}>
					Åpne oppgaven
				</Button>
				{saksbehandler?.kanReservere && (
					<Button variant="secondary" size="small" onClick={reserverValgtOppgave}>
						Reserver og åpne oppgave
					</Button>
				)}
				<Button variant="secondary" size="small" onClick={onClose}>
					Avbryt
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ValgtOppgaveModal;

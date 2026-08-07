import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, Detail, Table } from '@navikt/ds-react';
import { useForlengOppgavereservasjon, useSisteOppgaverMutation } from 'api/queries/saksbehandlerQueries';
import dayjs from 'dayjs';
import type React from 'react';
import { type ReactNode, useState } from 'react';
import FlyttReservasjonerModal from 'saksbehandler/behandlingskoer/components/menu/FlyttReservasjonerModal';
import OpphevReservasjonerModal from 'saksbehandler/behandlingskoer/components/menu/OpphevReservasjonerModal';
import type ReservasjonV3 from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import KommentarMedMerknad from 'saksbehandler/components/KommentarMedMerknad';
import type OppgaveV3 from 'types/OppgaveV3';
import { OppgavestatusV3 } from 'types/OppgaveV3';
import { RAD_NØKKEL_ATTRIBUTT } from './radFlyttAnimasjon';

interface OwnProps {
	oppgave: OppgaveV3;
	reservasjon: ReservasjonV3;
	/** Stabil identitet som knytter raden til flytteanimasjonen. */
	radnøkkel: string;
	/** Antall åpne oppgaver som deler denne reservasjonen. */
	antallOppgaverIReservasjonen: number;
	/**
	 * Handlingene gjelder hele reservasjonen, og vises derfor kun på første rad
	 * i gruppen. Ellers ser det ut som hver oppgave har egne handlinger.
	 */
	visHandlinger: boolean;
	onActionmenuEndring: () => void;
}

type Props = OwnProps;

const ReservertOppgaveRadV3: React.FunctionComponent<Props> = ({
	oppgave,
	reservasjon,
	radnøkkel,
	antallOppgaverIReservasjonen,
	// biome-ignore lint/correctness/noUnusedFunctionParameters: Hvis handlingen bare skal vises på første rad i gruppen, må vi vite om det er første rad. Ellers ser det ut som hver oppgave har egne handlinger. Slett hvis det ikke blir aktuelt.
	visHandlinger,
	onActionmenuEndring,
}) => {
	const [modal, setModal] = useState<ReactNode>(null);

	const { mutate: leggTilSisteOppgaver } = useSisteOppgaverMutation();
	const { mutate: forlengOppgaveReservasjonMutate, isPending: forlengOppgaveReservasjonIsPending } =
		useForlengOppgavereservasjon(onActionmenuEndring);

	const flereOppgaver = antallOppgaverIReservasjonen > 1;
	const handlingerBeskrivelse = flereOppgaver
		? `Handlinger på reservasjonen med ${antallOppgaverIReservasjonen} oppgaver`
		: 'Handlinger på reservasjonen';

	const tilOppgave = () => {
		leggTilSisteOppgaver(oppgave.oppgaveNøkkel, {
			onSettled: () => window.location.assign(oppgave.oppgavebehandlingsUrl),
		});
	};

	const openEndreModal = () => {
		setModal(
			<FlyttReservasjonerModal
				open
				closeModal={() => setModal(null)}
				reservasjoner={[
					{
						reservasjonsnøkkel: reservasjon.reservasjonsnøkkel,
						begrunnelse: reservasjon.kommentar,
						reserverTil: reservasjon.reservertTil,
						reservertAvIdent: reservasjon.reservertAvIdent,
					},
				]}
				antallOppgaver={antallOppgaverIReservasjonen}
				onReservasjonEndret={onActionmenuEndring}
			/>,
		);
	};

	const forlengOppgaveReservasjon = () => {
		forlengOppgaveReservasjonMutate({ reservasjonsnøkkel: reservasjon.reservasjonsnøkkel });
	};

	const openOpphevModal = () => {
		setModal(
			<OpphevReservasjonerModal
				open
				closeModal={() => setModal(null)}
				reservasjonsnøkler={[reservasjon.reservasjonsnøkkel]}
				antallOppgaver={antallOppgaverIReservasjonen}
				onReservasjonOpphevet={onActionmenuEndring}
			/>,
		);
	};

	return (
		<Table.Row {...{ [RAD_NØKKEL_ATTRIBUTT]: radnøkkel }}>
			<Table.DataCell>
				{oppgave.søkersNavn}
				<br />
				<Detail>{oppgave.søkersPersonnr}</Detail>
			</Table.DataCell>
			<Table.DataCell>
				{oppgave.saksnummer || oppgave.journalpostId}
				{oppgave.oppgavestatus === OppgavestatusV3.VENTER && (
					<>
						<br />
						<Detail>På vent</Detail>
					</>
				)}
			</Table.DataCell>
			<Table.DataCell>
				{oppgave.behandlingstype.navn}
				{oppgave.ytelsestype && (
					<>
						<br />
						<Detail>{oppgave.ytelsestype?.navn}</Detail>
					</>
				)}
			</Table.DataCell>
			<Table.DataCell>{dayjs(oppgave.opprettetTidspunkt).format('DD.MM.YYYY')}</Table.DataCell>
			<Table.DataCell>
				<div className="flex items-center gap-3">
					{reservasjon.reservertTil && dayjs(reservasjon.reservertTil).format('DD.MM.YYYY')}
					<KommentarMedMerknad reservasjon={reservasjon} />
				</div>
			</Table.DataCell>
			<Table.DataCell>
				<div className="flex items-center gap-3">
					<Button variant="secondary" size="small" onClick={tilOppgave} iconPosition="right">
						Åpne
					</Button>
					{modal}
					<ActionMenu>
						<ActionMenu.Trigger>
							<Button
								variant="secondary"
								className="p-1"
								icon={<MenuElipsisVerticalIcon title={handlingerBeskrivelse} />}
								size="medium"
								data-marker-reservasjonsgruppe
							/>
						</ActionMenu.Trigger>
						<ActionMenu.Content>
							<ActionMenu.Group aria-label={handlingerBeskrivelse}>
								<ActionMenu.Item onSelect={openOpphevModal}>
									{flereOppgaver ? 'Legg oppgavene' : 'Legg oppgave'} <br />
									tilbake i felles kø
								</ActionMenu.Item>
								<ActionMenu.Divider />
								<ActionMenu.Item onSelect={forlengOppgaveReservasjon} disabled={forlengOppgaveReservasjonIsPending}>
									Forleng din reservasjon av
									<br /> {flereOppgaver ? 'oppgavene' : 'oppgaven'} med 24 timer
								</ActionMenu.Item>
								<ActionMenu.Divider />
								<ActionMenu.Item onSelect={openEndreModal}>Endre og/eller flytte reservasjon</ActionMenu.Item>
							</ActionMenu.Group>
						</ActionMenu.Content>
					</ActionMenu>
				</div>
			</Table.DataCell>
		</Table.Row>
	);
};

export default ReservertOppgaveRadV3;

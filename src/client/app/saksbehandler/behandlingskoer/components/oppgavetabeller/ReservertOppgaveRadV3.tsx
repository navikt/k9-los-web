import { MenuHamburgerIcon } from '@navikt/aksel-icons';
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
import { dateTimeFormat } from 'utils/dateUtils';
import styles from './oppgaverTabell.module.css';
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
}

type Props = OwnProps;

const ReservertOppgaveRadV3: React.FunctionComponent<Props> = ({
	oppgave,
	reservasjon,
	radnøkkel,
	antallOppgaverIReservasjonen,
	visHandlinger,
}) => {
	const [modal, setModal] = useState<ReactNode>(null);

	const { mutate: leggTilSisteOppgaver } = useSisteOppgaverMutation();
	const { mutate: forlengOppgaveReservasjonMutate, isPending: forlengOppgaveReservasjonIsPending } =
		useForlengOppgavereservasjon();

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
			/>,
		);
	};

	return (
		<Table.Row {...{ [RAD_NØKKEL_ATTRIBUTT]: radnøkkel }} className={styles.isUnderBehandling}>
			<Table.DataCell onClick={tilOppgave} className={styles.soekerPadding}>
				{oppgave.søkersNavn ? `${oppgave.søkersNavn} ${oppgave.søkersPersonnr}` : '<navn>'}
			</Table.DataCell>
			<Table.DataCell onClick={tilOppgave} className="hover:cursor-pointer">
				{oppgave.saksnummer || oppgave.journalpostId}
			</Table.DataCell>
			<Table.DataCell onClick={tilOppgave} className="hover:cursor-pointer">
				{oppgave.behandlingstype.navn}
			</Table.DataCell>
			<Table.DataCell onClick={tilOppgave} className="hover:cursor-pointer">
				{(oppgave.opprettetTidspunkt && dayjs(oppgave.opprettetTidspunkt).format('DD.MM.YYYY')) || '-'}
			</Table.DataCell>
			<Table.DataCell onClick={tilOppgave} className={`${styles.reservertTil} hover:cursor-pointer`}>
				Reservert til {dateTimeFormat(reservasjon.reservertTil)}
			</Table.DataCell>
			<Table.DataCell>
				{visHandlinger && (
					<>
						{modal}
						<div className="flex justify-end items-center gap-8">
							{flereOppgaver && (
								<Detail className={styles.gruppeforklaring}>Gjelder {antallOppgaverIReservasjonen} oppgaver</Detail>
							)}
							<KommentarMedMerknad reservasjon={reservasjon} />
							<ActionMenu>
								<ActionMenu.Trigger>
									<Button
										variant="tertiary"
										className="p-1 mr-4"
										icon={<MenuHamburgerIcon title={handlingerBeskrivelse} />}
										size="medium"
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
					</>
				)}
			</Table.DataCell>
		</Table.Row>
	);
};

export default ReservertOppgaveRadV3;

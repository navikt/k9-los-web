import React, { ReactNode, useState } from 'react';
import dayjs from 'dayjs';
import { MenuHamburgerIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, Table } from '@navikt/ds-react';
import { useForlengOppgavereservasjon, useSisteOppgaverMutation } from 'api/queries/saksbehandlerQueries';
import ReservasjonV3 from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import FlyttReservasjonerModal from 'saksbehandler/behandlingskoer/components/menu/FlyttReservasjonerModal';
import OpphevReservasjonerModal from 'saksbehandler/behandlingskoer/components/menu/OpphevReservasjonerModal';
import KommentarMedMerknad from 'saksbehandler/components/KommentarMedMerknad';
import OppgaveV3 from 'types/OppgaveV3';
import { dateTimeFormat } from 'utils/dateUtils';
import * as styles from './oppgaverTabell.css';

interface OwnProps {
	oppgave: OppgaveV3;
	reservasjon: ReservasjonV3;
}

type Props = OwnProps;

const ReservertOppgaveRadV3: React.FunctionComponent<Props> = ({ oppgave, reservasjon }) => {
	const [modal, setModal] = useState<ReactNode>(null);

	const { mutate: leggTilSisteOppgaver } = useSisteOppgaverMutation();
	const { mutate: forlengOppgaveReservasjonMutate, isPending: forlengOppgaveReservasjonIsPending } =
		useForlengOppgavereservasjon();

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
						oppgaveNøkkel: oppgave.oppgaveNøkkel,
						begrunnelse: reservasjon.kommentar,
						reserverTil: reservasjon.reservertTil,
						reservertAvIdent: reservasjon.reservertAvIdent,
					},
				]}
			/>,
		);
	};

	const forlengOppgaveReservasjon = () => {
		forlengOppgaveReservasjonMutate({ oppgaveNøkkel: oppgave.oppgaveNøkkel });
	};

	const openOpphevModal = () => {
		setModal(
			<OpphevReservasjonerModal open closeModal={() => setModal(null)} oppgaveNøkler={[oppgave.oppgaveNøkkel]} />,
		);
	};

	return (
		<Table.Row key={oppgave.oppgaveNøkkel.oppgaveEksternId} className={styles.isUnderBehandling}>
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
				{modal}
				<div className="flex justify-end gap-8">
					<KommentarMedMerknad reservasjon={reservasjon} />
					<ActionMenu>
						<ActionMenu.Trigger>
							<Button
								variant="tertiary"
								className="p-1 mr-4"
								icon={<MenuHamburgerIcon title="Handlinger på oppgave" />}
								size="medium"
							/>
						</ActionMenu.Trigger>
						<ActionMenu.Content>
							<ActionMenu.Group aria-label="">
								<ActionMenu.Item onSelect={openOpphevModal}>
									Legg oppgave <br />
									tilbake i felles kø
								</ActionMenu.Item>
								<ActionMenu.Divider />
								<ActionMenu.Item onSelect={forlengOppgaveReservasjon} disabled={forlengOppgaveReservasjonIsPending}>
									Forleng din reservasjon av
									<br /> oppgaven med 24 timer
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

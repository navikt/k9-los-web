/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { RefAttributes } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { ExclamationmarkTriangleFillIcon, MenuHamburgerIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, Table } from '@navikt/ds-react';
import { useForlengOppgavereservasjon, useSisteOppgaverMutation } from 'api/queries/saksbehandlerQueries';
import ReservasjonV3 from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import FlyttReservasjonerModal from 'saksbehandler/behandlingskoer/components/menu/FlyttReservasjonerModal';
import OpphevReservasjonerModal from 'saksbehandler/behandlingskoer/components/menu/OpphevReservasjonerModal';
import KommentarMedMerknad from 'saksbehandler/components/KommentarMedMerknad';
import ModalButton from 'sharedComponents/ModalButton';
import OppgaveV3 from 'types/OppgaveV3';
import { getDateAndTime } from 'utils/dateUtils';
import * as styles from './oppgaverTabell.css';

// Update the path as necessary

interface OwnProps {
	oppgave: OppgaveV3;
	reservasjon: ReservasjonV3;
	gjelderHastesaker: boolean;
}

type Props = OwnProps;

const ReservertOppgaveRadV3: React.ForwardRefExoticComponent<Props> = React.forwardRef(
	({ oppgave, reservasjon, gjelderHastesaker }: OwnProps) => {
		const [modal, setModal] = React.useState<React.ReactNode>(null);
		const { mutate: leggTilSisteOppgaver } = useSisteOppgaverMutation();
		const { mutate: forlengOppgaveReservasjon } = useForlengOppgavereservasjon();

		const tilOppgave = () => {
			leggTilSisteOppgaver(oppgave.oppgaveNøkkel, {
				onSettled: () => window.location.assign(oppgave.oppgavebehandlingsUrl),
			});
		};
		return (
			<Table.Row
				key={oppgave.oppgaveNøkkel.oppgaveEksternId}
				className={classNames(styles.isUnderBehandling, { [styles.hastesak]: gjelderHastesaker })}
				onKeyDown={tilOppgave}
			>
				{gjelderHastesaker && (
					<Table.DataCell onClick={tilOppgave} className={`${styles.hastesakTd} hover:cursor-pointer`}>
						<ExclamationmarkTriangleFillIcon height="1.5rem" width="1.5rem" className={styles.hastesakIkon} />
					</Table.DataCell>
				)}
				<Table.DataCell
					onClick={tilOppgave}
					className={`${gjelderHastesaker ? '' : styles.soekerPadding} hover:cursor-pointer`}
				>
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
					Reservert til {getDateAndTime(reservasjon.reservertTil).date} -{' '}
					{getDateAndTime(reservasjon.reservertTil).time}
				</Table.DataCell>
				<Table.DataCell>
					<div className="flex justify-center gap-12">
						<KommentarMedMerknad reservasjon={reservasjon} />
						<ActionMenu>
							{modal}
							<ActionMenu.Trigger>
								<Button
									variant="tertiary"
									className="p-1"
									icon={<MenuHamburgerIcon title="Handlinger på oppgave" />}
									size="medium"
								/>
							</ActionMenu.Trigger>
							<ActionMenu.Content>
								<ActionMenu.Group aria-label="">
									<ModalButton
										setModal={setModal}
										renderButton={({ openModal }) => (
											<ActionMenu.Item onSelect={openModal}>
												Legg oppgave <br />
												tilbake i felles kø
											</ActionMenu.Item>
										)}
										renderModal={({ open, closeModal }) => (
											<OpphevReservasjonerModal
												oppgaveNøkler={[oppgave.oppgaveNøkkel]}
												open={open}
												closeModal={closeModal}
											/>
										)}
									/>
									<ActionMenu.Divider />
									<ActionMenu.Item onSelect={() => forlengOppgaveReservasjon({ oppgaveNøkkel: oppgave.oppgaveNøkkel })}>
										Forleng din reservasjon av
										<br /> oppgaven med 24 timer
									</ActionMenu.Item>
									<ActionMenu.Divider />
									<ModalButton
										setModal={setModal}
										renderButton={({ openModal }) => (
											<ActionMenu.Item onSelect={openModal}>Endre og/eller flytte reservasjon</ActionMenu.Item>
										)}
										renderModal={({ open, closeModal }) => (
											<FlyttReservasjonerModal
												reservasjoner={[
													{
														oppgaveNøkkel: oppgave.oppgaveNøkkel,
														begrunnelse: reservasjon.kommentar,
														reserverTil: reservasjon.reservertTil,
														reservertAvIdent: reservasjon.reservertAvIdent,
													},
												]}
												open={open}
												closeModal={closeModal}
											/>
										)}
									/>
								</ActionMenu.Group>
							</ActionMenu.Content>
						</ActionMenu>
					</div>
				</Table.DataCell>
			</Table.Row>
		);
	},
);

export default ReservertOppgaveRadV3;

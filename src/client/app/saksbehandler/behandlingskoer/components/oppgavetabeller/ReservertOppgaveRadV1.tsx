/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-param-reassign */
import React, { RefAttributes } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { ExclamationmarkTriangleFillIcon, MenuHamburgerIcon } from '@navikt/aksel-icons';
import { Button, Table } from '@navikt/ds-react';
import ReservasjonV3 from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import KommentarMedMerknad from 'saksbehandler/components/KommentarMedMerknad';
import Oppgave from 'saksbehandler/oppgaveTsType';
import DateLabel from 'sharedComponents/DateLabel';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import { getDateAndTime } from 'utils/dateUtils';
import OppgaveHandlingerMenu from '../menu/OppgaveHandlingerMenu';
import * as styles from './oppgaverTabell.module.css';

// Update the path as necessary

interface Props {
	reservasjon: ReservasjonV3;
	goToFagsak: (oppgave: Oppgave) => void;
	forlengOppgaveReservasjonFn: (oppgaveNøkkel: OppgaveNøkkel) => void;
	valgtOppgaveId: string;
	setValgtOppgaveId: React.Dispatch<React.SetStateAction<string>>;
	gjelderHastesaker: boolean;
}

type Ref = { [key: string]: HTMLDivElement };
type OwnProps = Props & RefAttributes<Ref>;

/**
 * @deprecated
 */
const ReservertOppgaveRadV1: React.ForwardRefExoticComponent<OwnProps> = React.forwardRef(
	(
		{
			reservasjon,
			goToFagsak,
			forlengOppgaveReservasjonFn,
			valgtOppgaveId,
			setValgtOppgaveId,
			gjelderHastesaker,
		}: Props,
		ref: React.RefObject<{ [key: string]: HTMLDivElement }>,
	) => {
		const oppgave = reservasjon.reservertOppgaveV1Dto;
		const toggleMenu = (oppgaveValgt?: Oppgave) => {
			if (oppgaveValgt && (!valgtOppgaveId || valgtOppgaveId !== oppgaveValgt.eksternId)) {
				setValgtOppgaveId(oppgaveValgt.eksternId);
			} else {
				setValgtOppgaveId(undefined);
			}
		};

		return (
			<Table.Row
				key={oppgave.eksternId}
				className={classNames(styles.isUnderBehandling, { [styles.hastesak]: gjelderHastesaker })}
				onKeyDown={() => goToFagsak(oppgave)}
			>
				{gjelderHastesaker && (
					<Table.DataCell onClick={() => goToFagsak(oppgave)} className={`${styles.hastesakTd} hover:cursor-pointer`}>
						<ExclamationmarkTriangleFillIcon height="1.5rem" width="1.5rem" className={styles.hastesakIkon} />
					</Table.DataCell>
				)}
				<Table.DataCell
					onClick={() => goToFagsak(oppgave)}
					className={`${gjelderHastesaker ? '' : styles.soekerPadding} hover:cursor-pointer`}
				>
					{oppgave.navn ? `${oppgave.navn} ${oppgave.personnummer}` : '<navn>'}
				</Table.DataCell>
				<Table.DataCell onClick={() => goToFagsak(oppgave)} className="hover:cursor-pointer">
					{oppgave.saksnummer || oppgave.journalpostId || ''}
				</Table.DataCell>
				<Table.DataCell onClick={() => goToFagsak(oppgave)} className="hover:cursor-pointer">
					{oppgave.behandlingstype.navn}
				</Table.DataCell>
				<Table.DataCell onClick={() => goToFagsak(oppgave)} className="hover:cursor-pointer">
					{oppgave.opprettetTidspunkt && <DateLabel dateString={oppgave.opprettetTidspunkt} />}
				</Table.DataCell>
				<Table.DataCell onClick={() => goToFagsak(oppgave)} className={`${styles.reservertTil} hover:cursor-pointer`}>
					<FormattedMessage
						id="OppgaveHandlingerMenu.ReservertTil"
						values={{
							...getDateAndTime(oppgave.status.reservertTilTidspunkt),
							// eslint-disable-next-line react/no-unstable-nested-components
							b: (...chunks) => <b>{chunks}</b>,
						}}
					/>
				</Table.DataCell>
				<Table.DataCell>
					<KommentarMedMerknad reservasjon={reservasjon} />
				</Table.DataCell>
				<Table.DataCell className={styles.menuElement}>
					<div
						ref={(el) => {
							if (el && ref && ref.current) {
								ref.current[oppgave.eksternId] = el;
							}
						}}
						onKeyDown={(event) => event.stopPropagation()}
					>
						{valgtOppgaveId === oppgave.eksternId && (
							<OppgaveHandlingerMenu
								imageNode={ref?.current[valgtOppgaveId]}
								toggleMenu={toggleMenu}
								oppgave={oppgave}
								reservasjon={reservasjon}
								forlengOppgaveReservasjon={forlengOppgaveReservasjonFn}
							/>
						)}
						<Button
							icon={<MenuHamburgerIcon />}
							className="p-0"
							variant="tertiary"
							aria-label="Handlinger på oppgave"
							onClick={() => toggleMenu(oppgave)}
						/>
					</div>
				</Table.DataCell>
			</Table.Row>
		);
	},
);

export default ReservertOppgaveRadV1;

import React, { FunctionComponent, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import NavFrontendChevron from 'nav-frontend-chevron';
import { BodyShort, ErrorMessage, Label, Loader, Table } from '@navikt/ds-react';
import { useForlengOppgavereservasjon, useSaksbehandlerReservasjoner } from 'api/queries/saksbehandlerQueries';
import ReservasjonV3 from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import { getHeaderCodes } from 'saksbehandler/behandlingskoer/components/oppgavetabeller/oppgavetabellerfelles';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import { OppgavestatusV3 } from 'types/OppgaveV3';
import * as kopanelStyles from '../oppgavekoPanel.css';
import OppgaveTabellMenyAntallOppgaver from './OppgaveTabellMenyAntallOppgaver';
import ReservertOppgaveRadV3 from './ReservertOppgaveRadV3';
import * as styles from './oppgaverTabell.css';

interface OwnProps {
	gjelderHastesaker?: boolean;
}

const ReserverteOppgaverTabell: FunctionComponent<OwnProps> = ({ gjelderHastesaker }) => {
	const [valgtOppgaveId, setValgtOppgaveId] = useState<string>();
	const [visReservasjoner, setVisReservasjoner] = useState(true);

	const { data: reservasjoner, isLoading, isSuccess, isError } = useSaksbehandlerReservasjoner();
	const { mutate: forlengOppgaveReservasjonMutation } = useForlengOppgavereservasjon();

	const forlengOppgaveReservasjon = (oppgaveNøkkel: OppgaveNøkkel) => {
		forlengOppgaveReservasjonMutation({ oppgaveNøkkel });
	};

	const ref = useRef({});

	const countReservations = (reservasjon: ReservasjonV3) => {
		const v3OppgaverSomSkalVises = reservasjon.reserverteV3Oppgaver?.filter(
			(v) => v.oppgavestatus === OppgavestatusV3.AAPEN,
		);
		if (v3OppgaverSomSkalVises?.length > 0) {
			return v3OppgaverSomSkalVises.length;
		}
		return 0;
	};

	const antallReservasjoner =
		reservasjoner?.reduce((previousValue, reservasjon) => previousValue + countReservations(reservasjon), 0) || 0;

	return (
		<>
			<button
				type="button"
				className={kopanelStyles.behandlingskoerKnapp}
				onClick={() => setVisReservasjoner(!visReservasjoner)}
			>
				<NavFrontendChevron type={visReservasjoner ? 'ned' : 'høyre'} className={kopanelStyles.chevron} />
				<Label>
					<FormattedMessage
						id={gjelderHastesaker ? 'OppgaverTabell.ReserverteHastesaker' : 'OppgaverTabell.ReserverteOppgaver'}
					/>
				</Label>
				{isSuccess && (
					<OppgaveTabellMenyAntallOppgaver
						antallOppgaver={antallReservasjoner}
						tekstId={
							gjelderHastesaker
								? 'OppgaverTabell.ReserverteHastesakerAntall'
								: 'OppgaverTabell.ReserverteOppgaverAntall'
						}
						hastesak={gjelderHastesaker}
					/>
				)}
			</button>
			{isLoading && visReservasjoner && <Loader size="large" className={styles.spinner} />}
			{isError && visReservasjoner && <ErrorMessage>Noe gikk galt ved lasting av reservasjoner</ErrorMessage>}
			{antallReservasjoner === 0 && isSuccess && visReservasjoner && (
				<>
					<VerticalSpacer eightPx />
					<BodyShort size="small">
						{!gjelderHastesaker ? (
							<FormattedMessage id="OppgaverTabell.IngenReserverteOppgaver" />
						) : (
							<FormattedMessage id="OppgaverTabell.IngenReserverteHastesaker" />
						)}
					</BodyShort>
				</>
			)}
			{antallReservasjoner > 0 && isSuccess && visReservasjoner && (
				<Table>
					<Table.Header>
						<Table.Row>
							{getHeaderCodes(true, gjelderHastesaker)
								.filter(Boolean)
								.map((header) => (
									<Table.HeaderCell key={header}>
										{!header.includes('EMPTY') ? <FormattedMessage id={header} /> : ''}
									</Table.HeaderCell>
								))}
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{reservasjoner
							.sort((a, b) => new Date(a.reservertTil).getTime() - new Date(b.reservertTil).getTime())
							.map((reservasjon) =>
								reservasjon.reserverteV3Oppgaver
									?.filter((v) => v.oppgavestatus === OppgavestatusV3.AAPEN)
									.map((oppgave) => (
										<ReservertOppgaveRadV3
											key={oppgave.oppgaveNøkkel.oppgaveEksternId}
											oppgave={oppgave}
											reservasjon={reservasjon}
											forlengOppgaveReservasjonFn={forlengOppgaveReservasjon}
											valgtOppgaveId={valgtOppgaveId}
											setValgtOppgaveId={setValgtOppgaveId}
											gjelderHastesaker={gjelderHastesaker}
											ref={ref}
										/>
									)),
							)}
					</Table.Body>
				</Table>
			)}
		</>
	);
};

export default ReserverteOppgaverTabell;

import React, { FunctionComponent, useState } from 'react';
import NavFrontendChevron from 'nav-frontend-chevron';
import { BodyShort, ErrorMessage, Label, Loader, Table } from '@navikt/ds-react';
import { useSaksbehandlerReservasjoner } from 'api/queries/saksbehandlerQueries';
import ReservasjonV3 from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { OppgavestatusV3 } from 'types/OppgaveV3';
import * as kopanelStyles from '../oppgavekoPanel.css';
import OppgaveTabellMenyAntallOppgaver from './OppgaveTabellMenyAntallOppgaver';
import ReservertOppgaveRadV3 from './ReservertOppgaveRadV3';
import * as styles from './oppgaverTabell.css';

const ReserverteOppgaverTabell: FunctionComponent = () => {
	const [visReservasjoner, setVisReservasjoner] = useState(true);

	const { data: reservasjoner, isLoading, isSuccess, isError } = useSaksbehandlerReservasjoner();

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
				<Label>Reserverte oppgaver</Label>
				{isSuccess && <OppgaveTabellMenyAntallOppgaver tekst={`${antallReservasjoner} reserverte`} />}
			</button>
			{isLoading && visReservasjoner && <Loader size="large" className={styles.spinner} />}
			{isError && visReservasjoner && <ErrorMessage>Noe gikk galt ved lasting av reservasjoner</ErrorMessage>}
			{antallReservasjoner === 0 && isSuccess && visReservasjoner && (
				<>
					<VerticalSpacer eightPx />
					<BodyShort size="small">Det er ingen reserverte oppgaver</BodyShort>
				</>
			)}
			{antallReservasjoner > 0 && isSuccess && visReservasjoner && (
				<Table>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Søker</Table.HeaderCell>
							<Table.HeaderCell>Id</Table.HeaderCell>
							<Table.HeaderCell>Behandlingstype</Table.HeaderCell>
							<Table.HeaderCell>Oppgave opprettet</Table.HeaderCell>
							<Table.HeaderCell>Reservasjon</Table.HeaderCell>
							<Table.HeaderCell className="w-10" />
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

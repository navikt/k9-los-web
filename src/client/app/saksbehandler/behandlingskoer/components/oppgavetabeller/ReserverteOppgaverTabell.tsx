import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort, ErrorMessage, Label, Loader, Table } from '@navikt/ds-react';
import { useSaksbehandlerReservasjoner } from 'api/queries/saksbehandlerQueries';
import { type FunctionComponent, useRef, useState } from 'react';
import type ReservasjonV3 from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import { OppgavestatusV3 } from 'types/OppgaveV3';
import * as kopanelStyles from '../oppgavekoPanel.module.css';
import OppgaveTabellMenyAntallOppgaver from './OppgaveTabellMenyAntallOppgaver';
import styles from './oppgaverTabell.module.css';
import ReservertOppgaveRadV3 from './ReservertOppgaveRadV3';
import { useRadFlyttAnimasjon } from './radFlyttAnimasjon';
import { nøkkelStreng, sorterOppgaverIReservasjon, sorterReservasjoner } from './reserverteOppgaverSortering';

const ReserverteOppgaverTabell: FunctionComponent = () => {
	const [visReservasjoner, setVisReservasjoner] = useState(true);
	const tabellinnholdRef = useRef<HTMLTableSectionElement>(null);

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

	const rader = sorterReservasjoner(reservasjoner ?? []).flatMap((reservasjon) =>
		sorterOppgaverIReservasjon(
			reservasjon.reserverteV3Oppgaver?.filter((v) => v.oppgavestatus === OppgavestatusV3.AAPEN) ?? [],
		).map((oppgave) => ({ oppgave, reservasjon, radnøkkel: nøkkelStreng(oppgave.oppgaveNøkkel) })),
	);

	useRadFlyttAnimasjon(tabellinnholdRef, rader.map((rad) => rad.radnøkkel).join());

	return (
		<>
			<button
				type="button"
				className={kopanelStyles.behandlingskoerKnapp}
				onClick={() => setVisReservasjoner(!visReservasjoner)}
			>
				{visReservasjoner ? (
					<ChevronDownIcon className={kopanelStyles.chevron} />
				) : (
					<ChevronRightIcon className={kopanelStyles.chevron} />
				)}
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
					<Table.Body ref={tabellinnholdRef}>
						{rader.map(({ oppgave, reservasjon, radnøkkel }) => (
							<ReservertOppgaveRadV3
								key={radnøkkel}
								radnøkkel={radnøkkel}
								oppgave={oppgave}
								reservasjon={reservasjon}
							/>
						))}
					</Table.Body>
				</Table>
			)}
		</>
	);
};

export default ReserverteOppgaverTabell;

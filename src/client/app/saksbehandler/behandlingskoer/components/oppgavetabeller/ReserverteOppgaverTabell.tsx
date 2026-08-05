import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort, ErrorMessage, Label, Loader, Table } from '@navikt/ds-react';
import { useSaksbehandlerReservasjoner } from 'api/queries/saksbehandlerQueries';
import classnames from 'classnames/bind';
import { type FunctionComponent, useRef, useState } from 'react';
import * as kopanelStyles from '../oppgavekoPanel.module.css';
import OppgaveTabellMenyAntallOppgaver from './OppgaveTabellMenyAntallOppgaver';
import styles from './oppgaverTabell.module.css';
import ReservertOppgaveRadV3 from './ReservertOppgaveRadV3';
import { useRadFlyttAnimasjon } from './radFlyttAnimasjon';
import { nøkkelStreng, sorterOppgaverIReservasjon, sorterReservasjoner } from './reserverteOppgaverSortering';

const classNames = classnames.bind(styles);

const ReserverteOppgaverTabell: FunctionComponent = () => {
	const [visReservasjoner, setVisReservasjoner] = useState(true);
	const tabellRef = useRef<HTMLTableElement>(null);

	const { data: reservasjoner, isLoading, isSuccess, isError } = useSaksbehandlerReservasjoner();

	/**
	 * Én gruppe per reservasjon. Alle oppgavene i gruppen deler reservasjonsnøkkel,
	 * og handlingene gjelder derfor hele gruppen — ikke den enkelte oppgaven.
	 */
	const reservasjonsgrupper = sorterReservasjoner(reservasjoner ?? [])
		.map((reservasjon) => ({
			reservasjon,
			oppgaver: sorterOppgaverIReservasjon(reservasjon.reserverteV3Oppgaver),
		}))
		.filter((gruppe) => gruppe.oppgaver.length > 0);

	const antallReservasjoner = reservasjonsgrupper.reduce((antall, gruppe) => antall + gruppe.oppgaver.length, 0);

	useRadFlyttAnimasjon(
		tabellRef,
		reservasjonsgrupper.flatMap((gruppe) => gruppe.oppgaver.map((o) => nøkkelStreng(o.oppgaveNøkkel))).join(),
	);

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
				<Table ref={tabellRef}>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Søker</Table.HeaderCell>
							<Table.HeaderCell>Sak</Table.HeaderCell>
							<Table.HeaderCell>Ytelse</Table.HeaderCell>
							<Table.HeaderCell>Behandlingstype</Table.HeaderCell>
							<Table.HeaderCell></Table.HeaderCell>
							<Table.HeaderCell>Reservert&nbsp;til</Table.HeaderCell>
							<Table.HeaderCell>Handlinger</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					{reservasjonsgrupper.map(({ reservasjon, oppgaver }) => (
						<Table.Body
							key={reservasjon.reservasjonsnøkkel}
							className={classNames('reservasjonsgruppe', { flereOppgaver: oppgaver.length > 1 })}
						>
							{oppgaver.map((oppgave, indeks) => (
								<ReservertOppgaveRadV3
									key={nøkkelStreng(oppgave.oppgaveNøkkel)}
									radnøkkel={nøkkelStreng(oppgave.oppgaveNøkkel)}
									oppgave={oppgave}
									reservasjon={reservasjon}
									antallOppgaverIReservasjonen={oppgaver.length}
									visHandlinger={indeks === 0}
								/>
							))}
						</Table.Body>
					))}
				</Table>
			)}
		</>
	);
};

export default ReserverteOppgaverTabell;

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort, ErrorMessage, Label, Loader, Switch, Table } from '@navikt/ds-react';
import { useSaksbehandlerReservasjoner } from 'api/queries/saksbehandlerQueries';
import classnames from 'classnames/bind';
import { type FunctionComponent, useRef, useState } from 'react';
import { idKolonneTittel } from 'saksbehandler/tabellvisning';
import { OppgavestatusV3 } from 'types/OppgaveV3';
import * as kopanelStyles from '../oppgavekoPanel.module.css';
import OppgaveTabellMenyAntallOppgaver from './OppgaveTabellMenyAntallOppgaver';
import styles from './oppgaverTabell.module.css';
import ReservertOppgaveRadV3 from './ReservertOppgaveRadV3';
import { useRadFlyttAnimasjon } from './radFlyttAnimasjon';
import {
	filtrerOppgaverEtterStatus,
	nøkkelStreng,
	sorterOppgaverIReservasjon,
	sorterReservasjoner,
} from './reserverteOppgaverSortering';

const classNames = classnames.bind(styles);

const ReserverteOppgaverTabell: FunctionComponent = () => {
	const [visReservasjoner, setVisReservasjoner] = useState(true);
	const [visOppgaverPåVent, setVisOppgaverPåVent] = useState(false);
	const tabellRef = useRef<HTMLTableElement>(null);

	const { data: reservasjoner, isLoading, isSuccess, isError } = useSaksbehandlerReservasjoner();
	const harOppgaverPåVent = reservasjoner?.some((reservasjon) =>
		reservasjon.reserverteV3Oppgaver.some((oppgave) => oppgave.oppgavestatus === OppgavestatusV3.VENTER),
	);

	/**
	 * Én gruppe per reservasjon. Alle oppgavene i gruppen deler reservasjonsnøkkel,
	 * og handlingene gjelder derfor hele gruppen — ikke den enkelte oppgaven.
	 */
	const reservasjonsgrupper = sorterReservasjoner(reservasjoner ?? [])
		.map((reservasjon) => ({
			reservasjon,
			oppgaver: sorterOppgaverIReservasjon(
				filtrerOppgaverEtterStatus(reservasjon.reserverteV3Oppgaver, visOppgaverPåVent),
			),
		}))
		.filter((gruppe) => gruppe.oppgaver.length > 0);

	const visteOppgaver = reservasjonsgrupper.flatMap((gruppe) => gruppe.oppgaver);
	const antallReservasjoner = visteOppgaver.length;

	useRadFlyttAnimasjon(tabellRef, visteOppgaver.map((oppgave) => nøkkelStreng(oppgave.oppgaveNøkkel)).join());

	return (
		<>
			<div className={kopanelStyles.behandlingskoerHeader}>
				<button
					type="button"
					className={kopanelStyles.behandlingskoerKnapp}
					aria-expanded={visReservasjoner}
					aria-controls="reserverte-oppgaver"
					onClick={() => setVisReservasjoner(!visReservasjoner)}
				>
					{visReservasjoner ? (
						<ChevronDownIcon className={kopanelStyles.chevron} aria-hidden />
					) : (
						<ChevronRightIcon className={kopanelStyles.chevron} aria-hidden />
					)}
					<Label>Reserverte oppgaver</Label>
					{isSuccess && <OppgaveTabellMenyAntallOppgaver tekst={`${antallReservasjoner} reserverte`} />}
				</button>
				{visReservasjoner && harOppgaverPåVent && (
					<Switch
						size="small"
						checked={visOppgaverPåVent}
						onChange={(event) => setVisOppgaverPåVent(event.target.checked)}
					>
						Vis oppgaver på vent
					</Switch>
				)}
			</div>
			<div id="reserverte-oppgaver">
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
								<Table.HeaderCell>{idKolonneTittel(visteOppgaver)}</Table.HeaderCell>
								<Table.HeaderCell>Behandlingstype</Table.HeaderCell>
								<Table.HeaderCell>Oppgave opprettet</Table.HeaderCell>
								<Table.HeaderCell>Reservert t.o.m.</Table.HeaderCell>
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
			</div>
		</>
	);
};

export default ReserverteOppgaverTabell;

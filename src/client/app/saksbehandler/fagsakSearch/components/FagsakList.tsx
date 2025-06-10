import React, { FunctionComponent } from 'react';
import NavFrontendChevron from 'nav-frontend-chevron';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import Oppgave from 'saksbehandler/oppgaveTsType';
import Table from 'sharedComponents/Table';
import TableColumn from 'sharedComponents/TableColumn';
import TableRow from 'sharedComponents/TableRow';
import { getYearFromString } from 'utils/dateUtils';
import { getKodeverknavnFraKode } from 'utils/kodeverkUtils';
import * as styles from './fagsakList.css';

const headerTextCodes = [
	'EMPTY_1',
	'FagsakList.Saksnummer',
	'FagsakList.Navn',
	'FagsakList.Stonadstype',
	'FagsakList.Status',
	'EMPTY_2',
	'EMPTY_3',
];

interface OwnProps {
	fagsakOppgaver: Oppgave[];
	setOppgave: (oppgave: Oppgave) => void;
	goToFagsak: (oppgave: Oppgave) => void;
}

/**
 * FagsakList
 *
 * Presentasjonskomponent. Formaterer fagsak-søkeresultatet for visning i tabell. Sortering av fagsakene blir håndtert her.
 */
const FagsakList: FunctionComponent<OwnProps> = ({ fagsakOppgaver, setOppgave }) => {
	const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

	const onClick = (oppgave: Oppgave) => {
		setOppgave(oppgave);
	};

	const fagsaksperiodeÅr = (oppgave) =>
		oppgave.fagsakPeriode ? `(${getYearFromString(oppgave.fagsakPeriode.fom)})` : '';

	return (
		<Table headerTextCodes={headerTextCodes} classNameTable={styles.table}>
			{fagsakOppgaver.map((oppgave, index) => (
				<TableRow
					key={`oppgave${oppgave.eksternId}`}
					id={oppgave.eksternId}
					onMouseDown={() => onClick(oppgave)}
					onKeyDown={() => onClick(oppgave)}
					isDashedBottomBorder={fagsakOppgaver.length > index + 1}
					className={oppgave.merknad ? styles.hastesakRad : ''}
				>
					<TableColumn>
						{!!oppgave.merknad && (
							<ExclamationmarkTriangleFillIcon height="1.5rem" width="1.5rem" className={styles.hastesakIkon} />
						)}
					</TableColumn>

					<TableColumn>
						{oppgave.saksnummer ? `${oppgave.saksnummer} ${fagsaksperiodeÅr(oppgave)}` : `${oppgave.journalpostId}`}
					</TableColumn>
					<TableColumn>{oppgave.navn}</TableColumn>
					<TableColumn>
						{getKodeverknavnFraKode(oppgave.fagsakYtelseType.kode, kodeverkTyper.FAGSAK_YTELSE_TYPE, alleKodeverk)}
					</TableColumn>
					<TableColumn>
						{getKodeverknavnFraKode(oppgave.behandlingStatus.kode, kodeverkTyper.BEHANDLING_STATUS, alleKodeverk)}
					</TableColumn>
					<TableColumn>
						{/*
							Har ikke lenger beskrivelse på selve oppgaven. 
							Vi må finne ut om vi forstatt skal vise informasjon om reservasjon her
							<KommentarMedMerknad reservasjon={oppgave} /> 
							*/}
					</TableColumn>
					<TableColumn>
						<NavFrontendChevron />
					</TableColumn>
				</TableRow>
			))}
		</Table>
	);
};

export default FagsakList;

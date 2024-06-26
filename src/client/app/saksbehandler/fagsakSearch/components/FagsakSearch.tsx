import React, { FunctionComponent, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import queryString from 'query-string';
import { SokeResultat } from 'saksbehandler/fagsakSearch/sokeResultatTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { hasValidSaksnummerEllerJournalpostFormat } from 'utils/validation/validators';
import FagsakList from './FagsakList';
import SearchForm from './SearchForm';
import * as styles from './fagsakSearch.css';
import PersonInfo from './person/PersonInfo';

interface OwnProps {
	resultat: SokeResultat;
	searchFagsakCallback: ({ searchString, skalReservere }: { searchString: string; skalReservere: boolean }) => void;
	searchResultReceived: boolean;
	selectOppgaveCallback: (oppgave: Oppgave, reserver: boolean, onError?: (errorMessage: string) => void) => void;
	searchStarted: boolean;
	searchResultAccessDenied?: {
		feilmelding?: string;
	};
	goToFagsak: (oppgave: Oppgave) => void;
}

const skalViseListe = (resultat) => {
	if (!resultat && !resultat.oppgaver) {
		return false;
	}
	return resultat.oppgaver.length >= 1;
};

/**
 * FagsakSearch
 *
 * Presentasjonskomponent. Denne setter sammen de ulike komponentene i søkebildet.
 * Er søkeresultat mottatt vises enten trefflisten og relatert person, eller en tekst som viser ingen resultater.
 */
const FagsakSearch: FunctionComponent<OwnProps> = ({
	resultat,
	searchFagsakCallback,
	selectOppgaveCallback,
	searchResultReceived,
	searchStarted,
	searchResultAccessDenied,
	goToFagsak,
}) => {
	const [oppgaveSoktForViaQueryErAlleredeReservert, setOppgaveSoktForViaParamsErAlleredeReservert] =
		useState<Oppgave>(null);
	const { location } = window;
	const queryFraURL = queryString.parse(typeof location !== 'undefined' ? location.search : '');
	const erSokViaQueryParams =
		typeof queryFraURL.sok !== 'undefined' && !hasValidSaksnummerEllerJournalpostFormat(queryFraURL.sok);

	useEffect(() => {
		if (erSokViaQueryParams) {
			const paramToString = queryFraURL.sok.toString();
			searchFagsakCallback({
				searchString: paramToString,
				skalReservere: false,
			});
		}
	}, []);

	useEffect(() => {
		const eksistererEttResultatFraQuerySok =
			erSokViaQueryParams && resultat && resultat.ikkeTilgang === false && resultat.oppgaver.length === 1;

		if (eksistererEttResultatFraQuerySok && resultat.oppgaver[0].status.erReservertAvInnloggetBruker) {
			goToFagsak(resultat.oppgaver[0]);
		} else if (
			eksistererEttResultatFraQuerySok &&
			resultat.oppgaver[0].status.erReservert &&
			!resultat.oppgaver[0].status.erReservertAvInnloggetBruker
		) {
			setOppgaveSoktForViaParamsErAlleredeReservert(resultat.oppgaver[0]);
		} else {
			setOppgaveSoktForViaParamsErAlleredeReservert(null);
		}
	}, [resultat]);

	return (
		<div>
			<SearchForm
				onSubmit={searchFagsakCallback}
				searchStarted={searchStarted}
				searchResultAccessDenied={searchResultAccessDenied}
			/>
			{searchResultReceived && resultat && resultat.oppgaver.length === 0 && resultat.ikkeTilgang === false && (
				<Normaltekst className={styles.label}>
					<FormattedMessage id="FagsakSearch.ZeroSearchResults" />
				</Normaltekst>
			)}
			{searchResultReceived && resultat && resultat.oppgaver.length === 0 && resultat.ikkeTilgang === true && (
				<Normaltekst className={styles.label}>
					<FormattedMessage id="FagsakSearch.IkkeTilgang" />
				</Normaltekst>
			)}
			{searchResultReceived && skalViseListe(resultat) && (
				<>
					{resultat.person && <PersonInfo person={resultat.person} />}
					<VerticalSpacer sixteenPx />
					<Normaltekst>
						<FormattedMessage id="FagsakSearch.FlereApneBehandlinger" />
					</Normaltekst>
					<FagsakList
						fagsakOppgaver={resultat.oppgaver}
						selectOppgaveCallback={selectOppgaveCallback}
						oppgaveSoktForViaQueryErAlleredeReservert={oppgaveSoktForViaQueryErAlleredeReservert}
					/>
				</>
			)}
		</div>
	);
};

FagsakSearch.defaultProps = {
	searchResultAccessDenied: undefined,
};

export default FagsakSearch;

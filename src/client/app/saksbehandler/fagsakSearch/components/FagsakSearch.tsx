import React, { FunctionComponent, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import queryString from 'query-string';
import { BodyShort } from '@navikt/ds-react';
import { useSøk } from 'api/queries/saksbehandlerQueries';
import Oppgave from 'saksbehandler/oppgaveTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { hasValidSaksnummerEllerJournalpostFormat } from 'utils/validation/validators';
import FagsakList from './FagsakList';
import SearchForm from './SearchForm';
import * as styles from './fagsakSearch.css';
import PersonInfo from './person/PersonInfo';

interface OwnProps {
	setOppgave: (oppgave: Oppgave) => void;
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
const FagsakSearch: FunctionComponent<OwnProps> = ({ setOppgave, goToFagsak }) => {
	const queryFraURL = queryString.parse(window.location?.search ? window.location.search : '');
	const erSokViaQueryParams = queryFraURL.sok && !hasValidSaksnummerEllerJournalpostFormat(queryFraURL.sok);
	const { data: resultat, mutate: sok, isSuccess, isPending } = useSøk();
	useEffect(() => {
		if (erSokViaQueryParams) {
			const paramToString = queryFraURL.sok.toString();
			sok(paramToString);
		}
	}, []);

	return (
		<div>
			<SearchForm onSubmit={sok} searchStarted={isPending} />
			{isSuccess && resultat && resultat.oppgaver.length === 0 && !resultat.ikkeTilgang && (
				<BodyShort className={styles.label}>
					<FormattedMessage id="FagsakSearch.ZeroSearchResults" />
				</BodyShort>
			)}
			{isSuccess && resultat && resultat.oppgaver.length === 0 && resultat.ikkeTilgang && (
				<BodyShort className={styles.label}>
					<FormattedMessage id="FagsakSearch.IkkeTilgang" />
				</BodyShort>
			)}
			{isSuccess && skalViseListe(resultat) && (
				<>
					{resultat.person && <PersonInfo person={resultat.person} />}
					<VerticalSpacer sixteenPx />
					<BodyShort>
						<FormattedMessage id="FagsakSearch.FlereApneBehandlinger" />
					</BodyShort>
					<FagsakList fagsakOppgaver={resultat.oppgaver} setOppgave={setOppgave} goToFagsak={goToFagsak} />
				</>
			)}
		</div>
	);
};

export default FagsakSearch;

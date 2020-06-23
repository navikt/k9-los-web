import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import Oppgave from 'saksbehandler/oppgaveTsType';
import oppgavePropType from 'saksbehandler/oppgavePropType';
import { Fagsak } from 'saksbehandler/fagsakSearch/fagsakTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import fagsakPropType from '../fagsakPropType';
import PersonInfo from './person/PersonInfo';
import SearchForm from './SearchForm';
import FagsakList from './FagsakList';

import styles from './fagsakSearch.less';

interface OwnProps {
  fagsaker: Fagsak[];
  fagsakOppgaver: Oppgave[];
  searchFagsakCallback: ({ searchString: string, skalReservere: boolean }) => void;
  searchResultReceived: boolean;
  selectFagsakCallback: (saksnummer: string) => void;
  selectOppgaveCallback: (oppgave: Oppgave, reserver: boolean) => void;
  searchStarted: boolean;
  searchResultAccessDenied?: {
    feilmelding?: string;
  };
  resetSearch: () => void;
}

const skalViseListe = (fagsaker, fagsakOppgaver) => {
  if (!fagsaker && !fagsakOppgaver) {
    return false;
  }
  return fagsaker.length >= 1 || (fagsaker.length >= 1 && fagsakOppgaver.filter((oppgave) => oppgave.saksnummer === fagsaker[0].saksnummer).length > 1);
};

/**
 * FagsakSearch
 *
 * Presentasjonskomponent. Denne setter sammen de ulike komponentene i søkebildet.
 * Er søkeresultat mottatt vises enten trefflisten og relatert person, eller en tekst som viser ingen resultater.
 */
const FagsakSearch: FunctionComponent<OwnProps> = ({
  fagsaker,
  fagsakOppgaver,
  searchFagsakCallback,
  selectOppgaveCallback,
  searchResultReceived,
  selectFagsakCallback,
  searchStarted,
  searchResultAccessDenied,
  resetSearch,
}) => (
  <div>
    <SearchForm
      onSubmit={searchFagsakCallback}
      searchStarted={searchStarted}
      searchResultAccessDenied={searchResultAccessDenied}
      resetSearch={resetSearch}
    />
    {searchResultReceived && fagsaker && fagsaker.length === 0
      && <Normaltekst className={styles.label}><FormattedMessage id="FagsakSearch.ZeroSearchResults" /></Normaltekst>}
    {searchResultReceived && skalViseListe(fagsaker, fagsakOppgaver) && (
      <>
        <PersonInfo person={fagsaker[0].person} />
        <VerticalSpacer sixteenPx />
        <Normaltekst>
          <FormattedMessage id="FagsakSearch.FlereApneBehandlinger" />
        </Normaltekst>
        <FagsakList selectFagsakCallback={selectFagsakCallback} selectOppgaveCallback={selectOppgaveCallback} />
      </>
    )}
  </div>
);

FagsakSearch.defaultProps = {
  searchResultAccessDenied: undefined,
};

export default FagsakSearch;

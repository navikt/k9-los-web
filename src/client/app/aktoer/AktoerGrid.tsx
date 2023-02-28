import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent } from 'react';
import Lenkepanel from 'nav-frontend-lenkepanel';
import { SokeResultat } from 'saksbehandler/fagsakSearch/sokeResultatTsType';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { getK9punsjRef, getK9sakHref, getOmsorgspengerRef } from 'app/paths';
import Oppgave from 'saksbehandler/oppgaveTsType';
import PersonInfo from 'saksbehandler/fagsakSearch/components/person/PersonInfo';
import Lenke from 'nav-frontend-lenker';
import { getKodeverknavnFraKode } from 'utils/kodeverkUtils';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import useGlobalStateRestApiData from '../api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import styles from './aktoerGrid.css';
import OppgaveSystem from '../types/OppgaveSystem';

interface OwnProps {
  resultat: SokeResultat;
}

const linkFunc = (url, props) => (
  <Lenke href={url} className={props.className}>
    {props.children}
  </Lenke>
);

export const AktoerGrid: FunctionComponent<OwnProps> = ({ resultat }) => {
  const k9sakUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.K9SAK_URL);
  const k9punsjUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.PUNSJ_URL);
  const omsorgspengerUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.OMSORGSPENGER_URL);
  const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

  const getUrl = (oppgave: Oppgave) => {
    if (oppgave.system === OppgaveSystem.PUNSJ) {
      return getK9punsjRef(k9punsjUrl.verdi, oppgave.journalpostId);
    }
    if (oppgave.system === OppgaveSystem.OMSORGSPENGER) {
      return getOmsorgspengerRef(omsorgspengerUrl.verdi, oppgave.saksnummer);
    }
    return getK9sakHref(k9sakUrl.verdi, oppgave.saksnummer, oppgave.behandlingId);
  };

  return (
    <div className={styles.list}>
      {resultat.person && (
        <div className={styles.personInfo}>
          <PersonInfo person={resultat.person} />
        </div>
      )}
      {resultat.oppgaver.length ? (
        resultat.oppgaver.map(oppgave => (
          <Lenkepanel
            linkCreator={props => linkFunc(getUrl(oppgave), props)}
            key={oppgave.saksnummer}
            href="#"
            tittelProps="normaltekst"
          >
            {` ${oppgave.saksnummer} `}
            {` ${getKodeverknavnFraKode(oppgave.fagsakYtelseType, kodeverkTyper.FAGSAK_YTELSE_TYPE, alleKodeverk)} `}
          </Lenkepanel>
        ))
      ) : (
        <FormattedMessage id="AktoerGrid.IngenFagsaker" />
      )}
    </div>
  );
};

export default AktoerGrid;

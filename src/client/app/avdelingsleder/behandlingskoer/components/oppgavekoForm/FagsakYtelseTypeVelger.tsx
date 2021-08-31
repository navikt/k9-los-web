import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import { CheckboxField } from 'form/FinalFields';
import kodeverkTyper from 'kodeverk/kodeverkTyper';

import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';
import Kodeverk from 'kodeverk/kodeverkTsType';
import styles from './utvalgskriterierForOppgavekoForm.less';

const finnFagsakYtelseTypeNavn = (fagsakYtelseTyper, valgtFagsakYtelseType) => {
  const type = fagsakYtelseTyper.find((fyt) => fyt.kode === valgtFagsakYtelseType);
  return type ? type.navn : '';
};

interface OwnProps {
  valgtOppgavekoId: string;
  fagsakYtelseTyper: Kodeverk[];
  hentOppgaveko: (id: string) => void;
}

/**
 * FagsakYtelseTypeVelger
 */
const FagsakYtelseTypeVelger: FunctionComponent<OwnProps> = ({
  valgtOppgavekoId,
  fagsakYtelseTyper,
  hentOppgaveko,
}) => {
  const { startRequest: lagreOppgavekoFagsakYtelseType } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_FAGSAK_YTELSE_TYPE);
  const alleFagsakYtelseTyper = useKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE);

  const fagytelseTyperValt = [];
  const fagytelseTyperKnyttetTilOmsorgsdager = [
    fagsakYtelseType.OMSORGSDAGER_KRONISKSYK,
    fagsakYtelseType.OMSORGSDAGER_ALENEOMOMSORGEN,
    fagsakYtelseType.OMSORGSDAGER_MIDLERTIDIGALENE,
  ];

  if (fagsakYtelseTyper.length === 0) {
    fagytelseTyperValt.push(fagsakYtelseType.OMSORGSPENGER);
    fagytelseTyperValt.push(fagsakYtelseType.OMSORGSDAGER);
    fagytelseTyperValt.push(fagsakYtelseType.PLEIEPENGER_SYKT_BARN);
  } else {
    fagsakYtelseTyper.forEach((type) => {
      if (!fagytelseTyperValt.includes(type.kode) && !fagytelseTyperKnyttetTilOmsorgsdager.includes(type.kode)) {
        fagytelseTyperValt.push(type.kode);
      }
    });
  }

  const lagreFagytelserTyper = () => {
    lagreOppgavekoFagsakYtelseType({ id: valgtOppgavekoId, fagsakYtelseType: fagytelseTyperValt }).then(() => {
      hentOppgaveko(valgtOppgavekoId);
    });
  };

  const hantereFagytelsetypeValg = (type: string, checked: boolean) => {
    if (checked && !fagytelseTyperValt.includes(type) && !fagytelseTyperKnyttetTilOmsorgsdager.includes(type)) {
      fagytelseTyperValt.push(type);
    } else if (!checked && fagytelseTyperValt.includes(type)) {
      const indexTilTypeSomSkalSlettes = fagytelseTyperValt.indexOf(type, 0);
      if (indexTilTypeSomSkalSlettes > -1) fagytelseTyperValt.splice(indexTilTypeSomSkalSlettes, 1);
    }
    lagreFagytelserTyper();
  };

  return (
    <div className={styles.stonadsVelger}>
      <Normaltekst className={styles.label}>
        <FormattedMessage id="FagsakYtelseTypeVelger.Stonadstype" />
      </Normaltekst>
      <VerticalSpacer eightPx />
      <CheckboxField
        name={fagsakYtelseType.OMSORGSPENGER}
        label={finnFagsakYtelseTypeNavn(alleFagsakYtelseTyper, fagsakYtelseType.OMSORGSPENGER)}
        onChange={(checked) => hantereFagytelsetypeValg(fagsakYtelseType.OMSORGSPENGER, checked)}
        checked={fagytelseTyperValt.includes(fagsakYtelseType.OMSORGSPENGER)}
      />
      <VerticalSpacer fourPx />
      <CheckboxField
        name={fagsakYtelseType.OMSORGSDAGER}
        label="Omsorgsdager"
        onChange={(checked) => hantereFagytelsetypeValg(fagsakYtelseType.OMSORGSDAGER, checked)}
        checked={fagytelseTyperValt.includes(fagsakYtelseType.OMSORGSDAGER)}
      />
      <VerticalSpacer fourPx />
      <CheckboxField
        name={fagsakYtelseType.PLEIEPENGER_SYKT_BARN}
        label={finnFagsakYtelseTypeNavn(alleFagsakYtelseTyper, fagsakYtelseType.PLEIEPENGER_SYKT_BARN)}
        onChange={(checked) => hantereFagytelsetypeValg(fagsakYtelseType.PLEIEPENGER_SYKT_BARN, checked)}
        checked={fagytelseTyperValt.includes(fagsakYtelseType.PLEIEPENGER_SYKT_BARN)}
      />
      <VerticalSpacer fourPx />
      <CheckboxField
        name={fagsakYtelseType.UKJENT}
        label={finnFagsakYtelseTypeNavn(alleFagsakYtelseTyper, fagsakYtelseType.UKJENT)}
        onChange={(checked) => hantereFagytelsetypeValg(fagsakYtelseType.UKJENT, checked)}
        checked={fagytelseTyperValt.includes(fagsakYtelseType.UKJENT)}
      />
    </div>
  );
};

export default FagsakYtelseTypeVelger;

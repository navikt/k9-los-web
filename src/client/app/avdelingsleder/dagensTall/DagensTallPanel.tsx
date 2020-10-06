import React, { FunctionComponent } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import EnkelTeller from 'avdelingsleder/dagensTall/EnkelTeller';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import ApneBehandlinger from 'avdelingsleder/dagensTall/apneBehandlingerTsType';
import styles from './dagensTallPanel.less';

interface OwnProps {
    totaltIdag: number;
    dagensTall: ApneBehandlinger[];
}

const DagensTallPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({ totaltIdag, dagensTall }) => (
  <>
    <Normaltekst className={styles.header}>Status</Normaltekst>
    <VerticalSpacer twentyPx />
    <div className={styles.container}>
      <EnkelTeller antall={totaltIdag} tekst="Åpne behandlinger" />

      {dagensTall && dagensTall.map((dt) => (
        <EnkelTeller antall={dt.antall} tekst={dt.behandlingType.navn} />
      ))}
    </div>
  </>

);

export default injectIntl(DagensTallPanel);

import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import Image from 'sharedComponents/Image';
import Modal from 'sharedComponents/Modal';

import advarselImageUrl from 'images/advarsel.svg';
import { Saksbehandler } from '../saksbehandlerTsType';

import styles from './sletteSaksbehandlerModal.less';

type OwnProps = Readonly<{
  intl: any;
  valgtSaksbehandler: Saksbehandler;
  closeSletteModal: () => void;
  fjernSaksbehandler: (epost: string) => void;
}>;

/**
 * SletteSaksbehandlerModal
 *
 * Presentasjonskomponent. Modal som lar en avdelingsleder fjerne tilgjengelige saksbehandlere.
 */
const SletteSaksbehandlerModal: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  valgtSaksbehandler,
  closeSletteModal,
  fjernSaksbehandler,
}) => (
  <Modal
    className={styles.modal}
    closeButton={false}
    isOpen
    contentLabel={intl.formatMessage({ id: 'SletteSaksbehandlerModal.SletteModal' })}
    onRequestClose={closeSletteModal}
  >
    <div className={styles.text}>
      <Normaltekst>
        <FormattedMessage id="SletteSaksbehandlerModal.SletteSaksbehandler" values={{ saksbehandlerNavn: valgtSaksbehandler.navn }} />
      </Normaltekst>
    </div>
    <div className={styles.buttons}>
      <Column>
        <Knapp
          className={styles.cancelButton}
          mini
          htmlType="reset"
          onClick={closeSletteModal}
        >
          {intl.formatMessage({ id: 'SletteSaksbehandlerModal.Nei' })}
        </Knapp>
      </Column>
      <Column xs="4">
        <Hovedknapp
          className={styles.submitButton}
          mini
          htmlType="submit"
          onClick={() => fjernSaksbehandler(valgtSaksbehandler.epost)}
          autoFocus
        >
          {intl.formatMessage({ id: 'SletteSaksbehandlerModal.Ja' })}
        </Hovedknapp>
      </Column>
    </div>
  </Modal>
);

export default injectIntl(SletteSaksbehandlerModal);

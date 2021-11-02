import React, { FunctionComponent, useCallback } from 'react';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';

import { Form } from 'react-final-form';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import {
  hasValidText, maxLength, minLength, required,
} from 'utils/validation/validators';
import { TextAreaField } from 'form/FinalFields';
import Modal from 'sharedComponents/Modal';

import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';
import styles from './opphevReservasjonModal.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

type OwnProps = Readonly<{
  intl: any;
  showModal: boolean;
  oppgaveId: string;
  cancel: () => void;
  hentReserverteOppgaver: () => void;
}>;

/**
 * OpphevReservasjonModal
 *
 * Presentasjonskomponent. Modal som lar en begrunne hvorfor en sak skal frigjøres.
 */
export const OpphevReservasjonModal: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  showModal,
  cancel,
  hentReserverteOppgaver,
  oppgaveId,
}) => {
  const { startRequest: opphevOppgavereservasjon } = useRestApiRunner(K9LosApiKeys.OPPHEV_OPPGAVERESERVASJON);

  // Legg in så att man tar emot en CB funksjon når hooken forsvinner.
  const opphevReservasjonFn = useCallback((begrunnelse: string) => opphevOppgavereservasjon({ oppgaveId, begrunnelse })
    .then(() => {
      hentReserverteOppgaver();
      cancel();
    }),
  [oppgaveId]);

  return (
    <Modal
      className={styles.modal}
      isOpen={showModal}
      closeButton={false}
      contentLabel={intl.formatMessage({ id: 'OpphevReservasjonModal.Begrunnelse' })}
      onRequestClose={cancel}
    >
      <Form
        onSubmit={(values) => opphevReservasjonFn(values.begrunnelse)}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Undertittel><FormattedMessage id="OpphevReservasjonModal.Begrunnelse" /></Undertittel>
            <TextAreaField
              name="begrunnelse"
              label={intl.formatMessage({ id: 'OpphevReservasjonModal.Hjelpetekst' })}
              validate={[required, maxLength1500, minLength3, hasValidText]}
              maxLength={1500}
            />
            <Hovedknapp
              className={styles.submitButton}
              mini
              htmlType="submit"
              autoFocus
            >
              {intl.formatMessage({ id: 'OpphevReservasjonModal.Ok' })}
            </Hovedknapp>
            <Knapp
              className={styles.cancelButton}
              mini
              htmlType="reset"
              onClick={cancel}
            >
              {intl.formatMessage({ id: 'OpphevReservasjonModal.Avbryt' })}
            </Knapp>
          </form>
        )}
      />
    </Modal>
  );
};

export default injectIntl(OpphevReservasjonModal);

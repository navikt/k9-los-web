import React, { FunctionComponent } from 'react';

import { Form } from 'react-final-form';
import {
  injectIntl, FormattedMessage, WrappedComponentProps, IntlShape,
} from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';
import {
  required, minLength, maxLength, hasValidName,
} from 'utils/validation/validators';
import { InputField } from 'form/FinalFields';
import Image from 'sharedComponents/Image';
import SkjermetVelger from 'avdelingsleder/behandlingskoer/components/oppgavekoForm/SkjermetVelger';
import SaksbehandlereForOppgavekoForm from 'avdelingsleder/behandlingskoer/components/saksbehandlerForm/SaksbehandlereForOppgavekoForm';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import { useRestApi } from 'api/rest-api-hooks';
import { Oppgaveko } from '../../oppgavekoTsType';
import AutoLagringVedBlur from './AutoLagringVedBlur';
import BehandlingstypeVelger from './BehandlingstypeVelger';
import AndreKriterierVelger from './AndreKriterierVelger';
import FagsakYtelseTypeVelger from './FagsakYtelseTypeVelger';
import SorteringVelger from './SorteringVelger';

import styles from './utvalgskriterierForOppgavekoForm.less';
import binIcon from '../../../../../images/bin-1.svg';

const minLength3 = minLength(3);
const maxLength100 = maxLength(100);

interface OwnProps {
  valgtOppgaveko: Oppgaveko;
  hentAlleOppgavekoer: () => void;
  visModal: () => void;
  hentKo:(id: string) => void;
}

const buildInitialValues = (intl: IntlShape, ko: Oppgaveko) => {
  const behandlingTypes = ko.behandlingTyper ? ko.behandlingTyper.reduce((acc, bt) => ({ ...acc, [bt.kode]: true }), {}) : {};
  const fagsakYtelseType = ko.fagsakYtelseTyper && ko.fagsakYtelseTyper.length > 0
    ? ko.fagsakYtelseTyper[0].kode : '';

  const andreKriterierTyper = ko.andreKriterier
    ? ko.andreKriterier.reduce((acc, ak) => ({ ...acc, [ak.andreKriterierType.kode]: true }), {}) : {};
  const andreKriterierInkluder = ko.andreKriterier
    ? ko.andreKriterier.reduce((acc, ak) => ({ ...acc, [`${ak.andreKriterierType.kode}_inkluder`]: ak.inkluder }), {}) : {};

  return {
    id: ko.id,
    navn: ko.navn ? ko.navn : intl.formatMessage({ id: 'UtvalgskriterierForOppgavekoForm.NyListe' }),
    sortering: ko.sortering ? ko.sortering.sorteringType.kode : undefined,
    fomDato: ko.sortering ? ko.sortering.fomDato : undefined,
    tomDato: ko.sortering ? ko.sortering.tomDato : undefined,
    skjermet: ko.skjermet,
    fagsakYtelseType,
    ...andreKriterierTyper,
    ...andreKriterierInkluder,
    ...behandlingTypes,
  };
};

/**
 * UtvalgskriterierForOppgavekoForm
 */
export const UtvalgskriterierForOppgavekoForm: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  valgtOppgaveko,
  hentAlleOppgavekoer,
  hentKo,
  visModal,
}) => {
  const { startRequest: lagreOppgavekoNavn } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_NAVN);

  const transformValues = (values: {id: string; navn: string}) => {
    lagreOppgavekoNavn({ id: values.id, navn: values.navn }).then(() => hentAlleOppgavekoer()).then(() => hentKo(values.id));
  };

  const { data: alleSaksbehandlere = [] } = useRestApi<Saksbehandler[]>(K9LosApiKeys.SAKSBEHANDLERE);

  return (
    <div className={styles.form}>
      <Form
        onSubmit={() => undefined}
        initialValues={buildInitialValues(intl, valgtOppgaveko)}
        render={({ values }) => (
          <>
            <AutoLagringVedBlur lagre={transformValues} fieldNames={['navn']} />
            <Row className={styles.row}>
              <Column xs="4" className={styles.leftColumn}>
                <Normaltekst className={styles.header}>
                  <FormattedMessage id="UtvalgskriterierForOppgavekoForm.OmKoen" />
                </Normaltekst>
                <hr className={styles.line} />
                <Normaltekst className={styles.label}>{intl.formatMessage({ id: 'UtvalgskriterierForOppgavekoForm.Navn' })}</Normaltekst>
                <InputField
                  className={styles.navn}
                  name="navn"
                  validate={[required, minLength3, maxLength100, hasValidName]}
                  onBlurValidation
                  bredde="M"
                />
                <FagsakYtelseTypeVelger
                  valgtOppgavekoId={valgtOppgaveko.id}
                  hentOppgaveko={hentKo}
                  hentAlleOppgavekoer={hentAlleOppgavekoer}
                />
                <SkjermetVelger valgtOppgaveko={valgtOppgaveko} hentOppgaveko={hentKo} />
                <BehandlingstypeVelger
                  valgtOppgavekoId={valgtOppgaveko.id}
                  hentOppgaveko={hentKo}
                />
              </Column>
              <Column xs="8" className={styles.middle}>
                <Column className={styles.middleColumn}>
                  <Normaltekst className={styles.header}>
                    <FormattedMessage id="UtvalgskriterierForOppgavekoForm.Kriterier" />
                  </Normaltekst>
                  <hr className={styles.line} />
                  <AndreKriterierVelger
                    valgtOppgavekoId={valgtOppgaveko.id}
                    values={values}
                    hentOppgaveko={hentKo}
                  />
                  <SorteringVelger
                    valgtOppgavekoId={valgtOppgaveko.id}
                    valgteBehandlingtyper={valgtOppgaveko.behandlingTyper}
                    fomDato={values.fomDato}
                    tomDato={values.tomDato}
                    hentOppgaveko={hentKo}
                  />
                </Column>
                <Column className={styles.saksbehandlere}>
                  <Column>
                    <Normaltekst className={styles.header}>
                      <FormattedMessage id="UtvalgskriterierForOppgavekoForm.Saksbehandlere" />
                    </Normaltekst>
                    <hr className={styles.line1} />
                    <SaksbehandlereForOppgavekoForm
                      valgtOppgaveko={valgtOppgaveko}
                      alleSaksbehandlere={alleSaksbehandlere}
                      hentOppgaveko={hentKo}
                    />
                  </Column>
                  <Column>
                    <div className={styles.slettContainer}>
                      <Image src={binIcon} />
                      <div
                        id="slett"
                        className={styles.slett}
                        role="button"
                        onClick={visModal}
                        onKeyDown={visModal}
                        tabIndex={0}
                      >
                        Slett kø
                      </div>
                    </div>
                  </Column>
                </Column>
              </Column>
            </Row>
          </>
        )}
      />
    </div>

  );
};

export default injectIntl(UtvalgskriterierForOppgavekoForm);

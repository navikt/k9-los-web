
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';

import { getK9sakHref } from 'app/paths';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import oppgavePropType from '../../oppgavePropType';
import { Oppgave } from '../../oppgaveTsType';

interface TsProps {
  k9sakUrl: string;
  sistBehandledeSaker: Oppgave[];
}

/**
 * SistBehandledeSaker
 *
 * Denne komponenten viser de tre siste fagsakene en nav-ansatt har behandlet.
 */
const SistBehandledeSaker = ({
  k9sakUrl,
  sistBehandledeSaker,
}: TsProps) => (
  <>
    <Undertittel><FormattedMessage id="SistBehandledeSaker.SistBehandledeSaker" /></Undertittel>
    <VerticalSpacer eightPx />
    {sistBehandledeSaker.length === 0
      && <Normaltekst><FormattedMessage id="SistBehandledeSaker.IngenBehandlinger" /></Normaltekst>
    }
    {sistBehandledeSaker.map((sbs, index) => (
      <Fragment key={sbs.behandlingId}>
        <Normaltekst>
          {sbs.navn
            ? <Lenke href={getK9sakHref(k9sakUrl, sbs.saksnummer, sbs.behandlingId)}>{`${sbs.navn} ${sbs.personnummer}`}</Lenke>
            : (
              <Lenke href={getK9sakHref(k9sakUrl, sbs.saksnummer, sbs.behandlingId)}>
                <FormattedMessage id="SistBehandledeSaker.Behandling" values={{ index: index + 1 }} />
              </Lenke>
            )
          }
        </Normaltekst>
        <VerticalSpacer eightPx />
      </Fragment>
    ))}
  </>
);

SistBehandledeSaker.propTypes = {
  k9sakUrl: PropTypes.string.isRequired,
  sistBehandledeSaker: PropTypes.arrayOf(oppgavePropType).isRequired,
};

export default SistBehandledeSaker;

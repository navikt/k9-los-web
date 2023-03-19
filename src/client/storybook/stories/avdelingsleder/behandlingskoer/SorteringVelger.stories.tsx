import React, { useCallback, useState } from 'react';
import { Form } from 'react-final-form';
import { action } from '@storybook/addon-actions';
import SorteringVelger from 'avdelingsleder/behandlingskoer/components/oppgavekoForm/SorteringVelger';
import koSortering from 'kodeverk/KoSortering';
import behandlingType from 'kodeverk/behandlingType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import withIntl from '../../../decorators/withIntl.js';

const sorteringsTyper = {
  [kodeverkTyper.KO_SORTERING]: [
    {
      kode: koSortering.BEHANDLINGSFRIST,
      kodeverk: 'KO_SORTERING',
      navn: 'Dato for behandlingsfrist',
      felttype: 'DATO',
      feltkategori: 'UNIVERSAL',
    },
    {
      kode: koSortering.OPPRETT_BEHANDLING,
      kodeverk: 'KO_SORTERING',
      navn: 'Dato for opprettelse av behandling',
      felttype: 'DATO',
      feltkategori: 'UNIVERSAL',
    },
    {
      kode: koSortering.FORSTE_STONADSDAG,
      kodeverk: 'KO_SORTERING',
      navn: 'Dato for første stønadsdag',
      felttype: 'DATO',
      feltkategori: 'UNIVERSAL',
    },
    {
      kode: koSortering.BELOP,
      kodeverk: 'KO_SORTERING',
      navn: 'Feilutbetalt beløp',
      felttype: 'HELTALL',
      feltkategori: 'TILBAKEKREVING',
    },
    {
      kode: koSortering.FEILUTBETALINGSTART,
      kodeverk: 'KO_SORTERING',
      navn: 'Dato for første feilutbetaling',
      felttype: 'DATO',
      feltkategori: 'TILBAKEKREVING',
    },
  ],
};

export default {
  title: 'avdelingsleder/behandlingskoer/SorteringVelger',
  component: SorteringVelger,
  decorators: [withIntl],
};

export const skalViseSorteringsvelgerNårMangeBehandlingstyperErValgt = () => {
  const [verdier, leggTilVerdi] = useState({
    sortering: koSortering.BEHANDLINGSFRIST,
    fra: 2,
    til: 3,
    fomDato: undefined,
    tomDato: undefined,
    erDynamiskPeriode: true,
  });
  const lagre = useCallback((_oppgavekoId, sorteringType) => {
    leggTilVerdi(oldState => ({
      ...oldState,
      sortering: sorteringType,
    }));
  }, []);
  const lagreDynamiskPeriode = useCallback(() => {
    leggTilVerdi(oldState => ({
      ...oldState,
      erDynamiskPeriode: !oldState.erDynamiskPeriode,
    }));
  }, []);

  return (
    <Form
      onSubmit={() => undefined}
      initialValues={verdier}
      render={() => (
        <SorteringVelger
          alleKodeverk={sorteringsTyper}
          valgtOppgavekoId={1}
          valgteBehandlingtyper={[
            {
              kode: behandlingType.FORSTEGANGSSOKNAD,
              navn: 'Førstegang',
            },
            {
              kode: behandlingType.DOKUMENTINNSYN,
              navn: 'Innsyn',
            },
          ]}
          lagreOppgavekoSortering={lagre}
          lagreOppgavekoSorteringTidsintervallDato={action('button-click')}
          fomDato={verdier.fomDato}
          tomDato={verdier.tomDato}
        />
      )}
    />
  );
};

export const skalViseSorteringsvelgerNårKunTilbakekrevingErValgt = () => {
  const [verdier, leggTilVerdi] = useState({
    sortering: koSortering.BEHANDLINGSFRIST,
    fra: 2,
    til: 3,
    fomDato: undefined,
    tomDato: undefined,
    erDynamiskPeriode: true,
  });
  const lagre = useCallback((_oppgavekoId, sorteringType) => {
    leggTilVerdi(oldState => ({
      ...oldState,
      sortering: sorteringType,
    }));
  }, []);
  const lagreDynamiskPeriode = useCallback(() => {
    leggTilVerdi(oldState => ({
      ...oldState,
      erDynamiskPeriode: !oldState.erDynamiskPeriode,
    }));
  }, []);

  return (
    <Form
      onSubmit={() => undefined}
      initialValues={verdier}
      render={() => (
        <SorteringVelger
          alleKodeverk={sorteringsTyper}
          valgtOppgavekoId={1}
          valgteBehandlingtyper={[
            {
              kode: behandlingType.TILBAKEBETALING,
              navn: 'Tilbakekreving',
            },
          ]}
          lagreOppgavekoSortering={lagre}
          lagreOppgavekoSorteringTidsintervallDato={action('button-click')}
          fomDato={verdier.fomDato}
          tomDato={verdier.tomDato}
        />
      )}
    />
  );
};

import React, { FunctionComponent, useMemo, useState } from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Undertittel, Element } from 'nav-frontend-typografi';

import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { ISO_DATE_FORMAT } from 'utils/formats';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import {
  slaSammenLikeFagsakstyperOgDatoer,
} from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import { Select } from 'nav-frontend-skjema';
import styles from './nyeOgFerdigstilteOppgaverForIdagGraf.less';
import NyeOgFerdigstilteOppgaverForIdagGraf from './NyeOgFerdigstilteOppgaverForIdagGraf';
import NyeOgFerdigstilteOppgaver, { fagytelsetyperForOppgaveFiltrering } from '../nyeOgFerdigstilteOppgaverTsType';
import punsjBehandlingstyper from '../../../../../types/PunsjBehandlingstyper';

export const getNyeOgFerdigstilteForIDag = (nyeOgFerdigstilte: NyeOgFerdigstilteOppgaver[] = []) => {
  const iDag = moment();
  return nyeOgFerdigstilte.filter((oppgave) => iDag.isSame(moment(oppgave.dato, ISO_DATE_FORMAT), 'day'));
};

interface OwnProps {
    width: number;
    height: number;
    nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[];
}

/**
 * NyeOgFerdigstilteOppgaverForIdagPanel.
 */
export const NyeOgFerdigstilteOppgaverForIdagPanel: FunctionComponent<OwnProps> = ({
  width,
  height,
  nyeOgFerdigstilteOppgaver,
}) => {
  const behandlingTyper = useKodeverk(kodeverkTyper.BEHANDLING_TYPE);
  let skalPunsjVises = false;
  const [selectValue, setSelectValue] = useState<string>('');
  const nyeOgFerdigstilteOppgaverForIdag = useMemo(() => getNyeOgFerdigstilteForIDag(nyeOgFerdigstilteOppgaver), [nyeOgFerdigstilteOppgaver]);
  const omsorgspengerFerdigstilteOppgaver = slaSammenLikeFagsakstyperOgDatoer(nyeOgFerdigstilteOppgaverForIdag.filter(
    (oppgave) => oppgave.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSPENGER && !punsjBehandlingstyper.includes(oppgave.behandlingType.kode),
  ));

  const pleiepengerFerdigstilteOppgaver = slaSammenLikeFagsakstyperOgDatoer(nyeOgFerdigstilteOppgaverForIdag.filter(
    (oppgave) => oppgave.fagsakYtelseType.kode === fagsakYtelseType.PLEIEPENGER_SYKT_BARN && !punsjBehandlingstyper.includes(oppgave.behandlingType.kode),
  ));

  const punsjFerdigstilteOppgaver = slaSammenLikeFagsakstyperOgDatoer(nyeOgFerdigstilteOppgaverForIdag.filter(
    (oppgave) => punsjBehandlingstyper.includes(oppgave.behandlingType.kode),
  ));

  const samlet = slaSammenLikeFagsakstyperOgDatoer(nyeOgFerdigstilteOppgaverForIdag.filter(
    (oppgave) => !punsjBehandlingstyper.includes(oppgave.behandlingType.kode),
  ));

  const hentOppgave = () => {
    skalPunsjVises = false;
    switch (selectValue) {
      case fagytelsetyperForOppgaveFiltrering.OMSORGSPENGER: return omsorgspengerFerdigstilteOppgaver;
      case fagytelsetyperForOppgaveFiltrering.PLEIEPENGER_SYKT_BARN: return pleiepengerFerdigstilteOppgaver;
      case fagytelsetyperForOppgaveFiltrering.PUNSJ: { skalPunsjVises = true; return punsjFerdigstilteOppgaver; }
      default: return samlet;
    }
  };

  return (
    <>
      <Undertittel>
        <FormattedMessage id="NyeOgFerdigstilteOppgaverForIdagPanel.NyeOgFerdigstilte" />
      </Undertittel>
      <VerticalSpacer eightPx />
      <div className={styles.nyeOgFerdigstilteOppgaverForIdagPanel_Subtitel}>
        <Element>
          <FormattedMessage id="NyeOgFerdigstilteOppgaverForIdagPanel.IDag" />
        </Element>

        <Select
          value={selectValue}
          aria-label="Velg ytelse"
          onChange={(e) => setSelectValue(e.target.value)}
        >
          <option value="" disabled selected>Velg ytelse</option>
          {Object.values(fagytelsetyperForOppgaveFiltrering).map((rel) => <option key={rel} value={rel}>{rel}</option>)}
        </Select>
      </div>

      <NyeOgFerdigstilteOppgaverForIdagGraf
        width={width}
        height={height}
        nyeOgFerdigstilteOppgaver={hentOppgave()}
        behandlingTyper={behandlingTyper}
        skalPunsjbehandlingerVises={skalPunsjVises}
      />

    </>
  );
};

export default NyeOgFerdigstilteOppgaverForIdagPanel;

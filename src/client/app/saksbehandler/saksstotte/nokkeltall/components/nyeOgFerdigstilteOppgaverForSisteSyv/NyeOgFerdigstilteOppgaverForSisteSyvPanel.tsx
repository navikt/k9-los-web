import React, { FunctionComponent, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';

import { ISO_DATE_FORMAT } from 'utils/formats';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import {
  ALLE_YTELSETYPER_VALGT,
  sjekkOmOppgaveSkalLeggesTil, slaSammenAllePunsjBehandlingstyperForNyeOgFerdigstilleOppgaver,
  slaSammenLikeBehandlingstyperForNyeOgFerdigstilleOppgaver,
} from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import { Select } from 'nav-frontend-skjema';
import NyeOgFerdigstilteOppgaverForSisteSyvGraf
  from 'saksbehandler/saksstotte/nokkeltall/components/nyeOgFerdigstilteOppgaverForSisteSyv/NyeOgFerdigstilteOppgaverForSisteSyvGraf';
import dayjs from 'dayjs';
import AlleKodeverk from "kodeverk/alleKodeverkTsType";
import { useGlobalStateRestApiData } from "api/rest-api-hooks";
import { RestApiGlobalStatePathsKeys } from "api/k9LosApi";
import NyeOgFerdigstilteOppgaver, { fagytelsetyperForOppgaveFiltrering } from '../nyeOgFerdigstilteOppgaverTsType';
import styles
  from '../nyeOgFerdigstilteOppgaverFelles.less';

export const getNyeOgFerdigstilteForSisteSyvDager = (nyeOgFerdigstilte: NyeOgFerdigstilteOppgaver[] = []) => {
  const iDag = dayjs().startOf('day');
  return nyeOgFerdigstilte.filter((oppgave) => iDag.isAfter(dayjs(oppgave.dato, ISO_DATE_FORMAT)));
};

interface OwnProps {
  height: number;
  nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[];
}

/**
 * NyeOgFerdigstilteOppgaverForSisteSyvPanel.
 */
export const NyeOgFerdigstilteOppgaverForSisteSyvPanel: FunctionComponent<OwnProps> = ({
  height,
  nyeOgFerdigstilteOppgaver,
}) => {
  const [selectValue, setSelectValue] = useState<string>('');
  const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

  const filtrertenyeOgFerdigstilteOppgaverSisteSyv = useMemo(
    () => getNyeOgFerdigstilteForSisteSyvDager(nyeOgFerdigstilteOppgaver), [nyeOgFerdigstilteOppgaver],
  );

  const omsorgspengerFerdigstilteOppgaver = slaSammenLikeBehandlingstyperForNyeOgFerdigstilleOppgaver(filtrertenyeOgFerdigstilteOppgaverSisteSyv.filter(
    (oppgave) => sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSPENGER, oppgave),
  ));

  const omsorgsdagerFerdigstilteOppgaver = slaSammenLikeBehandlingstyperForNyeOgFerdigstilleOppgaver(filtrertenyeOgFerdigstilteOppgaverSisteSyv.filter(
    (oppgave) => sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSDAGER, oppgave),
  ));

  const pleiepengerFerdigstilteOppgaver = slaSammenLikeBehandlingstyperForNyeOgFerdigstilleOppgaver(filtrertenyeOgFerdigstilteOppgaverSisteSyv.filter(
    (oppgave) => sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PLEIEPENGER_SYKT_BARN, oppgave),
  ));

  const punsjFerdigstilteOppgaver = slaSammenAllePunsjBehandlingstyperForNyeOgFerdigstilleOppgaver(filtrertenyeOgFerdigstilteOppgaverSisteSyv.filter(
    (oppgave) => sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PUNSJ, oppgave)),
    alleKodeverk);

  const samlet = slaSammenLikeBehandlingstyperForNyeOgFerdigstilleOppgaver(filtrertenyeOgFerdigstilteOppgaverSisteSyv.filter(
    (oppgave) => sjekkOmOppgaveSkalLeggesTil(ALLE_YTELSETYPER_VALGT, oppgave),
  ));

  const hentOppgaver = () => {
    switch (selectValue) {
      case fagytelsetyperForOppgaveFiltrering.OMSORGSPENGER: return omsorgspengerFerdigstilteOppgaver;
      case fagytelsetyperForOppgaveFiltrering.PLEIEPENGER_SYKT_BARN: return pleiepengerFerdigstilteOppgaver;
      case fagytelsetyperForOppgaveFiltrering.OMSORGSDAGER: return omsorgsdagerFerdigstilteOppgaver;
      case fagytelsetyperForOppgaveFiltrering.PUNSJ: return punsjFerdigstilteOppgaver;
      default: return samlet;
    }
  };

  return (
    <>
      <VerticalSpacer eightPx />
      <div className={styles.nyeOgFerdigstilteOppgaverForIdagPanel_Subtitel}>
        <Element>
          <FormattedMessage id="NyeOgFerdigstilteOppgaverForSisteSyvPanel.SisteSyv" />
        </Element>

        <Select
          value={selectValue}
          aria-label="Velg ytelse"
          onChange={(e) => setSelectValue(e.target.value)}
        >
          <option value="" disabled defaultValue={ALLE_YTELSETYPER_VALGT}>Velg ytelse</option>
          {Object.values(fagytelsetyperForOppgaveFiltrering).map((rel) => <option key={rel} value={rel}>{rel}</option>)}
        </Select>
      </div>
      <NyeOgFerdigstilteOppgaverForSisteSyvGraf
        height={height}
        nyeOgFerdigstilteOppgaver={hentOppgaver()}
      />
    </>
  );
};

export default NyeOgFerdigstilteOppgaverForSisteSyvPanel;

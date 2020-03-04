
import { Dispatch } from 'redux';

import k9LosApi from 'api/k9LosApi';

/* Action types */
const actionType = name => `saksliste/${name}`;
const SET_VALGT_SAKSLISTE_ID = actionType('SET_VALGT_SAKSLISTE_ID');
const RESET_VALGT_SAKSLISTE_ID = actionType('RESET_VALGT_SAKSLISTE_ID');

/* Action creators */
export const setValgtSakslisteId = (valgtSakslisteId: number) => ({
  type: SET_VALGT_SAKSLISTE_ID,
  payload: valgtSakslisteId,
});


export const resetValgtSakslisteId = () => ({
  type: RESET_VALGT_SAKSLISTE_ID,
});

export const fetchAvdelingensSakslister = (avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.SAKSLISTER_FOR_AVDELING.makeRestApiRequest()(
    { avdelingEnhet }, { keepData: true },
  ),
);

export const getAvdelingensSakslister = k9LosApi.SAKSLISTER_FOR_AVDELING.getRestApiData();

export const fetchAntallOppgaverForAvdeling = (avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
    k9LosApi.OPPGAVE_AVDELING_ANTALL.makeRestApiRequest()({ avdelingEnhet }),
);

export const fetchAntallOppgaverForSaksliste = (sakslisteId: number, avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
    k9LosApi.OPPGAVE_ANTALL.makeRestApiRequest()({ sakslisteId, avdelingEnhet }),
).then(() => dispatch(fetchAntallOppgaverForAvdeling(avdelingEnhet)));


export const getAntallOppgaverForAvdelingResultat = k9LosApi.OPPGAVE_AVDELING_ANTALL.getRestApiData();

export const getAntallOppgaverForSakslisteResultat = k9LosApi.OPPGAVE_ANTALL.getRestApiData();

// k9LosApi.OPPGAVE_ANTALL.getRestApiData();

export const lagNySaksliste = (avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(k9LosApi
  .OPPRETT_NY_SAKSLISTE.makeRestApiRequest()({ avdelingEnhet }))
  .then(() => dispatch(resetValgtSakslisteId()))
  .then(() => dispatch(fetchAvdelingensSakslister(avdelingEnhet)));
export const getNySakslisteId = k9LosApi.OPPRETT_NY_SAKSLISTE.getRestApiData();

export const fjernSaksliste = (sakslisteId: number, avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.SLETT_SAKSLISTE.makeRestApiRequest()({ sakslisteId, avdelingEnhet }),
)
  .then(() => dispatch(resetValgtSakslisteId()))
  .then(() => dispatch(fetchAvdelingensSakslister(avdelingEnhet)));

export const lagreSakslisteNavn = (saksliste: {sakslisteId: number; navn: number}, avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.LAGRE_SAKSLISTE_NAVN.makeRestApiRequest()({ sakslisteId: saksliste.sakslisteId, navn: saksliste.navn, avdelingEnhet }),
).then(() => dispatch(fetchAvdelingensSakslister(avdelingEnhet)));

export const lagreSakslisteBehandlingstype = (sakslisteId: number, behandlingType: {}, isChecked: boolean,
  avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.LAGRE_SAKSLISTE_BEHANDLINGSTYPE.makeRestApiRequest()({
    sakslisteId,
    avdelingEnhet,
    behandlingType,
    checked: isChecked,
  }),
).then(() => dispatch(fetchAntallOppgaverForSaksliste(sakslisteId, avdelingEnhet)))
    .then(() => dispatch(fetchAvdelingensSakslister(avdelingEnhet)));

export const lagreSakslisteFagsakYtelseType = (sakslisteId: number, fagsakYtelseType: string, avdelingEnhet: string) => (dispatch: Dispatch) => {
  const data = fagsakYtelseType !== '' ? { sakslisteId, avdelingEnhet, fagsakYtelseType } : { sakslisteId, avdelingEnhet };
  return dispatch(k9LosApi.LAGRE_SAKSLISTE_FAGSAK_YTELSE_TYPE.makeRestApiRequest()(data))
    .then(() => dispatch(fetchAntallOppgaverForSaksliste(sakslisteId, avdelingEnhet)))
    .then(() => dispatch(fetchAvdelingensSakslister(avdelingEnhet)));
};

export const lagreSakslisteSortering = (sakslisteId: number, sakslisteSorteringValg: string, avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.LAGRE_SAKSLISTE_SORTERING.makeRestApiRequest()({ sakslisteId, sakslisteSorteringValg, avdelingEnhet }),
).then(() => dispatch(fetchAntallOppgaverForSaksliste(sakslisteId, avdelingEnhet)))
    .then(() => dispatch(fetchAvdelingensSakslister(avdelingEnhet)));

export const lagreSakslisteSorteringErDynamiskPeriode = (sakslisteId: number, avdelingEnhet: string) => (dispatch: Dispatch<any>) => dispatch(
  k9LosApi.LAGRE_SAKSLISTE_SORTERING_DYNAMISK_PERIDE.makeRestApiRequest()({ sakslisteId, avdelingEnhet }),
).then(() => dispatch(fetchAntallOppgaverForSaksliste(sakslisteId, avdelingEnhet)))
    .then(() => dispatch(fetchAvdelingensSakslister(avdelingEnhet)));

export const lagreSakslisteSorteringTidsintervallDato = (sakslisteId: number, fomDato: string, tomDato: string,
  avdelingEnhet: string) => (dispatch: Dispatch<any>) => dispatch(
  k9LosApi.LAGRE_SAKSLISTE_SORTERING_TIDSINTERVALL_DATO.makeRestApiRequest()({
 sakslisteId, avdelingEnhet, fomDato, tomDato,
}),
).then(() => dispatch(fetchAntallOppgaverForSaksliste(sakslisteId, avdelingEnhet)))
    .then(() => dispatch(fetchAvdelingensSakslister(avdelingEnhet)));

export const lagreSakslisteSorteringNumeriskIntervall = (sakslisteId: number, fra: number, til: number,
  avdelingEnhet: string) => (dispatch: Dispatch<any>) => dispatch(
  k9LosApi.LAGRE_SAKSLISTE_SORTERING_TIDSINTERVALL_DAGER.makeRestApiRequest()({
    sakslisteId, fra, til, avdelingEnhet,
  }),
).then(() => dispatch(fetchAntallOppgaverForSaksliste(sakslisteId, avdelingEnhet)))
    .then(() => dispatch(fetchAvdelingensSakslister(avdelingEnhet)));

export const lagreSakslisteAndreKriterier = (sakslisteId: number, andreKriterierType: string, isChecked: boolean, skalInkludere: boolean,
  avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.LAGRE_SAKSLISTE_ANDRE_KRITERIER.makeRestApiRequest()({
    sakslisteId,
    avdelingEnhet,
    andreKriterierType,
    checked: isChecked,
    inkluder: skalInkludere,
  }),
).then(() => dispatch(fetchAntallOppgaverForSaksliste(sakslisteId, avdelingEnhet)))
    .then(() => dispatch(fetchAvdelingensSakslister(avdelingEnhet)));

export const knyttSaksbehandlerTilSaksliste = (sakslisteId: number, brukerIdent: string, isChecked: boolean,
  avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.LAGRE_SAKSLISTE_SAKSBEHANDLER.makeRestApiRequest()({
    sakslisteId,
    brukerIdent,
    checked: isChecked,
    avdelingEnhet,
  }),
).then(() => dispatch(fetchAvdelingensSakslister(avdelingEnhet)));

/* Reducer */
const initialState = {
  valgtSakslisteId: undefined,
};

interface StateTsProp {
  valgtSakslisteId?: number;
}

interface ActionTsProp {
  type: string;
  payload?: any;
}

export const organiseringAvSakslisterReducer = (state: StateTsProp = initialState, action: ActionTsProp = { type: '' }) => {
  switch (action.type) {
    case SET_VALGT_SAKSLISTE_ID:
      return {
        ...state,
        valgtSakslisteId: action.payload,
      };
    case RESET_VALGT_SAKSLISTE_ID:
      return initialState;
    default:
      return state;
  }
};

const getOrganiseringAvSakslisterContext = state => state.default.organiseringAvSakslisterContext;
export const getValgtSakslisteId = (state: any) => getOrganiseringAvSakslisterContext(state).valgtSakslisteId;

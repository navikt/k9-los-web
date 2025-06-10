import dayjs from 'dayjs';
import AlleOppgaver from 'avdelingsleder/nokkeltall/alleOppgaverTsType';
import HistoriskData from 'avdelingsleder/nokkeltall/historiskDataTsType';
import NyeOgFerdigstilteMedStonadstype from 'avdelingsleder/nokkeltall/nyeOgFerdigstilteMedStonadstypeTsType';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import behandlingType from 'kodeverk/behandlingType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import NyeOgFerdigstilteOppgaver from 'saksbehandler/saksstotte/nokkeltall/components/nyeOgFerdigstilteOppgaverTsType';
import { getKodeverkFraKode } from 'utils/kodeverkUtils';
import omsorgsdagerYtelsetyper from '../../types/OmsorgsdagerYtelsetyper';
import punsjBehandlingstyper from '../../types/PunsjBehandlingstyper';

export const ALLE_YTELSETYPER_VALGT = 'ALLE';
export const punsjKodeverkNavn = 'PUNSJ_INNSENDING_TYPE';
export const UKE_4 = '4';
export const UKE_2 = '2';

export const ytelseTyper = [
	{
		kode: fagsakYtelseType.OMSORGSPENGER,
		navn: 'Omsorgspenger',
	},
	{
		kode: fagsakYtelseType.OMSORGSDAGER,
		navn: 'Omsorgsdager',
	},
	{
		kode: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
		navn: 'Pleiepenger sykt barn',
	},
	{
		kode: fagsakYtelseType.PPN,
		navn: 'Livets sluttfase',
	},
	{
		kode: fagsakYtelseType.PUNSJ,
		navn: 'Punsj',
	},
	{
		kode: ALLE_YTELSETYPER_VALGT,
		navn: 'Alle ytelser',
	},
];

export const uker = [
	{
		kode: UKE_2,
		tekstKode: 'Historikk.ToSisteUker',
	},
	{
		kode: UKE_4,
		tekstKode: 'Historikk.FireSisteUker',
	},
];

export const fremtidigeUker = [
	{
		kode: UKE_2,
		tekstKode: 'BehandlingerGårAvVent.ToNesteUker',
	},
	{
		kode: UKE_4,
		tekstKode: 'BehandlingerGårAvVent.FireNesteUker',
	},
];

export const behandlingstypeOrder = [
	behandlingType.FORSTEGANGSSOKNAD,
	behandlingType.REVURDERING,
	// behandlingType.ANKE,
	behandlingType.INNSYN,
	// behandlingType.KLAGE,
	behandlingType.TILBAKEBETALING,
];

export const erDatoInnenforPeriode = (oppgaveForAvdeling, ukevalg) => {
	if (ukevalg === uker[1].kode) {
		return true;
	}
	const fireUkerSiden = dayjs().subtract(4, 'w');
	return dayjs(oppgaveForAvdeling.dato).isSameOrAfter(fireUkerSiden);
};

export const slaSammenLikeBehandlingstyperOgDatoer = (oppgaver: HistoriskData[], alleKodeverk: AlleKodeverk) => {
	const sammenslatte = [];

	oppgaver.forEach((o) => {
		if (getKodeverkFraKode(o.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) === punsjKodeverkNavn) {
			return;
		}
		const index = sammenslatte.findIndex((s) => s.behandlingType === o.behandlingType && s.dato === o.dato);
		if (index === -1) {
			sammenslatte.push({
				behandlingType: o.behandlingType,
				dato: o.dato,
				antall: o.antall,
			});
		} else {
			sammenslatte[index] = {
				behandlingType: sammenslatte[index].behandlingType,
				dato: sammenslatte[index].dato,
				antall: sammenslatte[index].antall + o.antall,
			};
		}
	});

	return sammenslatte;
};

export const slaSammenLikeBehandlingstyperForNyeOgFerdigstilleOppgaver = (oppgaver: NyeOgFerdigstilteOppgaver[]) => {
	const sammenslatte = [];

	oppgaver.forEach((o) => {
		const index = sammenslatte.findIndex((s) => s.behandlingType === o.behandlingType && s.dato === o.dato);
		if (index === -1) {
			sammenslatte.push(o);
		} else {
			sammenslatte[index] = {
				behandlingType: sammenslatte[index].behandlingType,
				dato: sammenslatte[index].dato,
				antallNye: sammenslatte[index].antallNye + o.antallNye,
				antallFerdigstilte: sammenslatte[index].antallFerdigstilte + o.antallFerdigstilte,
				antallFerdigstilteMine: sammenslatte[index].antallFerdigstilteMine + o.antallFerdigstilteMine,
			};
		}
	});

	return sammenslatte;
};

export const slaSammenAllePunsjBehandlingstyperForNyeOgFerdigstilleOppgaver = (
	oppgaver: NyeOgFerdigstilteOppgaver[],
	alleKodeverk: AlleKodeverk,
) => {
	const sammenslatte = [];

	oppgaver.forEach((o) => {
		if (getKodeverkFraKode(o.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) !== punsjKodeverkNavn) {
			return;
		}

		const index = sammenslatte.findIndex(
			(s) =>
				getKodeverkFraKode(s.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) &&
				s.fagsakYtelseType === o.fagsakYtelseType &&
				s.dato === o.dato,
		);
		if (index === -1) {
			sammenslatte.push(o);
		} else {
			sammenslatte[index] = {
				behandlingType: sammenslatte[index].behandlingType,
				fagsakYtelseType: sammenslatte[index].fagsakYtelseType,
				dato: sammenslatte[index].dato,
				antallNye: sammenslatte[index].antallNye + o.antallNye,
				antallFerdigstilte: sammenslatte[index].antallFerdigstilte + o.antallFerdigstilte,
				antallFerdigstilteMine: sammenslatte[index].antallFerdigstilteMine + o.antallFerdigstilteMine,
			};
		}
	});

	return sammenslatte;
};

export const slaSammenPunsjBehandlingstyperOgDatoer = (oppgaver: HistoriskData[], alleKodeverk: AlleKodeverk) => {
	const sammenslatte = [];

	oppgaver.forEach((o) => {
		if (getKodeverkFraKode(o.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) !== punsjKodeverkNavn) {
			return;
		}
		const index = sammenslatte.findIndex(
			(s) => s.behandlingType === 'PUNSJ' && s.dato === o.dato && s.fagsakYtelseType === o.fagsakYtelseType,
		);
		if (index === -1) {
			sammenslatte.push({
				fagsakYtelseType: o.fagsakYtelseType,
				behandlingType: 'PUNSJ',
				dato: o.dato,
				antall: o.antall,
			});
		} else {
			sammenslatte[index] = {
				fagsakYtelseType: o.fagsakYtelseType,
				behandlingType: 'PUNSJ',
				dato: sammenslatte[index].dato,
				antall: sammenslatte[index].antall + o.antall,
			};
		}
	});

	return sammenslatte;
};

export const sjekkOmOppgaveSkalLeggesTil = (
	ytelse: string,
	oppgave: NyeOgFerdigstilteMedStonadstype | HistoriskData | AlleOppgaver | NyeOgFerdigstilteOppgaver,
): boolean => {
	// Skal ikke ta med klage og anke sedan det ikke er en del av LOS ännu.
	if (oppgave.behandlingType === behandlingType.KLAGE || oppgave.behandlingType === behandlingType.ANKE) {
		return false;
	}
	switch (ytelse) {
		case fagsakYtelseType.PUNSJ:
			return punsjBehandlingstyper.includes(oppgave.behandlingType);
		case fagsakYtelseType.OMSORGSDAGER:
			return (
				!punsjBehandlingstyper.includes(oppgave.behandlingType) &&
				omsorgsdagerYtelsetyper.includes(oppgave.fagsakYtelseType)
			);
		case ALLE_YTELSETYPER_VALGT: {
			return (
				(!punsjBehandlingstyper.includes(oppgave.behandlingType) &&
					(omsorgsdagerYtelsetyper.includes(oppgave.fagsakYtelseType) ||
						oppgave.fagsakYtelseType === fagsakYtelseType.OMSORGSPENGER ||
						oppgave.fagsakYtelseType === fagsakYtelseType.PLEIEPENGER_SYKT_BARN)) ||
				oppgave.fagsakYtelseType === fagsakYtelseType.PPN
			);
		}
		default:
			return ytelse === oppgave.fagsakYtelseType && !punsjBehandlingstyper.includes(oppgave.behandlingType);
	}
};

export const filtrereNyePerDato = (
	ytelseType: string,
	ukevalg: string,
	nyePerDato: HistoriskData[],
	alleKodeverk: AlleKodeverk,
): HistoriskData[] => {
	if (nyePerDato) {
		if (ytelseType === 'PUNSJ') {
			return slaSammenPunsjBehandlingstyperOgDatoer(
				nyePerDato
					.filter((ofa) => sjekkOmOppgaveSkalLeggesTil(ytelseType, ofa))
					.filter((ofa) => erDatoInnenforPeriode(ofa, ukevalg)),
				alleKodeverk,
			);
		}
		return slaSammenLikeBehandlingstyperOgDatoer(
			nyePerDato
				.filter((ofa) => sjekkOmOppgaveSkalLeggesTil(ytelseType, ofa))
				.filter((ofa) => erDatoInnenforPeriode(ofa, ukevalg)),
			alleKodeverk,
		);
	}
	return [];
};

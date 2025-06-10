import {
	filtrereNyePerDato,
	sjekkOmOppgaveSkalLeggesTil,
	slaSammenAllePunsjBehandlingstyperForNyeOgFerdigstilleOppgaver,
	slaSammenLikeBehandlingstyperForNyeOgFerdigstilleOppgaver,
	slaSammenLikeBehandlingstyperOgDatoer,
	slaSammenPunsjBehandlingstyperOgDatoer,
} from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import behandlingType from 'kodeverk/behandlingType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import ferdigstilteHistorikk from '../../../mocks/ferdigstilteHistorikk';
import kodeverk from '../../../mocks/kodeverk';
import nyeOgFerdigstilteOppgaver from '../../../mocks/nyeOgFerdigstilteOppgaver';

describe('<NokkeltallUtils>', () => {
	it('skal slå sammen like behandlingstyper og datoer for historikk data', () => {
		const sammenslåttHistorikkOppgaver = slaSammenLikeBehandlingstyperOgDatoer(ferdigstilteHistorikk, kodeverk);

		const sammenslåttHistorikkOppgaverForstegangsbehandling = sammenslåttHistorikkOppgaver.find(
			(oppgave) =>
				oppgave.behandlingType === behandlingType.FORSTEGANGSSOKNAD &&
				oppgave.dato === '2021-08-29' &&
				oppgave.antall === 4,
		);

		const sammenslåttHistorikkOppgaverRevurdering = sammenslåttHistorikkOppgaver.find(
			(oppgave) =>
				oppgave.behandlingType === behandlingType.REVURDERING && oppgave.dato === '2021-08-29' && oppgave.antall === 4,
		);

		const sammenslåttHistorikkOppgaverTilbakekreving29August = sammenslåttHistorikkOppgaver.find(
			(oppgave) =>
				oppgave.behandlingType === behandlingType.TILBAKEBETALING &&
				oppgave.dato === '2021-08-29' &&
				oppgave.antall === 1,
		);

		const sammenslåttHistorikkOppgaverTilbakekreving30August = sammenslåttHistorikkOppgaver.find(
			(oppgave) =>
				oppgave.behandlingType === behandlingType.TILBAKEBETALING &&
				oppgave.dato === '2021-08-30' &&
				oppgave.antall === 1,
		);

		expect(sammenslåttHistorikkOppgaverRevurdering).toBeTruthy();
		expect(sammenslåttHistorikkOppgaverForstegangsbehandling).toBeTruthy();
		expect(sammenslåttHistorikkOppgaverTilbakekreving29August).toBeTruthy();
		expect(sammenslåttHistorikkOppgaverTilbakekreving30August).toBeTruthy();
	});

	it('skal slå sammen alle punsj behandlingstyper for historikk data', () => {
		const sammenslåttHistorikkOppgaverForPunsj = slaSammenPunsjBehandlingstyperOgDatoer(
			ferdigstilteHistorikk,
			kodeverk,
		);

		const sammenslåttHistorikkOppgaverPunsj29August = sammenslåttHistorikkOppgaverForPunsj.find(
			(oppgave) => oppgave.behandlingType === 'PUNSJ' && oppgave.dato === '2021-08-29' && oppgave.antall === 10,
		);

		const sammenslåttHistorikkOppgaverPunsj30August = sammenslåttHistorikkOppgaverForPunsj.find(
			(oppgave) => oppgave.behandlingType === 'PUNSJ' && oppgave.dato === '2021-08-30' && oppgave.antall === 1,
		);

		expect(sammenslåttHistorikkOppgaverPunsj29August).toBeTruthy();
		expect(sammenslåttHistorikkOppgaverPunsj30August).toBeTruthy();
	});

	it('skal slå sammen like behandlingstyper og datoer for nye og ferdigstilte oppgaver', () => {
		const sammenslåttNyeOgFerdigstilleOppgaver =
			slaSammenLikeBehandlingstyperForNyeOgFerdigstilleOppgaver(nyeOgFerdigstilteOppgaver);

		const sammenslåttNyeOgFerdigstilleOppgaverHistorikkOppgaverForstegangsbehandling =
			sammenslåttNyeOgFerdigstilleOppgaver.find(
				(oppgave) =>
					oppgave.behandlingType === behandlingType.FORSTEGANGSSOKNAD &&
					oppgave.dato === '2021-08-29' &&
					oppgave.antallNye === 3 &&
					oppgave.antallFerdigstilte === 3 &&
					oppgave.antallFerdigstilteMine === 3,
			);

		const sammenslåttNyeOgFerdigstilleOppgaverHistorikkOppgaverTilbakekreving =
			sammenslåttNyeOgFerdigstilleOppgaver.find(
				(oppgave) =>
					oppgave.behandlingType === behandlingType.TILBAKEBETALING &&
					oppgave.dato === '2021-08-29' &&
					oppgave.antallNye === 2 &&
					oppgave.antallFerdigstilte === 2 &&
					oppgave.antallFerdigstilteMine === 3,
			);

		const sammenslåttNyeOgFerdigstilleOppgaverHistorikkOppgaverRevurdering = sammenslåttNyeOgFerdigstilleOppgaver.find(
			(oppgave) =>
				oppgave.behandlingType === behandlingType.REVURDERING &&
				oppgave.dato === '2021-08-29' &&
				oppgave.antallNye === 4 &&
				oppgave.antallFerdigstilte === 4 &&
				oppgave.antallFerdigstilteMine === 4,
		);

		const sammenslåttNyeOgFerdigstilleOppgaverHistorikkOppgaverPapirettersendelse =
			sammenslåttNyeOgFerdigstilleOppgaver.find(
				(oppgave) =>
					oppgave.behandlingType === behandlingType.PAPIRETTERSENDELSE &&
					oppgave.dato === '2021-08-29' &&
					oppgave.antallNye === 1 &&
					oppgave.antallFerdigstilte === 1 &&
					oppgave.antallFerdigstilteMine === 1,
			);

		expect(sammenslåttNyeOgFerdigstilleOppgaverHistorikkOppgaverForstegangsbehandling).toBeTruthy();
		expect(sammenslåttNyeOgFerdigstilleOppgaverHistorikkOppgaverTilbakekreving).toBeTruthy();
		expect(sammenslåttNyeOgFerdigstilleOppgaverHistorikkOppgaverRevurdering).toBeTruthy();
		expect(sammenslåttNyeOgFerdigstilleOppgaverHistorikkOppgaverPapirettersendelse).toBeTruthy();
	});

	it('skal slå sammen alle punsj behandlingstyper for nye og ferdigstilte oppgaver', () => {
		const sammenslåttNyeOgFerdigstilleOppgaverForPunsj = slaSammenAllePunsjBehandlingstyperForNyeOgFerdigstilleOppgaver(
			nyeOgFerdigstilteOppgaver.filter((oppgave) => sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PUNSJ, oppgave)),
			kodeverk,
		);

		const sammenslåttePunsjBehandlingstyper29Aug = sammenslåttNyeOgFerdigstilleOppgaverForPunsj.find(
			(oppgave) =>
				oppgave.dato === '2021-08-29' &&
				oppgave.antallNye === 10 &&
				oppgave.antallFerdigstilte === 10 &&
				oppgave.antallFerdigstilteMine === 10,
		);

		const sammenslåttePunsjBehandlingstyper20Aug = sammenslåttNyeOgFerdigstilleOppgaverForPunsj.find(
			(oppgave) =>
				oppgave.dato === '2021-08-20' &&
				oppgave.antallNye === 1 &&
				oppgave.antallFerdigstilte === 1 &&
				oppgave.antallFerdigstilteMine === 1,
		);

		expect(sammenslåttePunsjBehandlingstyper29Aug).toBeTruthy();
		expect(sammenslåttePunsjBehandlingstyper20Aug).toBeTruthy();
	});

	it('sjekk om oppgave skal legges til basert på ytelse valgt', () => {
		const punsjOppgave = {
			fagsakYtelseType: 'PSB',
			behandlingType: 'INNLOGGET_CHAT',
			dato: '2021-08-20',
			antallNye: 1,
			antallFerdigstilte: 1,
			antallFerdigstilteMine: 1,
		};
		const OMPOppgave = {
			fagsakYtelseType: 'OMP',
			behandlingType: 'BT-007',
			dato: '2021-08-12',
			antallNye: 1,
			antallFerdigstilte: 1,
			antallFerdigstilteMine: 1,
		};
		const OMDOppgave = {
			fagsakYtelseType: 'OMP_MA',
			behandlingType: 'BT-004',
			dato: '2021-08-12',
			antallNye: 1,
			antallFerdigstilte: 1,
			antallFerdigstilteMine: 1,
		};
		const PSBOppgave = {
			fagsakYtelseType: 'PSB',
			behandlingType: 'BT-007',
			dato: '2021-08-12',
			antallNye: 1,
			antallFerdigstilte: 1,
			antallFerdigstilteMine: 2,
		};

		expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PUNSJ, punsjOppgave)).toBe(true);
		expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSDAGER, punsjOppgave)).toBe(false);
		expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSPENGER, punsjOppgave)).toBe(false);
		expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PLEIEPENGER_SYKT_BARN, punsjOppgave)).toBe(false);

		expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PUNSJ, OMPOppgave)).toBe(false);
		expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSDAGER, OMPOppgave)).toBe(false);
		expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSPENGER, OMPOppgave)).toBe(true);
		expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PLEIEPENGER_SYKT_BARN, OMPOppgave)).toBe(false);

		expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PUNSJ, OMDOppgave)).toBe(false);
		expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSDAGER, OMDOppgave)).toBe(true);
		expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSPENGER, OMDOppgave)).toBe(false);
		expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PLEIEPENGER_SYKT_BARN, OMDOppgave)).toBe(false);

		expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PUNSJ, PSBOppgave)).toBe(false);
		expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSDAGER, PSBOppgave)).toBe(false);
		expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.OMSORGSPENGER, PSBOppgave)).toBe(false);
		expect(sjekkOmOppgaveSkalLeggesTil(fagsakYtelseType.PLEIEPENGER_SYKT_BARN, PSBOppgave)).toBe(true);
	});

	it('sjekk om oppgave filtreras basert på om punsj er valgt eller ikke', () => {
		const gårdagensDato = new Date();
		gårdagensDato.setDate(gårdagensDato.getDate() - 3);
		const dato = gårdagensDato.toISOString().substring(0, 10);

		const nyePerDato = [
			{
				fagsakYtelseType: 'OMP',
				behandlingType: 'BT-002',
				dato,
				antall: 1,
			},
			{
				fagsakYtelseType: 'PSB',
				behandlingType: 'BT-007',
				dato,
				antall: 1,
			},
			{
				fagsakYtelseType: 'OMP',
				behandlingType: 'BT-004',
				dato,
				antall: 2,
			},
			{
				fagsakYtelseType: 'OMP_MA',
				behandlingType: 'BT-004',
				dato,
				antall: 2,
			},
			{
				fagsakYtelseType: 'OMP_KS',
				behandlingType: 'BT-004',
				dato,
				antall: 2,
			},
			{
				fagsakYtelseType: 'OMP_AO',
				behandlingType: 'BT-004',
				dato,
				antall: 2,
			},
			{
				fagsakYtelseType: 'PSB',
				behandlingType: 'SAMTALEREFERAT',
				dato,
				antall: 1,
			},
		];

		const filtrerteIkkePunsjOppgaverYtelsetypeOMPValgt = filtrereNyePerDato(
			fagsakYtelseType.OMSORGSPENGER,
			'4',
			nyePerDato,
			kodeverk,
		);
		const filtrerteIkkePunsjOppgaverYtelsetypeOMPMAValgt = filtrereNyePerDato(
			fagsakYtelseType.OMSORGSDAGER_MIDLERTIDIGALENE,
			'4',
			nyePerDato,
			kodeverk,
		);
		const filtrerteIkkePunsjOppgaverYtelsetypeOMPKSValgt = filtrereNyePerDato(
			fagsakYtelseType.OMSORGSDAGER_KRONISKSYK,
			'4',
			nyePerDato,
			kodeverk,
		);
		const filtrerteIkkePunsjOppgaverYtelsetypeOMPAOValgt = filtrereNyePerDato(
			fagsakYtelseType.OMSORGSDAGER_ALENEOMOMSORGEN,
			'4',
			nyePerDato,
			kodeverk,
		);
		const filtrerteIkkePunsjOppgaverYtelsetypePSBValgt = filtrereNyePerDato(
			fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
			'4',
			nyePerDato,
			kodeverk,
		);
		const filtrertePunsjOppgaver = filtrereNyePerDato(fagsakYtelseType.PUNSJ, '4', nyePerDato, kodeverk);

		expect(filtrerteIkkePunsjOppgaverYtelsetypeOMPValgt).toHaveLength(2);
		expect(filtrerteIkkePunsjOppgaverYtelsetypePSBValgt).toHaveLength(1);
		expect(filtrerteIkkePunsjOppgaverYtelsetypeOMPMAValgt).toHaveLength(1);
		expect(filtrerteIkkePunsjOppgaverYtelsetypeOMPKSValgt).toHaveLength(1);
		expect(filtrerteIkkePunsjOppgaverYtelsetypeOMPAOValgt).toHaveLength(1);
		expect(filtrertePunsjOppgaver).toHaveLength(1);
	});
});

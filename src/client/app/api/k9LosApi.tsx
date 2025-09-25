import { RestApiConfigBuilder, createRequestApi } from './rest-api';

export enum RestApiGlobalStatePathsKeys {
	KODEVERK = 'KODEVERK',
	NAV_ANSATT = 'NAV_ANSATT',
	K9SAK_URL = 'K9SAK_URL',
	PUNSJ_URL = 'PUNSJ_URL',
}

export enum K9LosApiKeys {
	KODEVERK = 'KODEVERK',
	NAV_ANSATT = 'NAV_ANSATT',
	PUNSJ_URL = 'PUNSJ_URL',
	SEARCH_FAGSAK = 'SEARCH_FAGSAK',
	BEHANDLEDE_OPPGAVER = 'BEHANDLEDE_OPPGAVER',
	K9SAK_URL = 'K9SAK_URL',
	K9TILBAKE_URL = 'K9TILBAKE_URL',
	FEATURE_TOGGLES = 'FEATURE_TOGGLES',
	OPPGAVEKO = 'OPPGAVEKO',
	HENT_OPPGAVEKO = 'HENT_OPPGAVEKO',
	RESERVER_OPPGAVE = 'RESERVER_OPPGAVE',
	ENDRE_OPPGAVERESERVASJON = 'ENDRE_OPPGAVERESERVASJON',
	HENT_RESERVASJONSSTATUS = 'HENT_RESERVASJONSSTATUS',
	OPPGAVER_TIL_BEHANDLING = 'OPPGAVER_TIL_BEHANDLING',
	RESERVERTE_OPPGAVER = 'RESERVERTE_OPPGAVER',
	OPPHEV_OPPGAVERESERVASJON = 'OPPHEV_OPPGAVERESERVASJON',
	FORLENG_OPPGAVERESERVASJON = 'FORLENG_OPPGAVERESERVASJON',
	OPPGAVEKOER = 'OPPGAVEKOER',
	OPPRETT_NY_OPPGAVEKO = 'OPPRETT_NY_OPPGAVEKO',
	SLETT_OPPGAVEKO = 'SLETT_OPPGAVEKO',
	LAGRE_OPPGAVEKO_NAVN = 'LAGRE_OPPGAVEKO_NAVN',
	LAGRE_OPPGAVEKO_BEHANDLINGSTYPE = 'LAGRE_OPPGAVEKO_BEHANDLINGSTYPE',
	LAGRE_OPPGAVEKO_FAGSAK_YTELSE_TYPE = 'LAGRE_OPPGAVEKO_FAGSAK_YTELSE_TYPE',
	LAGRE_OPPGAVEKO_ANDRE_KRITERIER = 'LAGRE_OPPGAVEKO_ANDRE_KRITERIER',
	LAGRE_OPPGAVEKO_SORTERING = 'LAGRE_OPPGAVEKO_SORTERING',
	LAGRE_OPPGAVEKO_KRITERIER = 'LAGRE_OPPGAVEKO_KRITERIER',
	LAGRE_OPPGAVEKO_SKJERMET = 'LAGRE_OPPGAVEKO_SKJERMET',
	LAGRE_OPPGAVEKO_SORTERING_DYNAMISK_PERIDE = 'LAGRE_OPPGAVEKO_SORTERING_DYNAMISK_PERIDE',
	LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DAGER = 'LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DAGER',
	LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DATO = 'LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DATO',
	SAKSBEHANDLER_SOK = 'SAKSBEHANDLER_SOK',
	SAKSBEHANDLERE = 'SAKSBEHANDLERE',
	DRIFTSMELDINGER = 'DRIFTSMELDINGER',
	LAGRE_DRIFTSMELDING = 'LAGRE_DRIFTSMELDING',
	SLETT_DRIFTSMELDING = 'SLETT_DRIFTSMELDING',
	TOGGLE_DRIFTSMELDING = 'TOGGLE_DRIFTSMELDING',
	OPPRETT_NY_SAKSBEHANDLER = 'OPPRETT_NY_SAKSBEHANDLER',
	SLETT_SAKSBEHANDLER = 'SLETT_SAKSBEHANDLER',
	LAGRE_OPPGAVEKO_SAKSBEHANDLER = 'LAGRE_OPPGAVEKO_SAKSBEHANDLER',
	HENT_OPPGAVER = 'HENT_OPPGAVER',
	HENT_OPPGAVER_PER_DATO = 'HENT_OPPGAVER_PER_DATO',
	HENT_OPPSUMMERING = 'HENT_OPPSUMMERING',
	HENT_FERDIGSTILTE_HISTORIKK = 'HENT_FERDIGSTILTE_HISTORIKK',
	HENT_NYE_HISTORIKK = 'HENT_NYE_HISTORIKK',
	HENT_OPPGAVER_PER_FORSTE_STONADSDAG = 'HENT_OPPGAVER_PER_FORSTE_STONADSDAG',
	HENT_DAGENS_TALL = 'HENT_DAGENS_TALL',
	HENT_OPPGAVER_MANUELT_PA_VENT = 'HENT_OPPGAVER_MANUELT_PA_VENT',
	OPPGAVE_ANTALL = 'OPPGAVE_ANTALL',
	OPPGAVE_ANTALL_TOTALT = 'OPPGAVE_ANTALL_TOTALT',
	FLYTT_RESERVASJON_SAKSBEHANDLER_SOK = 'FLYTT_RESERVASJON_SAKSBEHANDLER_SOK',
	FLYTT_RESERVASJON = 'FLYTT_RESERVASJON',
	OPPGAVEKO_SAKSBEHANDLERE = 'OPPGAVEKO_SAKSBEHANDLERE',
	OPPGAVEKO_SAKSBEHANDLERE_V3 = 'OPPGAVEKO_SAKSBEHANDLERE_V3',
	BEHANDLINGSKO_OPPGAVE_ANTALL = 'BEHANDLINGSKO_OPPGAVE_ANTALL',
	BEHANDLINGSKO_OPPGAVE_ANTALL_V3 = 'BEHANDLINGSKO_OPPGAVE_ANTALL_V3',
	HENT_NYE_OG_FERDIGSTILTE_OPPGAVER = 'HENT_NYE_OG_FERDIGSTILTE_OPPGAVER',
	HENT_ALLE_RESERVASJONER = 'HENT_ALLE_RESERVASJONER',
	AVDELINGSLEDER_OPPHEVER_RESERVASJON = 'AVDELINGSLEDER_OPPHEVER_RESERVASJON',
	HENT_BEHANDLINGER_SOM_GÅR_AV_VENT = 'HENT_BEHANDLINGER_SOM_GÅR_AV_VENT',
	FÅ_OPPGAVE_FRA_KO = 'FÅ_OPPGAVE_FRA_KO',
	OPPGAVE_QUERY = 'OPPGAVE_QUERY',
	OPPGAVE_QUERY_TO_FILE = 'OPPGAVE_QUERY_TO_FILE',
	OPPGAVE_QUERY_FELTER = 'OPPGAVE_QUERY_FELTER',
}

export const endpoints = () =>
	new RestApiConfigBuilder('api/k9-los-api')
		/* /api/fagsak */
		.withPost('/fagsak/sok', K9LosApiKeys.SEARCH_FAGSAK)

		/* /api/saksbehandler */
		.withGet('/saksbehandler', K9LosApiKeys.NAV_ANSATT)

		/* /api/driftsmeldinger */
		.withGet('/driftsmeldinger', K9LosApiKeys.DRIFTSMELDINGER)
		.withPost('/driftsmeldinger/slett', K9LosApiKeys.SLETT_DRIFTSMELDING)
		.withPost('/driftsmeldinger', K9LosApiKeys.LAGRE_DRIFTSMELDING)
		.withPost('/driftsmeldinger/toggle', K9LosApiKeys.TOGGLE_DRIFTSMELDING)

		/* /api/saksbehandler/saksliste */
		.withGet('/saksbehandler/oppgaveko', K9LosApiKeys.OPPGAVEKO)
		.withGet('/saksbehandler/oppgaveko/saksbehandlere', K9LosApiKeys.OPPGAVEKO_SAKSBEHANDLERE)

		/* /api/saksbehandler/oppgave */
		.withGet('/saksbehandler/oppgaver', K9LosApiKeys.OPPGAVER_TIL_BEHANDLING)
		.withGet('/saksbehandler/oppgaver/reserverte', K9LosApiKeys.RESERVERTE_OPPGAVER)
		.withPost('/saksbehandler/oppgaver/fa-oppgave-fra-ko', K9LosApiKeys.FÅ_OPPGAVE_FRA_KO)
		.withPost('/saksbehandler/oppgaver/reserver', K9LosApiKeys.RESERVER_OPPGAVE)
		.withGet('/saksbehandler/oppgaver/reservasjon-status', K9LosApiKeys.HENT_RESERVASJONSSTATUS)
		.withPost('/saksbehandler/oppgaver/opphev', K9LosApiKeys.OPPHEV_OPPGAVERESERVASJON)
		.withPost('/saksbehandler/oppgaver/forleng', K9LosApiKeys.FORLENG_OPPGAVERESERVASJON)
		.withGet('/saksbehandler/oppgaver/behandlede', K9LosApiKeys.BEHANDLEDE_OPPGAVER)
		.withPost('/saksbehandler/oppgaver/flytt/sok', K9LosApiKeys.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK)
		.withPost('/saksbehandler/oppgaver/flytt', K9LosApiKeys.FLYTT_RESERVASJON)
		.withGet('/saksbehandler/oppgaver/antall', K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL)
		.withGet('/saksbehandler/oppgaver/antall-oppgaver-i-ko', K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL_V3)
		.withPost('/saksbehandler/oppgaver/reservasjon/endre', K9LosApiKeys.ENDRE_OPPGAVERESERVASJON)
		/* /api/saksbehandler/nokkeltall */
		.withGet('/saksbehandler/nokkeltall/nye-og-ferdigstilte-oppgaver', K9LosApiKeys.HENT_NYE_OG_FERDIGSTILTE_OPPGAVER)

		/* /api/avdelingsleder/sakslister */
		.withGet('/avdelingsleder/oppgavekoer', K9LosApiKeys.OPPGAVEKOER)
		.withPost('/avdelingsleder/oppgavekoer', K9LosApiKeys.OPPRETT_NY_OPPGAVEKO)
		.withGet('/avdelingsleder/oppgavekoer/hent', K9LosApiKeys.HENT_OPPGAVEKO)
		.withPost('/avdelingsleder/oppgavekoer/slett', K9LosApiKeys.SLETT_OPPGAVEKO)
		.withPost('/avdelingsleder/oppgavekoer/navn', K9LosApiKeys.LAGRE_OPPGAVEKO_NAVN)
		.withPost('/avdelingsleder/oppgavekoer/behandlingstype', K9LosApiKeys.LAGRE_OPPGAVEKO_BEHANDLINGSTYPE)
		.withPost('/avdelingsleder/oppgavekoer/ytelsetype', K9LosApiKeys.LAGRE_OPPGAVEKO_FAGSAK_YTELSE_TYPE)
		.withPost('/avdelingsleder/oppgavekoer/andre-kriterier', K9LosApiKeys.LAGRE_OPPGAVEKO_ANDRE_KRITERIER)
		.withPost('/avdelingsleder/oppgavekoer/sortering', K9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING)
		.withPost('/avdelingsleder/oppgavekoer/kriterier', K9LosApiKeys.LAGRE_OPPGAVEKO_KRITERIER)
		.withPost('/avdelingsleder/oppgavekoer/skjermet', K9LosApiKeys.LAGRE_OPPGAVEKO_SKJERMET)
		.withPost(
			'/avdelingsleder/oppgavekoer/sortering-tidsintervall-type',
			K9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING_DYNAMISK_PERIDE,
		)
		.withPost(
			'/avdelingsleder/oppgavekoer/sortering-tidsintervall-dager',
			K9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DAGER,
		)
		.withPost(
			'/avdelingsleder/oppgavekoer/sortering-tidsintervall-dato',
			K9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DATO,
		)
		.withPost('/avdelingsleder/oppgavekoer/saksbehandler', K9LosApiKeys.LAGRE_OPPGAVEKO_SAKSBEHANDLER)
		.withPost('/avdelingsleder/reservasjoner/opphev', K9LosApiKeys.AVDELINGSLEDER_OPPHEVER_RESERVASJON)

		/* /api/avdelingsleder/saksbehandlere */
		.withPost('/avdelingsleder/saksbehandlere/sok', K9LosApiKeys.SAKSBEHANDLER_SOK)
		.withGet('/avdelingsleder/saksbehandlere', K9LosApiKeys.SAKSBEHANDLERE)
		.withPost('/avdelingsleder/saksbehandlere', K9LosApiKeys.OPPRETT_NY_SAKSBEHANDLER)
		.withPost('/avdelingsleder/saksbehandlere/slett', K9LosApiKeys.SLETT_SAKSBEHANDLER)

		/* /api/avdelingsleder/oppgaver */
		.withGet('/avdelingsleder/oppgaver/antall', K9LosApiKeys.OPPGAVE_ANTALL)
		.withGet('/avdelingsleder/oppgaver/antall-totalt', K9LosApiKeys.OPPGAVE_ANTALL_TOTALT)
		/* /api/avdelingsleder/nokkeltall */
		.withGet('/avdelingsleder/nokkeltall/nye-ferdigstilte-oppsummering', K9LosApiKeys.HENT_OPPSUMMERING)
		.withGet(
			'/avdelingsleder/nokkeltall/behandlinger-manuelt-vent-historikk',
			K9LosApiKeys.HENT_OPPGAVER_MANUELT_PA_VENT,
		)
		.withGet(
			'/avdelingsleder/nokkeltall/behandlinger-forste-stonadsdag',
			K9LosApiKeys.HENT_OPPGAVER_PER_FORSTE_STONADSDAG,
		)
		.withGet('/avdelingsleder/nokkeltall/dagens-tall', K9LosApiKeys.HENT_DAGENS_TALL)
		.withGet('/avdelingsleder/nokkeltall/alle-paa-vent_v2', K9LosApiKeys.HENT_BEHANDLINGER_SOM_GÅR_AV_VENT)

		.withGet('/avdelingsleder/reservasjoner', K9LosApiKeys.HENT_ALLE_RESERVASJONER)

		/* /api/kodeverk */
		.withGet('/kodeverk', K9LosApiKeys.KODEVERK)

		.withPost('/ny-oppgavestyring/oppgave/query', K9LosApiKeys.OPPGAVE_QUERY)
		.withPostAndOpenBlob('/ny-oppgavestyring/oppgave/queryToFile', K9LosApiKeys.OPPGAVE_QUERY_TO_FILE)
		.withGet('/ny-oppgavestyring/oppgave/felter', K9LosApiKeys.OPPGAVE_QUERY_FELTER)

		.build();

export const k9LosApi = () => createRequestApi(endpoints());

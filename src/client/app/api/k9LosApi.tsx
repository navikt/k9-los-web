import { RestApiConfigBuilder, createRequestApi } from './rest-api';

export enum RestApiGlobalStatePathsKeys {
	KODEVERK = 'KODEVERK',
}

export enum K9LosApiKeys {
	KODEVERK = 'KODEVERK',
	FORLENG_OPPGAVERESERVASJON = 'FORLENG_OPPGAVERESERVASJON',
	DRIFTSMELDINGER = 'DRIFTSMELDINGER',
	LAGRE_DRIFTSMELDING = 'LAGRE_DRIFTSMELDING',
	SLETT_DRIFTSMELDING = 'SLETT_DRIFTSMELDING',
	TOGGLE_DRIFTSMELDING = 'TOGGLE_DRIFTSMELDING',
	OPPGAVE_QUERY = 'OPPGAVE_QUERY',
	OPPGAVE_QUERY_TO_FILE = 'OPPGAVE_QUERY_TO_FILE',
}

export const endpoints = () =>
	new RestApiConfigBuilder('api/k9-los-api')
		.withGet('/kodeverk', K9LosApiKeys.KODEVERK)
		.withGet('/driftsmeldinger', K9LosApiKeys.DRIFTSMELDINGER)
		.withPost('/driftsmeldinger/slett', K9LosApiKeys.SLETT_DRIFTSMELDING)
		.withPost('/driftsmeldinger', K9LosApiKeys.LAGRE_DRIFTSMELDING)
		.withPost('/driftsmeldinger/toggle', K9LosApiKeys.TOGGLE_DRIFTSMELDING)
		.withPost('/saksbehandler/oppgaver/forleng', K9LosApiKeys.FORLENG_OPPGAVERESERVASJON)
		.withPost('/ny-oppgavestyring/oppgave/query', K9LosApiKeys.OPPGAVE_QUERY)
		.withPostAndOpenBlob('/ny-oppgavestyring/oppgave/queryToFile', K9LosApiKeys.OPPGAVE_QUERY_TO_FILE)
		.build();

export const k9LosApi = () => createRequestApi(endpoints());

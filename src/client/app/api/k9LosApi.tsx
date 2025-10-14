import { RestApiConfigBuilder, createRequestApi } from './rest-api';

export enum RestApiGlobalStatePathsKeys {}

export enum K9LosApiKeys {
	OPPGAVE_QUERY = 'OPPGAVE_QUERY',
	OPPGAVE_QUERY_TO_FILE = 'OPPGAVE_QUERY_TO_FILE',
}

export const endpoints = () =>
	new RestApiConfigBuilder('api/k9-los-api')
		.withPost('/ny-oppgavestyring/oppgave/query', K9LosApiKeys.OPPGAVE_QUERY)
		.withPostAndOpenBlob('/ny-oppgavestyring/oppgave/queryToFile', K9LosApiKeys.OPPGAVE_QUERY_TO_FILE)
		.build();

export const k9LosApi = () => createRequestApi(endpoints());

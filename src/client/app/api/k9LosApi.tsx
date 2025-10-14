import { RestApiConfigBuilder, createRequestApi } from './rest-api';

export enum RestApiGlobalStatePathsKeys {}

export const endpoints = () => new RestApiConfigBuilder('api/k9-los-api').build();

export const k9LosApi = () => createRequestApi(endpoints());

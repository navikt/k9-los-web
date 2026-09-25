import type { AxiosError, AxiosRequestConfig } from 'axios';
import { axiosInstance } from 'utils/reactQueryConfig';

// OpenAPI-spec-en beskriver backendens stier (/api/...), mens frontend går via proxyen på /api/k9-los-api
// (se vite.config.ts og nais/*.yml), som skriver /api/k9-los-api tilbake til /api.
export const tilProxySti = (url: string) => url.replace(/^\/api\//, '/api/k9-los-api/');

export const losClient = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> =>
	axiosInstance
		.request<T>({ ...config, ...options, url: config.url ? tilProxySti(config.url) : config.url })
		.then(({ data }) => data);

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;

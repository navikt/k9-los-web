import axios, { AxiosResponse } from 'axios';
import initRestMethods from './initRestMethods';

export const callId = `CallId_${new Date().getTime()}_${Math.floor(Math.random() * 1000000000)}`;

const konverterKodeverkTilKode = (data: any) => {
	if (data === undefined || data === null) {
		return;
	}
	Object.keys(data).forEach((key) => {
		if (data[key]?.kode && data[key]?.kodeverk && Object.keys(data[key]).length === 3) {
			// eslint-disable-next-line no-param-reassign
			data[key] = data[key].kode;
		}
		if (typeof data[key] === 'object' && data[key] !== null) {
			konverterKodeverkTilKode(data[key]);
		}
	});
};

/**
 * getAxiosHttpClientApi
 * Oppretter nytt http-klient api basert på Axios.
 */
const getAxiosHttpClientApi = () => {
	const axiosInstance = axios.create();

	// @ts-ignore
	axiosInstance.CancelToken = axios.CancelToken;

	// @ts-ignore
	axiosInstance.isCancel = axios.isCancel;

	// TODO (TOR) sentry bør ikkje vera ein avhengighet til pakka "rest-api". Konfigurer dette utanfor
	axiosInstance.interceptors.request.use((c): any => {
		const config = { ...c };
		config.headers['Nav-Callid'] = callId;
		config.withCredentials = true;
		return config;
	});

	// TODO Temp kode til backend returnerer string i staden for Kodeverk
	axiosInstance.interceptors.response.use((response: AxiosResponse): any => {
		if (
			response.status === 200 &&
			response.config.url &&
			response.config.url.includes('/api/') &&
			!response.config.url.includes('/k9-los-api/kodeverk') &&
			!response.config.url.includes('/api/kodeverk')
		) {
			konverterKodeverkTilKode(response.data);
		}
		return response;
	});

	const restMethods = initRestMethods(axiosInstance);
	return {
		get: restMethods.get,
		post: restMethods.post,
		put: restMethods.put,
		getBlob: restMethods.getBlob,
		postBlob: restMethods.postBlob,
		postAndOpenBlob: restMethods.postAndOpenBlob,
		getAsync: restMethods.getAsync,
		postAsync: restMethods.postAsync,
		putAsync: restMethods.putAsync,
		axiosInstance,
	};
};

export default getAxiosHttpClientApi;

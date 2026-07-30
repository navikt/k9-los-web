import type { QueryClientConfig, QueryFunctionContext } from '@tanstack/react-query';
import axios from 'axios';
import { callId } from 'utils/call-id';

const axiosConfig = {
	headers: {
		'Nav-Callid': callId,
	},
	withCredentials: true,
};
export const axiosInstance = axios.create({
	headers: {
		'Nav-Callid': callId,
	},
	withCredentials: true,
});

export const defaultQuery = async ({ queryKey }: QueryFunctionContext) => {
	const [url] = queryKey;
	if (typeof url !== 'string') {
		throw new Error(`Ugyldig queryKey: forventet streng, fikk ${typeof url}`);
	}
	const { data } = await axiosInstance.get<unknown>(url, axiosConfig);
	return data;
};

export const defaultMutation = async (variables: unknown) => {
	if (
		typeof variables !== 'object' ||
		variables === null ||
		!('url' in variables) ||
		typeof variables.url !== 'string'
	) {
		throw new Error('Ugyldige mutation-variabler: forventet et objekt med url');
	}
	const body = 'body' in variables ? variables.body : undefined;
	const { data } = await axiosInstance.post<unknown>(variables.url, body, axiosConfig);
	return data;
};

export const config = {
	defaultOptions: {
		queries: {
			queryFn: defaultQuery,
			refetchOnWindowFocus: false,
		},
		mutations: {
			mutationFn: defaultMutation,
		},
	},
} satisfies QueryClientConfig;

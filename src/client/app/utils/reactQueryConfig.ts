import { QueryClientConfig } from '@tanstack/react-query';
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

export const defaultQuery = async <T>({ queryKey }) => {
	const { data } = await axiosInstance.get<T>(queryKey[0], axiosConfig);
	return data;
};

export const defaultMutation = async <T>({ url, body }) => {
	const { data } = await axiosInstance.post<T>(url, body, axiosConfig);
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
} as QueryClientConfig;

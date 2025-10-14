import axios from 'axios';
import { callId } from 'utils/call-id';

const axiosConfig = {
	headers: {
		'Nav-Callid': callId,
	},
	withCredentials: true,
};

export const get = async (url: string) => {
	try {
		const response = await axios.get(url, axiosConfig);
		return response.data;
	} catch (error) {
		throw new Error(error);
	}
};

export const post = async (url: string, body: unknown) => {
	try {
		const response = await axios.post(url, body, axiosConfig);
		return response.data;
	} catch (error) {
		throw new Error(error);
	}
};

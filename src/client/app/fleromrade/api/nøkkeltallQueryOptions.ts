import { isAxiosError } from 'axios';

export const erIkkeImplementert = (error: unknown) => isAxiosError(error) && error.response?.status === 501;

export const nøkkeltallQueryOptions = {
	retry: (failureCount: number, error: Error) => !erIkkeImplementert(error) && failureCount < 3,
	refetchInterval: (query: { state: { error: Error | null } }) =>
		erIkkeImplementert(query.state.error) ? false : 60_000,
};

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiPaths from 'api/apiPaths';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';

export const useKodeverk = (options?: Omit<UseQueryOptions<AlleKodeverk, Error>, 'queryKey'>) =>
	useQuery<AlleKodeverk, Error>({
		queryKey: [apiPaths.kodeverk],
		gcTime: Infinity,
		staleTime: Infinity,
		refetchOnWindowFocus: false,
		...options,
	});
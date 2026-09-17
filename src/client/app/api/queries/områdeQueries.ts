import { useQuery } from '@tanstack/react-query';
import apiPaths from 'api/apiPaths';

export type Område = 'K9' | 'AKTIVITETSPENGER';

export const useInnloggetBrukersOmråder = () =>
	useQuery<Område[]>({
		queryKey: [apiPaths.innloggetBrukersOmråder],
		gcTime: Infinity,
		staleTime: Infinity,
	});

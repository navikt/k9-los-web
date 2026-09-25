import { useHentInnloggetBrukersOmråder } from 'api/generated/los';

export const useInnloggetBrukersOmråder = () =>
	useHentInnloggetBrukersOmråder({
		query: {
			gcTime: Infinity,
			staleTime: Infinity,
		},
	});

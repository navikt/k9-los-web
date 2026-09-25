import { useHentInnloggetBruker } from 'api/generated/los';
import { useOmråde } from 'fleromrade/OmrådeContext';

export const useInnloggetBruker = () => {
	const { urlSegment } = useOmråde();
	return useHentInnloggetBruker(urlSegment, {
		query: {
			gcTime: Infinity,
			staleTime: Infinity,
		},
	});
};

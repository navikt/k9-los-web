import { useHentInnloggetBrukersOmråder } from 'api/generated/los';
import type { Omrader } from 'api/generated/los.schemas';

export type Område = Omrader;

export const useInnloggetBrukersOmråder = () =>
	useHentInnloggetBrukersOmråder({
		query: {
			gcTime: Infinity,
			staleTime: Infinity,
		},
	});

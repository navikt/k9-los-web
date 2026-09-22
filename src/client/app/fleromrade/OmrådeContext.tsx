import type { OmradeUrlSegment } from 'api/generated/los.schemas';
import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { basisstiForOmråde, type Område, urlSegmentForOmråde } from './områder';

interface OmrådeKontekst {
	område: Område;
	urlSegment: OmradeUrlSegment;
	/** Rotstien til området i appen, f.eks. `/akt` eller `/k9-ny`. */
	basissti: string;
	kanBytteOmråde: boolean;
}

const OmrådeContext = createContext<OmrådeKontekst | undefined>(undefined);

export const OmrådeProvider = ({
	område,
	kanBytteOmråde = false,
	children,
}: {
	område: Område;
	kanBytteOmråde?: boolean;
	children: ReactNode;
}) => {
	const verdi = useMemo(() => {
		return { område, urlSegment: urlSegmentForOmråde[område], basissti: basisstiForOmråde[område], kanBytteOmråde };
	}, [område, kanBytteOmråde]);

	return <OmrådeContext.Provider value={verdi}>{children}</OmrådeContext.Provider>;
};

export const useOmråde = (): OmrådeKontekst => {
	const kontekst = useContext(OmrådeContext);
	if (!kontekst) {
		throw new Error('useOmråde må brukes innenfor en OmrådeProvider');
	}
	return kontekst;
};

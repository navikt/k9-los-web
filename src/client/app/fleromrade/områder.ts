import type { Omrader, OmradeUrlSegment } from 'api/generated/los.schemas';

export type Område = Extract<Omrader, 'K9' | 'AKTIVITETSPENGER'>;

export const områdenavn: Record<Område, string> = {
	K9: 'Pleiepenger, omsorgspenger og opplæringspenger',
	AKTIVITETSPENGER: 'Aktivitetspenger',
};

export const urlSegmentForOmråde: Record<Område, OmradeUrlSegment> = {
	K9: 'k9',
	AKTIVITETSPENGER: 'akt',
};

/** Rotstien for hvert område på nytt API. Legacy-K9 ligger separat under `/k9`. */
export const basisstiForOmråde: Record<Område, string> = {
	K9: '/k9-ny',
	AKTIVITETSPENGER: '/avp',
};

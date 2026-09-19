import type { Omrader, OmradeUrlSegment } from 'api/generated/los.schemas';

export type Område = Omrader;

export const områdenavn: Record<Område, string> = {
	K9: 'Pleiepenger, omsorgspenger og opplæringspenger',
	AKTIVITETSPENGER: 'Aktivitetspenger',
};

export const urlSegmentForOmråde: Record<Område, OmradeUrlSegment> = {
	K9: 'k9',
	AKTIVITETSPENGER: 'akt',
};

/**
 * Rotstien i appen for hvert område på ny API. K9 på ny API ligger under `/k9-ny`, siden `/k9` og stier uten
 * prefiks fortsatt går til legacy-K9.
 */
export const basisstiForOmråde: Record<Område, string> = {
	K9: '/k9-ny',
	AKTIVITETSPENGER: '/akt',
};

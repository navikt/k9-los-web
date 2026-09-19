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

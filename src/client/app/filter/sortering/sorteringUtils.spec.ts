import { describe, expect, it } from 'vitest';
import { mapSorteringParamsTilKode, SORTERING_ALTERNATIVER } from './sorteringUtils';

describe('mapSorteringParamsTilKode', () => {
	it('gjenkjenner bare sorteringsfeltet i K9-området', () => {
		expect(mapSorteringParamsTilKode({ område: 'K9', kode: 'mottattDato', økende: true })).toBe(
			SORTERING_ALTERNATIVER.mottattDatoEldstTilNyest,
		);
		expect(mapSorteringParamsTilKode({ område: 'ANNET', kode: 'mottattDato', økende: true })).toBeNull();
	});
});

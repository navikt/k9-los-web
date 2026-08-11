import { describe, expect, it } from 'vitest';
import { FELT_SENTINELLER, feltIdentitet, feltreferanseFraIdentitet, finnFelt, sammeFelt } from './feltIdentitet';
import { type Oppgavefelt, Synlighet, TolkesSom } from './filterTsTypes';

const felt = (område: string | null, kode: string): Oppgavefelt => ({
	område,
	kode,
	visningsnavn: `${område}:${kode}`,
	synlighet: Synlighet.OverStreken,
	tolkes_som: TolkesSom.String,
	listetype: false,
	verdiforklaringerErUttømmende: false,
	verdiforklaringer: null,
});

describe('feltIdentitet', () => {
	it('skiller lik kode i forskjellige områder', () => {
		const k9Felt = felt('K9', 'status');
		const annetFelt = felt('ANNET', 'status');

		expect(sammeFelt(k9Felt, annetFelt)).toBe(false);
		expect(feltIdentitet(k9Felt)).not.toBe(feltIdentitet(annetFelt));
		expect(finnFelt([k9Felt, annetFelt], annetFelt)).toBe(annetFelt);
	});

	it('bevarer null som område i identiteten', () => {
		const referanse = { område: null as string | null, kode: 'oppgavestatus' };

		expect(feltreferanseFraIdentitet(feltIdentitet(referanse))).toEqual(referanse);
	});

	it('avviser reserverte sentineller', () => {
		for (const sentinel of Object.values(FELT_SENTINELLER)) {
			expect(feltreferanseFraIdentitet(sentinel)).toBeUndefined();
		}
	});
});

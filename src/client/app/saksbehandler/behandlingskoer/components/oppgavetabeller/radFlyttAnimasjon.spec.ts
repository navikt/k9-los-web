import { describe, expect, it } from 'vitest';
import { beregnFlyttinger } from './radFlyttAnimasjon';

const posisjoner = (oppføringer: Array<[string, number]>) => new Map(oppføringer);

describe('beregnFlyttinger', () => {
	it('gir forskyvning som peker tilbake til forrige posisjon', () => {
		const resultat = beregnFlyttinger(posisjoner([['a', 0]]), posisjoner([['a', 60]]));
		expect(resultat).toEqual([{ nøkkel: 'a', forskyvning: -60 }]);
	});

	it('gir positiv forskyvning for rader som flyttes oppover', () => {
		const resultat = beregnFlyttinger(posisjoner([['a', 60]]), posisjoner([['a', 0]]));
		expect(resultat).toEqual([{ nøkkel: 'a', forskyvning: 60 }]);
	});

	it('ignorerer rader som ikke har flyttet seg', () => {
		expect(beregnFlyttinger(posisjoner([['a', 30]]), posisjoner([['a', 30]]))).toEqual([]);
	});

	it('ignorerer forskyvning under én piksel', () => {
		expect(beregnFlyttinger(posisjoner([['a', 30]]), posisjoner([['a', 30.4]]))).toEqual([]);
	});

	it('ignorerer nye rader uten tidligere posisjon', () => {
		expect(beregnFlyttinger(posisjoner([]), posisjoner([['ny', 60]]))).toEqual([]);
	});

	it('ignorerer rader som er fjernet', () => {
		expect(beregnFlyttinger(posisjoner([['borte', 0]]), posisjoner([]))).toEqual([]);
	});

	it('gir lik forskyvning for oppgaver som flyttes som én reservasjonsgruppe', () => {
		const forrige = posisjoner([
			['gruppe-1', 0],
			['gruppe-2', 30],
			['annen', 60],
		]);
		const nye = posisjoner([
			['annen', 0],
			['gruppe-1', 30],
			['gruppe-2', 60],
		]);

		const resultat = beregnFlyttinger(forrige, nye);

		expect(resultat).toEqual([
			{ nøkkel: 'annen', forskyvning: 60 },
			{ nøkkel: 'gruppe-1', forskyvning: -30 },
			{ nøkkel: 'gruppe-2', forskyvning: -30 },
		]);
	});
});

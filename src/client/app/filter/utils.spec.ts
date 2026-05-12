import { Synlighet, Verdiforklaring } from './filterTsTypes';
import { sorterGrupperinger, sorterVerdiforklaringer } from './utils';

const v = (visningsnavn: string, rekkefølge: number | undefined, gruppering?: string): Verdiforklaring => ({
	verdi: visningsnavn.toLowerCase(),
	visningsnavn,
	gruppering,
	synlighet: Synlighet.OverStreken,
	rekkefølge,
});

describe('sorterVerdiforklaringer', () => {
	it('sorterer bare null-verdier alfabetisk', () => {
		const resultat = sorterVerdiforklaringer([v('C', undefined), v('A', undefined), v('B', undefined)]);
		expect(resultat.map((r) => r.visningsnavn)).toEqual(['A', 'B', 'C']);
	});

	it('sorterer bare positive rekkefølge-verdier stigende', () => {
		const resultat = sorterVerdiforklaringer([v('X', 3), v('Y', 1), v('Z', 2)]);
		expect(resultat.map((r) => r.visningsnavn)).toEqual(['Y', 'Z', 'X']);
	});

	it('sorterer alfabetisk ved lik rekkefølge', () => {
		const resultat = sorterVerdiforklaringer([v('B', 1), v('A', 1)]);
		expect(resultat.map((r) => r.visningsnavn)).toEqual(['A', 'B']);
	});

	it('plasserer positive først, deretter null, deretter negative', () => {
		const resultat = sorterVerdiforklaringer([v('Bunn', -1), v('Midt', undefined), v('Topp', 0)]);
		expect(resultat.map((r) => r.visningsnavn)).toEqual(['Topp', 'Midt', 'Bunn']);
	});

	it('sorterer negative stigende slik at -1 er sist', () => {
		const resultat = sorterVerdiforklaringer([v('Sist', -1), v('Nest sist', -2), v('Tredje sist', -3)]);
		expect(resultat.map((r) => r.visningsnavn)).toEqual(['Tredje sist', 'Nest sist', 'Sist']);
	});

	it('håndterer blanding av alle tre grupper', () => {
		const resultat = sorterVerdiforklaringer([
			v('A', undefined),
			v('AB', 1),
			v('B', undefined),
			v('0', 100),
			v('Sist', -1),
			v('Nest sist', -2),
			v('Først', 0),
		]);
		expect(resultat.map((r) => r.visningsnavn)).toEqual(['Først', 'AB', '0', 'A', 'B', 'Nest sist', 'Sist']);
	});

	it('returnerer tom liste uendret', () => {
		expect(sorterVerdiforklaringer([])).toEqual([]);
	});

	it('muterer ikke opprinnelig array', () => {
		const original = [v('B', undefined), v('A', undefined)];
		sorterVerdiforklaringer(original);
		expect(original.map((r) => r.visningsnavn)).toEqual(['B', 'A']);
	});
});

describe('sorterGrupperinger', () => {
	it('sorterer grupper etter minste rekkefølge-tall i gruppen', () => {
		const verdier = [v('A', 10, 'Gruppe B'), v('B', 1, 'Gruppe A')];
		expect(sorterGrupperinger(['Gruppe B', 'Gruppe A'], verdier)).toEqual(['Gruppe A', 'Gruppe B']);
	});

	it('bruker minste tall når gruppen har flere verdier', () => {
		const verdier = [v('X', 50, 'Sen'), v('Y', 5, 'Sen'), v('Z', 2, 'Tidlig')];
		expect(sorterGrupperinger(['Sen', 'Tidlig'], verdier)).toEqual(['Tidlig', 'Sen']);
	});

	it('plasserer grupper med kun null-verdier i midten', () => {
		const verdier = [v('A', 1, 'Topp'), v('B', undefined, 'Midt'), v('C', -1, 'Bunn')];
		expect(sorterGrupperinger(['Bunn', 'Midt', 'Topp'], verdier)).toEqual(['Topp', 'Midt', 'Bunn']);
	});

	it('plasserer grupper med negative verdier sist', () => {
		const verdier = [v('A', -1, 'Sist'), v('B', -2, 'Nest sist'), v('C', undefined, 'Midt')];
		expect(sorterGrupperinger(['Sist', 'Nest sist', 'Midt'], verdier)).toEqual(['Midt', 'Nest sist', 'Sist']);
	});

	it('sorterer alfabetisk ved lik effektiv rekkefølge', () => {
		const verdier = [v('A', 1, 'Bravo'), v('B', 1, 'Alfa')];
		expect(sorterGrupperinger(['Bravo', 'Alfa'], verdier)).toEqual(['Alfa', 'Bravo']);
	});

	it('bruker minste positive tall selv om gruppen også har null-verdier', () => {
		const verdier = [v('A', undefined, 'Gruppe'), v('B', 5, 'Gruppe'), v('C', 1, 'Annen')];
		expect(sorterGrupperinger(['Gruppe', 'Annen'], verdier)).toEqual(['Annen', 'Gruppe']);
	});
});

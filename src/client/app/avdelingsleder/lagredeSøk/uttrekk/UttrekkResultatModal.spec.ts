import { Oppgavefelt, TolkesSom } from 'filter/filterTsTypes';
import { formatCelleVerdi } from './UttrekkResultatModal';

function lagFeltdef(overrides: Partial<Oppgavefelt> = {}): Oppgavefelt {
	return {
		område: 'K9',
		kode: 'testFelt',
		visningsnavn: 'Testfelt',
		kokriterie: false,
		tolkes_som: TolkesSom.String,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
		...overrides,
	};
}

describe('formatCelleVerdi', () => {
	it('viser - for null', () => {
		expect(formatCelleVerdi(null, undefined, true)).toBe('-');
	});

	it('viser - for undefined', () => {
		expect(formatCelleVerdi(undefined, undefined, true)).toBe('-');
	});

	it('viser - for tom streng', () => {
		expect(formatCelleVerdi('', undefined, true)).toBe('-');
	});

	it('viser råverdi som streng uten feltdefinisjon', () => {
		expect(formatCelleVerdi('PSB', undefined, true)).toBe('PSB');
	});

	it('viser råverdi når formatering er avslått', () => {
		const feltdef = lagFeltdef({
			verdiforklaringer: [{ verdi: 'PSB', visningsnavn: 'Pleiepenger sykt barn', gruppering: undefined }],
		});
		expect(formatCelleVerdi('PSB', feltdef, false)).toBe('PSB');
	});

	describe('verdiforklaring', () => {
		const feltdef = lagFeltdef({
			verdiforklaringer: [
				{ verdi: 'PSB', visningsnavn: 'Pleiepenger sykt barn', gruppering: undefined },
				{ verdi: 'OMP', visningsnavn: 'Omsorgspenger', gruppering: undefined },
			],
		});

		it('erstatter kodeverdi med visningsnavn', () => {
			expect(formatCelleVerdi('PSB', feltdef, true)).toBe('Pleiepenger sykt barn');
		});

		it('faller tilbake til råverdi ved ukjent kode', () => {
			expect(formatCelleVerdi('UKJENT', feltdef, true)).toBe('UKJENT');
		});
	});

	describe('boolean', () => {
		const feltdef = lagFeltdef({ tolkes_som: TolkesSom.Boolean });

		it('viser Ja for "true" (streng)', () => {
			expect(formatCelleVerdi('true', feltdef, true)).toBe('Ja');
		});

		it('viser Nei for "false" (streng)', () => {
			expect(formatCelleVerdi('false', feltdef, true)).toBe('Nei');
		});
	});

	describe('timestamp', () => {
		const feltdef = lagFeltdef({ tolkes_som: TolkesSom.Timestamp });

		it('formaterer ISO-timestamp til norsk format', () => {
			const resultat = formatCelleVerdi('2026-04-01T12:06:00Z', feltdef, true);
			expect(resultat).toContain('apr');
			expect(resultat).toContain('2026');
			// Klokkeslett avhenger av tidssone, sjekk bare at det inneholder "kl." eller timer:minutter-mønster
			expect(resultat).toMatch(/\d{2}:\d{2}/);
		});

		it('faller tilbake til råverdi ved ugyldig dato', () => {
			expect(formatCelleVerdi('ikke-en-dato', feltdef, true)).toBe('ikke-en-dato');
		});
	});

	describe('vanlig streng', () => {
		const feltdef = lagFeltdef({ tolkes_som: TolkesSom.String });

		it('viser verdi som streng', () => {
			expect(formatCelleVerdi('en tekst', feltdef, true)).toBe('en tekst');
		});
	});
});

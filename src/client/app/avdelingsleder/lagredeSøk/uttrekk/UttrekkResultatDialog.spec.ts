import { Oppgavefelt, TolkesSom } from 'filter/filterTsTypes';
import { formatCelleVerdi, harFormatering } from './UttrekkResultatDialog';

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

		it('konverterer tall til streng', () => {
			expect(formatCelleVerdi(42, feltdef, true)).toBe('42');
		});
	});

	describe('duration', () => {
		const feltdef = lagFeltdef({ tolkes_som: TolkesSom.Duration });

		it('formaterer ISO-duration til antall dager', () => {
			expect(formatCelleVerdi('PT48H', feltdef, true)).toBe('2');
		});

		it('formaterer duration med dager og timer', () => {
			expect(formatCelleVerdi('P3DT12H', feltdef, true)).toBe('3');
		});

		it('viser 0 for kort duration', () => {
			expect(formatCelleVerdi('PT2H30M', feltdef, true)).toBe('0');
		});

		it('håndterer heltallsverdi (dager som tall)', () => {
			expect(formatCelleVerdi(7, feltdef, true)).toBe('7');
		});

		it('håndterer heltallsverdi som streng', () => {
			expect(formatCelleVerdi('14', feltdef, true)).toBe('14');
		});

		it('faller tilbake til råverdi ved ugyldig duration', () => {
			expect(formatCelleVerdi('ugyldig', feltdef, true)).toBe('ugyldig');
		});
	});
});

describe('harFormatering', () => {
	it('returnerer false for undefined feltdef', () => {
		expect(harFormatering(undefined)).toBe(false);
	});

	it('returnerer true for felt med verdiforklaringer', () => {
		const feltdef = lagFeltdef({
			verdiforklaringer: [{ verdi: 'A', visningsnavn: 'Alfa', gruppering: undefined }],
		});
		expect(harFormatering(feltdef)).toBe(true);
	});

	it('returnerer true for Boolean-felt', () => {
		expect(harFormatering(lagFeltdef({ tolkes_som: TolkesSom.Boolean }))).toBe(true);
	});

	it('returnerer true for Timestamp-felt', () => {
		expect(harFormatering(lagFeltdef({ tolkes_som: TolkesSom.Timestamp }))).toBe(true);
	});

	it('returnerer true for Duration-felt', () => {
		expect(harFormatering(lagFeltdef({ tolkes_som: TolkesSom.Duration }))).toBe(true);
	});

	it('returnerer false for vanlig String-felt uten verdiforklaringer', () => {
		expect(harFormatering(lagFeltdef({ tolkes_som: TolkesSom.String }))).toBe(false);
	});

	it('returnerer false for Integer-felt uten verdiforklaringer', () => {
		expect(harFormatering(lagFeltdef({ tolkes_som: TolkesSom.Integer }))).toBe(false);
	});
});

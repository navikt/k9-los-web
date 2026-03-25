import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import {
	EnkelOrderFelt,
	EnkelSelectFelt,
	FeltverdiOppgavefilter,
	OppgaveQuery,
	Oppgavefelt,
	TolkesSom,
} from './filterTsTypes';
import {
	FilterBeskrivelse,
	OrderBeskrivelse,
	SelectBeskrivelse,
	utledFilterBeskrivelse,
	utledOrderBeskrivelse,
	utledSelectBeskrivelse,
} from './queryBeskrivelseUtils';

dayjs.extend(durationPlugin);

describe('queryBeskrivelseUtils', () => {
	const felter: Oppgavefelt[] = [
		{
			område: null,
			kode: 'oppgavestatus',
			visningsnavn: 'Oppgavestatus',
			kokriterie: false,
			tolkes_som: TolkesSom.String,
			verdiforklaringerErUttømmende: true,
			verdiforklaringer: [
				{ verdi: 'AAPEN', visningsnavn: 'Åpen', gruppering: undefined, sekundærvalg: false },
				{ verdi: 'VENTER', visningsnavn: 'Venter', gruppering: undefined, sekundærvalg: false },
				{ verdi: 'LUKKET', visningsnavn: 'Lukket', gruppering: undefined, sekundærvalg: false },
			],
		},
		{
			område: null,
			kode: 'personbeskyttelse',
			visningsnavn: 'Personbeskyttelse',
			kokriterie: false,
			tolkes_som: TolkesSom.String,
			verdiforklaringerErUttømmende: true,
			verdiforklaringer: [
				{ verdi: 'KODE7', visningsnavn: 'Kode 7', gruppering: undefined, sekundærvalg: false },
				{ verdi: 'EGEN_ANSATT', visningsnavn: 'Egen ansatt', gruppering: undefined, sekundærvalg: false },
			],
		},
		{
			område: 'K9',
			kode: 'hastesak',
			visningsnavn: 'Hastesak',
			kokriterie: false,
			tolkes_som: TolkesSom.Boolean,
			verdiforklaringerErUttømmende: false,
			verdiforklaringer: null,
		},
		{
			område: 'K9',
			kode: 'mottattDato',
			visningsnavn: 'Mottatt dato',
			kokriterie: false,
			tolkes_som: TolkesSom.Timestamp,
			verdiforklaringerErUttømmende: false,
			verdiforklaringer: null,
		},
		{
			område: 'K9',
			kode: 'akkumulertVentetid',
			visningsnavn: 'Akkumulert ventetid',
			kokriterie: false,
			tolkes_som: TolkesSom.Duration,
			verdiforklaringerErUttømmende: false,
			verdiforklaringer: null,
		},
		{
			område: 'K9',
			kode: 'saksnummer',
			visningsnavn: 'Saksnummer',
			kokriterie: false,
			tolkes_som: TolkesSom.String,
			verdiforklaringerErUttømmende: false,
			verdiforklaringer: null,
		},
	];

	const opprettQuery = (
		filtere: FeltverdiOppgavefilter[] = [],
		select: EnkelSelectFelt[] = [],
		order: EnkelOrderFelt[] = [],
	): OppgaveQuery => ({
		filtere,
		select,
		order,
	});

	describe('utledFilterBeskrivelse', () => {
		it('should return empty array for query without filters', () => {
			const query = opprettQuery();
			const result = utledFilterBeskrivelse(query, felter);
			expect(result).toEqual([]);
		});

		it('should translate filter values using verdiforklaringer', () => {
			const query = opprettQuery([
				{
					type: 'feltverdi',
					område: null,
					kode: 'oppgavestatus',
					operator: 'IN',
					verdi: ['AAPEN', 'VENTER'],
				},
			]);

			const result = utledFilterBeskrivelse(query, felter);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual<FilterBeskrivelse>({
				feltnavn: 'Oppgavestatus',
				verdier: ['Åpen', 'Venter'],
				sammenføyning: { separator: ', ' },
			});
		});

		it('should set sammenføyning prefiks to "ikke" for NOT_IN operator', () => {
			const query = opprettQuery([
				{
					type: 'feltverdi',
					område: null,
					kode: 'personbeskyttelse',
					operator: 'NOT_IN',
					verdi: ['KODE7', 'EGEN_ANSATT'],
				},
			]);

			const result = utledFilterBeskrivelse(query, felter);

			expect(result[0].sammenføyning).toEqual({ prefiks: 'ikke ', separator: ', ' });
			expect(result[0].verdier).toEqual(['Kode 7', 'Egen ansatt']);
		});

		it('should format boolean values', () => {
			const query = opprettQuery([
				{
					type: 'feltverdi',
					område: 'K9',
					kode: 'hastesak' as any,
					operator: 'IN',
					verdi: ['true'],
				},
			]);

			const result = utledFilterBeskrivelse(query, felter);

			expect(result[0].verdier).toEqual(['Ja']);
		});

		it('should format timestamp values', () => {
			const query = opprettQuery([
				{
					type: 'feltverdi',
					område: 'K9',
					kode: 'mottattDato',
					operator: 'GREATER_THAN_OR_EQUALS',
					verdi: ['2024-01-15T00:00:00'],
				},
			]);

			const result = utledFilterBeskrivelse(query, felter);

			expect(result[0].verdier).toEqual(['15.01.2024']);
			expect(result[0].sammenføyning).toEqual({ prefiks: 'f.o.m. ' });
		});

		it('should add t.o.m. prefix for LESS_THAN_OR_EQUALS timestamp', () => {
			const query = opprettQuery([
				{
					type: 'feltverdi',
					område: 'K9',
					kode: 'mottattDato',
					operator: 'LESS_THAN_OR_EQUALS',
					verdi: ['2026-02-13T00:00:00'],
				},
			]);

			const result = utledFilterBeskrivelse(query, felter);

			expect(result[0].sammenføyning).toEqual({ prefiks: 't.o.m. ' });
		});

		it('should add tankestrek for INTERVAL timestamp', () => {
			const query = opprettQuery([
				{
					type: 'feltverdi',
					område: 'K9',
					kode: 'mottattDato',
					operator: 'INTERVAL',
					verdi: ['2026-02-01T00:00:00', '2026-02-13T00:00:00'],
				},
			]);

			const result = utledFilterBeskrivelse(query, felter);

			expect(result[0].sammenføyning).toEqual({ separator: ' – ' });
		});

		it('should format duration values', () => {
			const query = opprettQuery([
				{
					type: 'feltverdi',
					område: 'K9',
					kode: 'akkumulertVentetid',
					operator: 'LESS_THAN_OR_EQUALS',
					verdi: ['P2DT5H'],
				},
			]);

			const result = utledFilterBeskrivelse(query, felter);

			expect(result[0].verdier).toEqual(['2']);
			expect(result[0].sammenføyning).toEqual({ prefiks: '<= ' });
		});

		it('should skip filters without values', () => {
			const query = opprettQuery([
				{
					type: 'feltverdi',
					område: null,
					kode: 'oppgavestatus',
					operator: 'IN',
					verdi: [],
				},
			]);

			const result = utledFilterBeskrivelse(query, felter);

			expect(result).toHaveLength(0);
		});

		it('should use fallback visningsnavn for unknown fields', () => {
			const query = opprettQuery([
				{
					type: 'feltverdi',
					område: 'UKJENT',
					kode: 'ukjentFelt',
					operator: 'EQUALS',
					verdi: ['verdi1'],
				},
			]);

			const result = utledFilterBeskrivelse(query, felter);

			expect(result[0].feltnavn).toBe('ukjentFelt');
		});

		it('should handle nested combine filters', () => {
			const query: OppgaveQuery = {
				filtere: [
					{
						type: 'combine',
						combineOperator: 'AND',
						filtere: [
							{
								type: 'feltverdi',
								område: null,
								kode: 'oppgavestatus',
								operator: 'IN',
								verdi: ['AAPEN'],
							},
							{
								type: 'feltverdi',
								område: 'K9',
								kode: 'hastesak',
								operator: 'IN',
								verdi: ['true'],
							},
						],
					},
				],
				select: [],
				order: [],
			};

			const result = utledFilterBeskrivelse(query, felter);

			expect(result).toHaveLength(1);
			expect(result[0].feltnavn).toBe('Gruppe');
			expect(result[0].verdier).toEqual(['Oppgavestatus', 'Hastesak']);
		});
	});

	describe('utledSelectBeskrivelse', () => {
		it('should return empty array for query without select fields', () => {
			const query = opprettQuery();
			const result = utledSelectBeskrivelse(query, felter);
			expect(result).toEqual([]);
		});

		it('should return select field descriptions', () => {
			const query = opprettQuery(
				[],
				[
					{ type: 'enkel', område: 'K9', kode: 'saksnummer' },
					{ type: 'enkel', område: null, kode: 'oppgavestatus' },
				],
			);

			const result = utledSelectBeskrivelse(query, felter);

			expect(result).toHaveLength(2);
			expect(result).toEqual<SelectBeskrivelse[]>([{ feltnavn: 'Saksnummer' }, { feltnavn: 'Oppgavestatus' }]);
		});

		it('should skip select fields without kode', () => {
			const query = opprettQuery(
				[],
				[
					{ type: 'enkel', område: 'K9', kode: '' },
					{ type: 'enkel', område: 'K9', kode: 'saksnummer' },
				],
			);

			const result = utledSelectBeskrivelse(query, felter);

			expect(result).toHaveLength(1);
			expect(result[0].feltnavn).toBe('Saksnummer');
		});
	});

	describe('utledOrderBeskrivelse', () => {
		it('should return empty array for query without order fields', () => {
			const query = opprettQuery();
			const result = utledOrderBeskrivelse(query, felter);
			expect(result).toEqual([]);
		});

		it('should return order field descriptions with direction', () => {
			const query = opprettQuery(
				[],
				[],
				[
					{ type: 'enkel', område: 'K9', kode: 'mottattDato', økende: true },
					{ type: 'enkel', område: 'K9', kode: 'saksnummer', økende: false },
				],
			);

			const result = utledOrderBeskrivelse(query, felter);

			expect(result).toHaveLength(2);
			expect(result).toEqual<OrderBeskrivelse[]>([
				{ feltnavn: 'Mottatt dato', økende: true },
				{ feltnavn: 'Saksnummer', økende: false },
			]);
		});

		it('should skip order fields without kode', () => {
			const query = opprettQuery(
				[],
				[],
				[
					{ type: 'enkel', område: 'K9', kode: '', økende: true },
					{ type: 'enkel', område: 'K9', kode: 'mottattDato', økende: false },
				],
			);

			const result = utledOrderBeskrivelse(query, felter);

			expect(result).toHaveLength(1);
			expect(result[0].feltnavn).toBe('Mottatt dato');
		});
	});
});

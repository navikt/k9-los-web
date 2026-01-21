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
	utledQueryBeskrivelse,
	utledSelectBeskrivelse,
} from './queryBeskrivelseUtils';

dayjs.extend(durationPlugin);

describe('queryBeskrivelseUtils', () => {
	const felter: Oppgavefelt[] = [
		{
			område: 'K9',
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
			område: 'K9',
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
		id: 'root',
		filtere,
		select,
		order,
		limit: 100,
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
					id: '1',
					område: 'K9',
					kode: 'oppgavestatus' as any,
					operator: 'IN',
					verdi: ['AAPEN', 'VENTER'],
				},
			]);

			const result = utledFilterBeskrivelse(query, felter);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual<FilterBeskrivelse>({
				feltnavn: 'Oppgavestatus',
				verdier: ['Åpen', 'Venter'],
				nektelse: false,
			});
		});

		it('should set nektelse to true for NOT_IN operator', () => {
			const query = opprettQuery([
				{
					type: 'feltverdi',
					id: '1',
					område: 'K9',
					kode: 'personbeskyttelse' as any,
					operator: 'NOT_IN',
					verdi: ['KODE7', 'EGEN_ANSATT'],
				},
			]);

			const result = utledFilterBeskrivelse(query, felter);

			expect(result[0].nektelse).toBe(true);
			expect(result[0].verdier).toEqual(['Kode 7', 'Egen ansatt']);
		});

		it('should format boolean values', () => {
			const query = opprettQuery([
				{
					type: 'feltverdi',
					id: '1',
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
					id: '1',
					område: 'K9',
					kode: 'mottattDato' as any,
					operator: 'GREATER_THAN_OR_EQUALS',
					verdi: ['2024-01-15T00:00:00'],
				},
			]);

			const result = utledFilterBeskrivelse(query, felter);

			expect(result[0].verdier).toEqual(['15.01.2024']);
		});

		it('should format duration values', () => {
			const query = opprettQuery([
				{
					type: 'feltverdi',
					id: '1',
					område: 'K9',
					kode: 'akkumulertVentetid' as any,
					operator: 'LESS_THAN_OR_EQUALS',
					verdi: ['P2DT5H'],
				},
			]);

			const result = utledFilterBeskrivelse(query, felter);

			expect(result[0].verdier).toEqual(['2d 5t']);
		});

		it('should skip filters without values', () => {
			const query = opprettQuery([
				{
					type: 'feltverdi',
					id: '1',
					område: 'K9',
					kode: 'oppgavestatus' as any,
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
					id: '1',
					område: 'UKJENT',
					kode: 'ukjentFelt' as any,
					operator: 'EQUALS',
					verdi: ['verdi1'],
				},
			]);

			const result = utledFilterBeskrivelse(query, felter);

			expect(result[0].feltnavn).toBe('UKJENT.ukjentFelt');
		});

		it('should handle nested combine filters', () => {
			const query: OppgaveQuery = {
				id: 'root',
				filtere: [
					{
						type: 'combine',
						id: 'combine1',
						combineOperator: 'AND',
						filtere: [
							{
								type: 'feltverdi',
								id: '1',
								område: 'K9',
								kode: 'oppgavestatus' as any,
								operator: 'IN',
								verdi: ['AAPEN'],
							},
							{
								type: 'feltverdi',
								id: '2',
								område: 'K9',
								kode: 'hastesak' as any,
								operator: 'IN',
								verdi: ['true'],
							},
						],
					},
				],
				select: [],
				order: [],
				limit: 100,
			};

			const result = utledFilterBeskrivelse(query, felter);

			expect(result).toHaveLength(2);
			expect(result[0].feltnavn).toBe('Oppgavestatus');
			expect(result[1].feltnavn).toBe('Hastesak');
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
					{ type: 'enkel', id: '1', område: 'K9', kode: 'saksnummer' as any },
					{ type: 'enkel', id: '2', område: 'K9', kode: 'oppgavestatus' as any },
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
					{ type: 'enkel', id: '1', område: 'K9', kode: '' as any },
					{ type: 'enkel', id: '2', område: 'K9', kode: 'saksnummer' as any },
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
					{ type: 'enkel', id: '1', område: 'K9', kode: 'mottattDato' as any, økende: true },
					{ type: 'enkel', id: '2', område: 'K9', kode: 'saksnummer' as any, økende: false },
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
					{ type: 'enkel', id: '1', område: 'K9', kode: '' as any, økende: true },
					{ type: 'enkel', id: '2', område: 'K9', kode: 'mottattDato' as any, økende: false },
				],
			);

			const result = utledOrderBeskrivelse(query, felter);

			expect(result).toHaveLength(1);
			expect(result[0].feltnavn).toBe('Mottatt dato');
		});
	});

	describe('utledQueryBeskrivelse', () => {
		it('should return complete query description', () => {
			const query: OppgaveQuery = {
				id: 'root',
				filtere: [
					{
						type: 'feltverdi',
						id: '1',
						område: 'K9',
						kode: 'oppgavestatus' as any,
						operator: 'IN',
						verdi: ['AAPEN'],
					},
				],
				select: [{ type: 'enkel', id: '1', område: 'K9', kode: 'saksnummer' as any }],
				order: [{ type: 'enkel', id: '1', område: 'K9', kode: 'mottattDato' as any, økende: true }],
				limit: 100,
			};

			const result = utledQueryBeskrivelse(query, felter);

			expect(result.filtere).toHaveLength(1);
			expect(result.filtere[0].feltnavn).toBe('Oppgavestatus');
			expect(result.select).toHaveLength(1);
			expect(result.select[0].feltnavn).toBe('Saksnummer');
			expect(result.order).toHaveLength(1);
			expect(result.order[0].feltnavn).toBe('Mottatt dato');
			expect(result.order[0].økende).toBe(true);
		});
	});
});

import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import {
	AggregertFunksjon,
	EnkelOrderFelt,
	EnkelSelectFelt,
	FeltverdiOppgavefilter,
	OppgaveQuery,
	Oppgavefelt,
	OrderFelt,
	SelectFelt,
	Synlighet,
	TolkesSom,
} from './filterTsTypes';
import {
	FilterBeskrivelse,
	OrderBeskrivelse,
	SelectBeskrivelse,
	utledFilterBeskrivelse,
	utledFilterBeskrivelseUtenStandardverdier,
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
			synlighet: Synlighet.UnderStreken,
			tolkes_som: TolkesSom.String,
			listetype: false,
			verdiforklaringerErUttømmende: true,
			verdiforklaringer: [
				{
					verdi: 'AAPEN',
					visningsnavn: 'Åpen',
					gruppering: undefined,
					synlighet: Synlighet.OverStreken,
					rekkefølge: undefined,
				},
				{
					verdi: 'VENTER',
					visningsnavn: 'Venter',
					gruppering: undefined,
					synlighet: Synlighet.OverStreken,
					rekkefølge: undefined,
				},
				{
					verdi: 'LUKKET',
					visningsnavn: 'Lukket',
					gruppering: undefined,
					synlighet: Synlighet.OverStreken,
					rekkefølge: undefined,
				},
			],
		},
		{
			område: null,
			kode: 'personbeskyttelse',
			visningsnavn: 'Kode 7 eller egen ansatt',
			synlighet: Synlighet.UnderStreken,
			tolkes_som: TolkesSom.String,
			listetype: false,
			verdiforklaringerErUttømmende: true,
			verdiforklaringer: [
				{
					verdi: 'KODE7_ELLER_EGEN_ANSATT',
					visningsnavn: 'Kode 7 eller egen ansatt',
					gruppering: undefined,
					synlighet: Synlighet.OverStreken,
					rekkefølge: undefined,
				},
				{
					verdi: 'UGRADERT',
					visningsnavn: 'Ikke kode 7 eller egen ansatt',
					gruppering: undefined,
					synlighet: Synlighet.OverStreken,
					rekkefølge: undefined,
				},
			],
		},
		{
			område: 'K9',
			kode: 'hastesak',
			visningsnavn: 'Hastesak',
			synlighet: Synlighet.UnderStreken,
			tolkes_som: TolkesSom.Boolean,
			listetype: false,
			verdiforklaringerErUttømmende: false,
			verdiforklaringer: null,
		},
		{
			område: 'K9',
			kode: 'mottattDato',
			visningsnavn: 'Mottatt dato',
			synlighet: Synlighet.UnderStreken,
			tolkes_som: TolkesSom.Timestamp,
			listetype: false,
			verdiforklaringerErUttømmende: false,
			verdiforklaringer: null,
		},
		{
			område: 'K9',
			kode: 'akkumulertVentetid',
			visningsnavn: 'Akkumulert ventetid',
			synlighet: Synlighet.UnderStreken,
			tolkes_som: TolkesSom.Duration,
			listetype: false,
			verdiforklaringerErUttømmende: false,
			verdiforklaringer: null,
		},
		{
			område: 'K9',
			kode: 'saksnummer',
			visningsnavn: 'Saksnummer',
			synlighet: Synlighet.UnderStreken,
			tolkes_som: TolkesSom.String,
			listetype: false,
			verdiforklaringerErUttømmende: false,
			verdiforklaringer: null,
		},
	];

	const opprettQuery = (
		filtere: FeltverdiOppgavefilter[] = [],
		select: SelectFelt[] = [],
		order: OrderFelt[] = [],
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
					verdi: ['KODE7_ELLER_EGEN_ANSATT'],
				},
			]);

			const result = utledFilterBeskrivelse(query, felter);

			expect(result[0].sammenføyning).toEqual({ prefiks: 'ikke ', separator: ', ' });
			expect(result[0].verdier).toEqual(['Kode 7 eller egen ansatt']);
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

	describe('aggregerte select-beskrivelser', () => {
		it('should describe ANTALL without field', () => {
			const query = opprettQuery(
				[],
				[{ type: 'aggregert', funksjon: AggregertFunksjon.ANTALL, område: null, kode: null }],
			);

			const result = utledSelectBeskrivelse(query, felter);

			expect(result).toHaveLength(1);
			expect(result[0].feltnavn).toBe('Antall');
		});

		it('should describe SUM with field', () => {
			const query = opprettQuery(
				[],
				[{ type: 'aggregert', funksjon: AggregertFunksjon.SUM, område: 'K9', kode: 'saksnummer' }],
			);

			const result = utledSelectBeskrivelse(query, felter);

			expect(result).toHaveLength(1);
			expect(result[0].feltnavn).toBe('Sum(Saksnummer)');
		});

		it('should describe GJENNOMSNITT with unknown field', () => {
			const query = opprettQuery(
				[],
				[{ type: 'aggregert', funksjon: AggregertFunksjon.GJENNOMSNITT, område: 'K9', kode: 'ukjentFelt' }],
			);

			const result = utledSelectBeskrivelse(query, felter);

			expect(result).toHaveLength(1);
			expect(result[0].feltnavn).toBe('Gjennomsnitt(ukjentFelt)');
		});

		it('should mix enkel and aggregert select descriptions', () => {
			const query = opprettQuery(
				[],
				[
					{ type: 'enkel', område: 'K9', kode: 'saksnummer' },
					{ type: 'aggregert', funksjon: AggregertFunksjon.ANTALL, område: null, kode: null },
					{ type: 'aggregert', funksjon: AggregertFunksjon.MAKS, område: 'K9', kode: 'mottattDato' },
				],
			);

			const result = utledSelectBeskrivelse(query, felter);

			expect(result).toHaveLength(3);
			expect(result[0].feltnavn).toBe('Saksnummer');
			expect(result[1].feltnavn).toBe('Antall');
			expect(result[2].feltnavn).toBe('Maks(Mottatt dato)');
		});
	});

	describe('aggregerte order-beskrivelser', () => {
		it('should describe aggregert order with direction', () => {
			const query = opprettQuery(
				[],
				[],
				[{ type: 'aggregert', funksjon: AggregertFunksjon.ANTALL, område: null, kode: null, økende: false }],
			);

			const result = utledOrderBeskrivelse(query, felter);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({ feltnavn: 'Antall', økende: false });
		});

		it('should describe aggregert order with field', () => {
			const query = opprettQuery(
				[],
				[],
				[{ type: 'aggregert', funksjon: AggregertFunksjon.SUM, område: 'K9', kode: 'saksnummer', økende: true }],
			);

			const result = utledOrderBeskrivelse(query, felter);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({ feltnavn: 'Sum(Saksnummer)', økende: true });
		});

		it('should mix enkel and aggregert order descriptions', () => {
			const query = opprettQuery(
				[],
				[],
				[
					{ type: 'enkel', område: 'K9', kode: 'mottattDato', økende: true },
					{ type: 'aggregert', funksjon: AggregertFunksjon.ANTALL, område: null, kode: null, økende: false },
				],
			);

			const result = utledOrderBeskrivelse(query, felter);

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({ feltnavn: 'Mottatt dato', økende: true });
			expect(result[1]).toEqual({ feltnavn: 'Antall', økende: false });
		});
	});

	describe('utledFilterBeskrivelseUtenStandardverdier', () => {
		it('skjuler oppgavestatus når den kun er Åpen (IN)', () => {
			const query = opprettQuery([
				{ type: 'feltverdi', område: null, kode: 'oppgavestatus', operator: 'IN', verdi: ['AAPEN'] },
			]);

			const result = utledFilterBeskrivelseUtenStandardverdier(query, felter);

			expect(result).toEqual([]);
		});

		it('skjuler oppgavestatus når den kun er Åpen (EQUALS)', () => {
			const query = opprettQuery([
				{ type: 'feltverdi', område: null, kode: 'oppgavestatus', operator: 'EQUALS', verdi: ['AAPEN'] },
			]);

			const result = utledFilterBeskrivelseUtenStandardverdier(query, felter);

			expect(result).toEqual([]);
		});

		it('viser oppgavestatus når den er Åpen og Venter', () => {
			const query = opprettQuery([
				{ type: 'feltverdi', område: null, kode: 'oppgavestatus', operator: 'IN', verdi: ['AAPEN', 'VENTER'] },
			]);

			const result = utledFilterBeskrivelseUtenStandardverdier(query, felter);

			expect(result).toHaveLength(1);
			expect(result[0].feltnavn).toBe('Oppgavestatus');
			expect(result[0].verdier).toEqual(['Åpen', 'Venter']);
		});

		it('skjuler personbeskyttelse når den er Ikke kode 7 eller egen ansatt (IN UGRADERT)', () => {
			const query = opprettQuery([
				{
					type: 'feltverdi',
					område: null,
					kode: 'personbeskyttelse',
					operator: 'IN',
					verdi: ['UGRADERT'],
				},
			]);

			const result = utledFilterBeskrivelseUtenStandardverdier(query, felter);

			expect(result).toEqual([]);
		});

		it('viser personbeskyttelse når den ikke er standardverdien', () => {
			const query = opprettQuery([
				{
					type: 'feltverdi',
					område: null,
					kode: 'personbeskyttelse',
					operator: 'IN',
					verdi: ['KODE7_ELLER_EGEN_ANSATT'],
				},
			]);

			const result = utledFilterBeskrivelseUtenStandardverdier(query, felter);

			expect(result).toHaveLength(1);
			expect(result[0].feltnavn).toBe('Kode 7 eller egen ansatt');
			expect(result[0].verdier).toEqual(['Kode 7 eller egen ansatt']);
		});

		it('viser personbeskyttelse når operator ikke er IN/EQUALS', () => {
			const query = opprettQuery([
				{
					type: 'feltverdi',
					område: null,
					kode: 'personbeskyttelse',
					operator: 'NOT_IN',
					verdi: ['UGRADERT'],
				},
			]);

			const result = utledFilterBeskrivelseUtenStandardverdier(query, felter);

			expect(result).toHaveLength(1);
			expect(result[0].feltnavn).toBe('Kode 7 eller egen ansatt');
		});

		it('beholder øvrige kriterier og skjuler kun standardverdiene', () => {
			const query = opprettQuery([
				{ type: 'feltverdi', område: null, kode: 'oppgavestatus', operator: 'IN', verdi: ['AAPEN'] },
				{
					type: 'feltverdi',
					område: null,
					kode: 'personbeskyttelse',
					operator: 'IN',
					verdi: ['UGRADERT'],
				},
				{ type: 'feltverdi', område: 'K9', kode: 'hastesak', operator: 'IN', verdi: ['true'] },
			]);

			const result = utledFilterBeskrivelseUtenStandardverdier(query, felter);

			expect(result).toHaveLength(1);
			expect(result[0].feltnavn).toBe('Hastesak');
		});

		it('utledFilterBeskrivelse beholder alle kriterier (lagrede søk er uendret)', () => {
			const query = opprettQuery([
				{ type: 'feltverdi', område: null, kode: 'oppgavestatus', operator: 'IN', verdi: ['AAPEN'] },
				{
					type: 'feltverdi',
					område: null,
					kode: 'personbeskyttelse',
					operator: 'IN',
					verdi: ['UGRADERT'],
				},
			]);

			const result = utledFilterBeskrivelse(query, felter);

			expect(result).toHaveLength(2);
		});
	});
});

import {
	fjernNodeIdFraFilter,
	fjernNodeIdFraQuery,
	tilIdentifiedFilter,
	tilIdentifiedQuery,
} from './filterFrontendTypes';
import {
	AggregertFunksjon,
	AggregertOrderFelt,
	AggregertSelectFelt,
	CombineOppgavefilter,
	EnkelOrderFelt,
	EnkelSelectFelt,
	FeltverdiOppgavefilter,
	OppgaveQuery,
} from './filterTsTypes';

const feltverdiFilter: FeltverdiOppgavefilter = {
	type: 'feltverdi',
	område: 'K9',
	kode: 'aksjonspunkt',
	operator: 'EQUALS',
	verdi: ['5016'],
};

const combineFilter: CombineOppgavefilter = {
	type: 'combine',
	combineOperator: 'AND',
	filtere: [
		feltverdiFilter,
		{
			type: 'feltverdi',
			område: 'K9',
			kode: 'behandlingsstatus',
			operator: 'EQUALS',
			verdi: ['OPPRETTET'],
		},
	],
};

const selectFelt: EnkelSelectFelt = { type: 'enkel', område: 'K9', kode: 'aksjonspunkt' };
const orderFelt: EnkelOrderFelt = { type: 'enkel', område: 'K9', kode: 'mottattDato', økende: true };

const query: OppgaveQuery = {
	filtere: [feltverdiFilter, combineFilter],
	select: [selectFelt],
	order: [orderFelt],
};

describe('filterFrontendTypes konvertering', () => {
	describe('tilIdentifiedQuery og tilApiQuery roundtrip', () => {
		it('skal legge til _nodeId på alle nivåer og fjerne dem igjen', () => {
			const identified = tilIdentifiedQuery(query);

			// Toppnivå har _nodeId
			expect(identified._nodeId).toBeDefined();

			// FeltverdiOppgavefilter har _nodeId
			const identFeltverdi = identified.filtere[0];
			expect(identFeltverdi._nodeId).toBeDefined();
			expect(identFeltverdi.type).toBe('feltverdi');

			// CombineOppgavefilter har _nodeId og nested filtere har _nodeId
			const identCombine = identified.filtere[1];
			expect(identCombine._nodeId).toBeDefined();
			expect(identCombine.type).toBe('combine');
			if (identCombine.type === 'combine') {
				expect(identCombine.filtere).toHaveLength(2);
				identCombine.filtere.forEach((f) => {
					expect(f._nodeId).toBeDefined();
				});
			}

			// Select og order har _nodeId
			expect(identified.select[0]._nodeId).toBeDefined();
			expect(identified.select[0].kode).toBe('aksjonspunkt');
			expect(identified.order[0]._nodeId).toBeDefined();
			expect(identified.order[0].økende).toBe(true);

			// Roundtrip tilbake til OppgaveQuery
			const roundtripped = fjernNodeIdFraQuery(identified);
			expect(roundtripped).toEqual(query);
		});

		it('alle _nodeId-er skal være unike', () => {
			const identified = tilIdentifiedQuery(query);

			const nodeIds: string[] = [identified._nodeId];
			identified.filtere.forEach((f) => {
				nodeIds.push(f._nodeId);
				if (f.type === 'combine') {
					f.filtere.forEach((nested) => nodeIds.push(nested._nodeId));
				}
			});
			identified.select.forEach((s) => nodeIds.push(s._nodeId));
			identified.order.forEach((o) => nodeIds.push(o._nodeId));

			const unique = new Set(nodeIds);
			expect(unique.size).toBe(nodeIds.length);
		});
	});

	describe('tilIdentifiedFilter og tilApiFilter roundtrip', () => {
		it('skal roundtrippe FeltverdiOppgavefilter', () => {
			const identified = tilIdentifiedFilter(feltverdiFilter);
			expect(identified._nodeId).toBeDefined();
			expect(identified.type).toBe('feltverdi');

			const roundtripped = fjernNodeIdFraFilter(identified);
			expect(roundtripped).toEqual(feltverdiFilter);
		});

		it('skal roundtrippe CombineOppgavefilter med nested filtere', () => {
			const identified = tilIdentifiedFilter(combineFilter);
			expect(identified._nodeId).toBeDefined();
			expect(identified.type).toBe('combine');

			if (identified.type === 'combine') {
				expect(identified.filtere).toHaveLength(2);
				identified.filtere.forEach((f) => {
					expect(f._nodeId).toBeDefined();
				});
			}

			const roundtripped = fjernNodeIdFraFilter(identified);
			expect(roundtripped).toEqual(combineFilter);
		});
	});

	describe('aggregerte felter roundtrip', () => {
		const aggregertSelect: AggregertSelectFelt = {
			type: 'aggregert',
			funksjon: AggregertFunksjon.ANTALL,
			område: null,
			kode: null,
		};

		const aggregertSelectMedFelt: AggregertSelectFelt = {
			type: 'aggregert',
			funksjon: AggregertFunksjon.SUM,
			område: 'K9',
			kode: 'feilutbetaltBelop',
		};

		const aggregertOrder: AggregertOrderFelt = {
			type: 'aggregert',
			funksjon: AggregertFunksjon.ANTALL,
			område: null,
			kode: null,
			økende: false,
		};

		it('skal roundtrippe query med aggregerte select og order', () => {
			const queryMedAggregert: OppgaveQuery = {
				filtere: [feltverdiFilter],
				select: [selectFelt, aggregertSelect, aggregertSelectMedFelt],
				order: [orderFelt, aggregertOrder],
			};

			const identified = tilIdentifiedQuery(queryMedAggregert);

			expect(identified.select).toHaveLength(3);
			expect(identified.select[0].type).toBe('enkel');
			expect(identified.select[1].type).toBe('aggregert');
			if (identified.select[1].type === 'aggregert') {
				expect(identified.select[1].funksjon).toBe(AggregertFunksjon.ANTALL);
			}
			expect(identified.select[2].type).toBe('aggregert');
			if (identified.select[2].type === 'aggregert') {
				expect(identified.select[2].funksjon).toBe(AggregertFunksjon.SUM);
				expect(identified.select[2].kode).toBe('feilutbetaltBelop');
			}

			expect(identified.order).toHaveLength(2);
			expect(identified.order[0].type).toBe('enkel');
			expect(identified.order[1].type).toBe('aggregert');
			if (identified.order[1].type === 'aggregert') {
				expect(identified.order[1].funksjon).toBe(AggregertFunksjon.ANTALL);
				expect(identified.order[1].økende).toBe(false);
			}

			const roundtripped = fjernNodeIdFraQuery(identified);
			expect(roundtripped).toEqual(queryMedAggregert);
		});

		it('alle _nodeId-er skal være unike for aggregerte felter', () => {
			const queryMedAggregert: OppgaveQuery = {
				filtere: [],
				select: [selectFelt, aggregertSelect, aggregertSelectMedFelt],
				order: [aggregertOrder],
			};

			const identified = tilIdentifiedQuery(queryMedAggregert);

			const nodeIds: string[] = [identified._nodeId];
			identified.select.forEach((s) => nodeIds.push(s._nodeId));
			identified.order.forEach((o) => nodeIds.push(o._nodeId));

			const unique = new Set(nodeIds);
			expect(unique.size).toBe(nodeIds.length);
		});
	});
});

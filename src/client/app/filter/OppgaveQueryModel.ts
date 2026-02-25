import { v4 as uuid } from 'uuid';
import {
	IdentifiedCombineOppgavefilter,
	IdentifiedOppgaveQuery,
	IdentifiedOppgavefilter,
	WithNodeId,
	fjernNodeIdFraQuery,
	isIdentifiedQuery,
	tilIdentifiedQuery,
} from './filterFrontendTypes';
import { EnkelOrderFelt, EnkelSelectFelt, FeltverdiOppgavefilter, OppgaveQuery, Oppgavefilter } from './filterTsTypes';

const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export default class OppgaveQueryModel {
	private readonly oppgaveQuery: IdentifiedOppgaveQuery;

	private errors: WithNodeId<{ felt: string; message: string }>[] = [];

	constructor(oppgaveQuery?: OppgaveQuery | IdentifiedOppgaveQuery) {
		if (oppgaveQuery == null) {
			this.oppgaveQuery = tilIdentifiedQuery({
				filtere: [],
				select: [],
				order: [],
				limit: 10,
			});
			return;
		}

		const cloned = deepClone(oppgaveQuery);
		this.oppgaveQuery = isIdentifiedQuery(cloned) ? cloned : tilIdentifiedQuery(cloned);
	}

	updateLimit(limit: number) {
		this.oppgaveQuery.limit = limit;
		return this;
	}

	toOppgaveQuery(): OppgaveQuery {
		return fjernNodeIdFraQuery(this.oppgaveQuery);
	}

	toIdentifiedQuery(): IdentifiedOppgaveQuery {
		return this.oppgaveQuery;
	}

	private internalValidate(filtere: IdentifiedOppgavefilter[]) {
		filtere.forEach((f) => {
			if (f.type === 'feltverdi' && f.kode == null) {
				this.errors.push({ _nodeId: f._nodeId, felt: 'kode', message: 'Du må velge et kriterie' });
			}
			if (f.type === 'feltverdi') {
				if (f.verdi === null || f.verdi === undefined || (Array.isArray(f.verdi) && f.verdi.length === 0)) {
					this.errors.push({ _nodeId: f._nodeId, felt: 'verdi', message: 'Du må fylle ut en verdi' });
				}
			}
			if (f.type === 'combine') {
				this.internalValidate(f.filtere);
			}
		});
	}

	validate() {
		this.internalValidate(this.oppgaveQuery.filtere);
		return this;
	}

	getErrors() {
		return this.errors;
	}

	removeFilter(nodeId: string) {
		return this.internalRemoveFilter(this.oppgaveQuery, nodeId);
	}

	private internalRemoveFilter(node: IdentifiedOppgaveQuery | IdentifiedCombineOppgavefilter, nodeId: string) {
		const index = node.filtere.findIndex((f) => f._nodeId === nodeId);
		if (index >= 0) {
			node.filtere.splice(index, 1);
		} else {
			node.filtere
				.filter((f): f is IdentifiedCombineOppgavefilter => f.type === 'combine')
				.forEach((f) => this.internalRemoveFilter(f, nodeId));
		}
		return this;
	}

	getById(nodeId: string): WithNodeId<EnkelSelectFelt | EnkelOrderFelt | Oppgavefilter> | null {
		const selected = this.oppgaveQuery.select.find((f) => f._nodeId === nodeId);
		if (selected) {
			return selected;
		}

		const ordered = this.oppgaveQuery.order.find((f) => f._nodeId === nodeId);
		if (ordered) {
			return ordered;
		}

		return this.internalGetById(this.oppgaveQuery, nodeId);
	}

	private internalGetById(
		node: IdentifiedOppgaveQuery | IdentifiedCombineOppgavefilter,
		nodeId: string,
	): IdentifiedOppgavefilter | null {
		for (const f of node.filtere) {
			if (f._nodeId === nodeId) {
				return f;
			}
			if (f.type === 'combine') {
				const result = this.internalGetById(f, nodeId);
				if (result != null) {
					return result;
				}
			}
		}
		return null;
	}

	addFeltverdiFilter(nodeId: string) {
		return this.internalAddFeltverdiFilter(this.oppgaveQuery, nodeId, {});
	}

	private internalAddFeltverdiFilter(
		node: IdentifiedOppgaveQuery | IdentifiedCombineOppgavefilter,
		nodeId: string,
		data: Partial<FeltverdiOppgavefilter>,
	) {
		if (node._nodeId === nodeId) {
			node.filtere.push({
				_nodeId: uuid(),
				type: 'feltverdi',
				område: null,
				kode: null,
				operator: 'EQUALS',
				verdi: null,
				...data,
			});
		} else {
			node.filtere
				.filter((f): f is IdentifiedCombineOppgavefilter => f.type === 'combine')
				.forEach((f) => this.internalAddFeltverdiFilter(f, nodeId, data));
		}
		return this;
	}

	updateFilter(nodeId: string, data: Partial<Oppgavefilter>) {
		return this.internalUpdateFilter(this.oppgaveQuery, nodeId, data);
	}

	private internalUpdateFilter(
		node: IdentifiedOppgaveQuery | IdentifiedCombineOppgavefilter,
		nodeId: string,
		data: Partial<Oppgavefilter>,
	) {
		const index = node.filtere.findIndex((f) => f._nodeId === nodeId);
		if (index >= 0) {
			// caster fordi node.filtere[index] og data ikke nødvendigvis er av samme type
			node.filtere[index] = { ...node.filtere[index], ...data } as IdentifiedOppgavefilter;
		} else {
			node.filtere
				.filter((f): f is IdentifiedCombineOppgavefilter => f.type === 'combine')
				.forEach((f) => this.internalUpdateFilter(f, nodeId, data));
		}
		return this;
	}

	addGruppeFilter(nodeId: string) {
		return this.internalAddGruppe(this.oppgaveQuery, nodeId);
	}

	private internalAddGruppe(node: IdentifiedOppgaveQuery | IdentifiedCombineOppgavefilter, nodeId: string) {
		if (node._nodeId === nodeId) {
			const parentOperator = 'combineOperator' in node ? node.combineOperator : undefined;
			node.filtere.push({
				_nodeId: uuid(),
				type: 'combine',
				combineOperator: !parentOperator || parentOperator === 'AND' ? 'OR' : 'AND',
				filtere: [],
			});
		} else {
			node.filtere
				.filter((f): f is IdentifiedCombineOppgavefilter => f.type === 'combine')
				.forEach((f) => this.internalAddGruppe(f, nodeId));
		}
		return this;
	}

	addEnkelSelectFelt() {
		this.oppgaveQuery.select.push({
			_nodeId: uuid(),
			type: 'enkel',
			område: null,
			kode: null,
		});
		return this;
	}

	removeSelectFelt(id: string) {
		const index = this.oppgaveQuery.select.findIndex((f) => f._nodeId === id);
		if (index >= 0) {
			this.oppgaveQuery.select.splice(index, 1);
		}
		return this;
	}

	updateEnkelSelectFelt(nodeId: string, data: Partial<EnkelSelectFelt>) {
		const index = this.oppgaveQuery.select.findIndex((f) => f._nodeId === nodeId);
		if (index >= 0) {
			this.oppgaveQuery.select[index] = { ...this.oppgaveQuery.select[index], ...data };
		}
		return this;
	}

	moveSelectFelt(fromIndex: number, toIndex: number) {
		const [moved] = this.oppgaveQuery.select.splice(fromIndex, 1);
		this.oppgaveQuery.select.splice(toIndex, 0, moved);
		return this;
	}

	addEnkelOrderFelt(data: EnkelOrderFelt | null) {
		const newOrder: EnkelOrderFelt =
			data == null
				? {
						type: 'enkel',
						område: null,
						kode: null,
						økende: true,
					}
				: data;

		this.oppgaveQuery.order.push({ _nodeId: uuid(), ...newOrder });
		return this;
	}

	removeOrderFelt(nodeId: string) {
		const index = this.oppgaveQuery.order.findIndex((f) => f._nodeId === nodeId);
		if (index >= 0) {
			this.oppgaveQuery.order.splice(index, 1);
		}
		return this;
	}

	nullstillOrderFelt() {
		this.oppgaveQuery.order = [];
		return this;
	}

	updateEnkelOrderFelt(nodeId: string, data: Partial<EnkelOrderFelt>) {
		const index = this.oppgaveQuery.order.findIndex((f) => f._nodeId === nodeId);
		if (index >= 0) {
			this.oppgaveQuery.order[index] = { ...this.oppgaveQuery.order[index], ...data };
		}
		return this;
	}

	moveOrderFelt(fromIndex: number, toIndex: number) {
		const [moved] = this.oppgaveQuery.order.splice(fromIndex, 1);
		this.oppgaveQuery.order.splice(toIndex, 0, moved);
		return this;
	}
}

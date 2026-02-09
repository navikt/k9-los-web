import { v4 as uuid } from 'uuid';
import {
	CombineOppgavefilter,
	FeltverdiOppgavefilter,
	FilterContainer,
	FilterType,
	OppgaveQuery,
} from './filterTsTypes';

export default class OppgaveQueryModel {
	private oppgaveQuery: OppgaveQuery;

	private errors: { id: string; felt: string; message: string }[] = [];

	constructor(oppgaveQuery?: OppgaveQuery) {
		let newOppgaveQuery = oppgaveQuery;
		if (newOppgaveQuery == null) {
			newOppgaveQuery = {
				filtere: [],
				select: [],
				order: [],
				limit: 10,
				id: '',
			};
		}

		newOppgaveQuery = JSON.parse(JSON.stringify(newOppgaveQuery));

		if (!newOppgaveQuery.id) {
			this.oppgaveQuery = OppgaveQueryModel.updateIdentities(newOppgaveQuery);
		} else {
			this.oppgaveQuery = newOppgaveQuery;
		}
	}

	updateLimit(limit: number) {
		this.oppgaveQuery.limit = limit;
		return this;
	}

	private static updateIdentities(oppgaveQuery: OppgaveQuery): OppgaveQuery;

	private static updateIdentities(oppgaveQuery: CombineOppgavefilter): CombineOppgavefilter;

	private static updateIdentities(oppgaveQuery: FilterContainer): FilterContainer;

	private static updateIdentities(oppgaveQuery: OppgaveQuery | CombineOppgavefilter | FilterContainer) {
		const updatedQuery = { ...oppgaveQuery, id: uuid() };
		if ('filtere' in updatedQuery) {
			updatedQuery.filtere = updatedQuery.filtere.map((f) => {
				const updatedFilter = { ...f, id: uuid() } as FilterType;
				if (updatedFilter.filtere) {
					updatedFilter.filtere = updatedFilter.filtere.map(OppgaveQueryModel.updateIdentities);
				}
				return updatedFilter;
			});
		}
		if ('select' in updatedQuery) {
			updatedQuery.select = updatedQuery.select.map((f) => ({ ...f, id: uuid() }));
		}
		if ('order' in updatedQuery) {
			updatedQuery.order = updatedQuery.order.map((f) => ({ ...f, id: uuid() }));
		}
		return updatedQuery;
	}

	toOppgaveQuery(): OppgaveQuery {
		return this.oppgaveQuery;
	}

	private internalValidate(filtere: FilterType[]) {
		filtere.forEach((f) => {
			if ('kode' in f && f.kode == null) {
				this.errors.push({ id: f.id, felt: 'kode', message: 'Du må velge et kriterie' });
			}
			if ('kode' in f) {
				if (
					f.verdi === null ||
					f.verdi === undefined ||
					f.verdi === '' ||
					(Array.isArray(f.verdi) && f.verdi.length === 0)
				) {
					this.errors.push({ id: f.id, felt: 'verdi', message: 'Du må fylle ut en verdi' });
				}
			}
			if ('combineOperator' in f) {
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

	removeFilter(id) {
		return this.internalRemoveFilter(this.oppgaveQuery, id);
	}

	private internalRemoveFilter(oppgaveQuery, id) {
		const index = oppgaveQuery.filtere.findIndex((f) => f.id === id);
		if (index >= 0) {
			oppgaveQuery.filtere.splice(index, 1);
		} else {
			oppgaveQuery.filtere.filter((f) => f.filtere).forEach((f) => this.internalRemoveFilter(f, id));
		}
		return this;
	}

	getById(id: string) {
		const selected = this.oppgaveQuery.select.find((f) => f.id === id);
		if (selected) {
			return selected;
		}

		const ordered = this.oppgaveQuery.order.find((f) => f.id === id);
		if (ordered) {
			return ordered;
		}

		return this.internalGetById(this.oppgaveQuery, id);
	}

	private internalGetById(oppgaveQuery: OppgaveQuery, id: string): OppgaveQuery | null {
		if (oppgaveQuery.id === id) {
			return oppgaveQuery;
		}
		if (oppgaveQuery.filtere == null) {
			return null;
		}

		for (const f of oppgaveQuery.filtere) {
			if (f.id === id) {
				return f;
			}
			const result = this.internalGetById(f, id);
			if (result != null) {
				return result;
			}
		}

		return null;
	}

	addFilter(id, data?: any) {
		return this.internalAddFilter(this.oppgaveQuery, id, data);
	}

	private internalAddFilter(oppgaveQuery, id, data = {}) {
		if (oppgaveQuery.id === id) {
			oppgaveQuery.filtere.push({
				id: uuid(),
				type: 'feltverdi',
				område: null,
				kode: null,
				operator: 'EQUALS',
				verdi: null,
				...data,
			});
		} else {
			oppgaveQuery.filtere.filter((f) => f.filtere).forEach((f) => this.internalAddFilter(f, id));
		}
		return this;
	}

	updateFilter(id, data) {
		return this.internalUpdateFilter(this.oppgaveQuery, id, data);
	}

	private internalUpdateFilter(
		oppgaveQuery: OppgaveQuery | CombineOppgavefilter | FeltverdiOppgavefilter,
		id: string,
		data: FeltverdiOppgavefilter | CombineOppgavefilter,
	) {
		const newOppgaveQuery = { ...oppgaveQuery };
		const index = newOppgaveQuery.filtere.findIndex((f) => f.id === id);
		if (index >= 0) {
			newOppgaveQuery.filtere[index] = data;
		} else {
			newOppgaveQuery.filtere.filter((f) => f.filtere).forEach((f) => this.internalUpdateFilter(f, id, data));
		}
		return this;
	}

	addGruppe(id) {
		return this.internalAddGruppe(this.oppgaveQuery, id);
	}

	private internalAddGruppe(oppgaveQuery, id) {
		if (oppgaveQuery.id === id) {
			oppgaveQuery.filtere.push({
				id: uuid(),
				type: 'combine',
				combineOperator: !oppgaveQuery.combineOperator || oppgaveQuery.combineOperator === 'AND' ? 'OR' : 'AND',
				filtere: [],
			});
		} else {
			oppgaveQuery.filtere.filter((f) => f.filtere != null).forEach((f) => this.internalAddGruppe(f, id));
		}
		return this;
	}

	addEnkelSelectFelt() {
		this.oppgaveQuery.select.push({
			id: uuid(),
			type: 'enkel',
			område: null,
			kode: null,
		});
		return this;
	}

	removeSelectFelt(id) {
		const index = this.oppgaveQuery.select.findIndex((f) => f.id === id);
		if (index >= 0) {
			this.oppgaveQuery.select.splice(index, 1);
		}
		return this;
	}

	updateEnkelSelectFelt(id, data) {
		const index = this.oppgaveQuery.select.findIndex((f) => f.id === id);
		if (index >= 0) {
			this.oppgaveQuery.select[index] = data;
		}
		return this;
	}

	moveSelectFelt(fromIndex: number, toIndex: number) {
		const [moved] = this.oppgaveQuery.select.splice(fromIndex, 1);
		this.oppgaveQuery.select.splice(toIndex, 0, moved);
		return this;
	}

	addEnkelOrderFelt(data = {}) {
		this.oppgaveQuery.order.push({
			id: uuid(),
			type: 'enkel',
			område: null,
			kode: null,
			økende: true,
			...data,
		});
		return this;
	}

	removeOrderFelt(id) {
		const index = this.oppgaveQuery.order.findIndex((f) => f.id === id);
		if (index >= 0) {
			this.oppgaveQuery.order.splice(index, 1);
		}
		return this;
	}

	nullstillOrderFelt() {
		this.oppgaveQuery.order = [];
		return this;
	}

	updateEnkelOrderFelt(id, data) {
		const index = this.oppgaveQuery.order.findIndex((f) => f.id === id);
		if (index >= 0) {
			this.oppgaveQuery.order[index] = data;
		}
		return this;
	}
}

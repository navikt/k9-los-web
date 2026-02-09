import OppgaveQueryModel from './OppgaveQueryModel';
import { OppgaveQuery } from './filterTsTypes';
import { kodeFraKey, områdeFraKey } from './utils';

// -------------------- Filter Manipulations --------------------

const removeFilter =
	(id: string) =>
	(model: OppgaveQuery): OppgaveQuery => {
		const newModel = new OppgaveQueryModel(model);
		return newModel.removeFilter(id).toOppgaveQuery();
	};

const addFilter =
	(id: string) =>
	(model: OppgaveQuery): OppgaveQuery => {
		const newModel = new OppgaveQueryModel(model);
		return newModel.addFilter(id).toOppgaveQuery();
	};

const updateFilter =
	(id: string, newData) =>
	(model: OppgaveQuery): OppgaveQuery => {
		const oppgaveQueryModel = new OppgaveQueryModel(model);
		const filterToUpdate = oppgaveQueryModel.getById(id);
		const updatedData = { ...filterToUpdate, ...newData };
		const newModel = new OppgaveQueryModel(model);
		return newModel.updateFilter(id, updatedData).toOppgaveQuery();
	};

// -------------------- Group Manipulations --------------------

const addGruppe =
	(id: string) =>
	(model: OppgaveQuery): OppgaveQuery => {
		const newModel = new OppgaveQueryModel(model);
		return newModel.addGruppe(id).toOppgaveQuery();
	};

// -------------------- Select Felt Manipulations --------------------

const removeSelectFelt =
	(id: string) =>
	(model: OppgaveQuery): OppgaveQuery => {
		const newModel = new OppgaveQueryModel(model);
		return newModel.removeSelectFelt(id).toOppgaveQuery();
	};

const addSelectFelt =
	() =>
	(model: OppgaveQuery): OppgaveQuery => {
		const newModel = new OppgaveQueryModel(model);
		return newModel.addEnkelSelectFelt().toOppgaveQuery();
	};

const updateSelectFelt =
	(id: string, verdi) =>
	(model: OppgaveQuery): OppgaveQuery => {
		const oppgaveQueryModel = new OppgaveQueryModel(model);
		const selectToUpdate = oppgaveQueryModel.getById(id);
		const data = {
			...selectToUpdate,
			område: områdeFraKey(verdi),
			kode: kodeFraKey(verdi),
		};
		const newModel = new OppgaveQueryModel(model).updateEnkelSelectFelt(id, data);
		return newModel.toOppgaveQuery();
	};

const moveSelectFelt =
	(fromIndex: number, toIndex: number) =>
	(model: OppgaveQuery): OppgaveQuery => {
		const newModel = new OppgaveQueryModel(model);
		return newModel.moveSelectFelt(fromIndex, toIndex).toOppgaveQuery();
	};

// -------------------- Order Manipulations --------------------

const removeSortering =
	(id) =>
	(model: OppgaveQuery): OppgaveQuery => {
		const newModel = new OppgaveQueryModel(model);
		return newModel.removeOrderFelt(id).toOppgaveQuery();
	};

const resetSortering =
	() =>
	(model: OppgaveQuery): OppgaveQuery => {
		const newModel = new OppgaveQueryModel({ ...model, order: [] });
		return newModel.toOppgaveQuery();
	};

const addSortering =
	(data?: any) =>
	(model: OppgaveQuery): OppgaveQuery => {
		const newModel = new OppgaveQueryModel(model);
		return newModel.addEnkelOrderFelt(data).toOppgaveQuery();
	};

const updateSortering =
	(id, newData) =>
	(model: OppgaveQuery): OppgaveQuery => {
		const newOppgaveQueryModel = new OppgaveQueryModel(model);
		const orderToUpdate = newOppgaveQueryModel.getById(id);
		const updatedData = { ...orderToUpdate, ...newData };
		const newModel = new OppgaveQueryModel(model);
		return newModel.updateEnkelOrderFelt(id, updatedData).toOppgaveQuery();
	};

// -------------------- Helpers --------------------

export type QueryFunction = (query: OppgaveQuery) => OppgaveQuery;
const applyFunctions = (initialValue: OppgaveQuery, fns: Array<QueryFunction>) =>
	fns.reduce((acc, fn) => fn(acc), initialValue);

// -------------------- Export --------------------

export {
	removeFilter,
	addGruppe,
	addFilter,
	removeSelectFelt,
	addSelectFelt,
	updateFilter,
	updateSelectFelt,
	moveSelectFelt,
	removeSortering,
	resetSortering,
	addSortering,
	updateSortering,
	applyFunctions,
};

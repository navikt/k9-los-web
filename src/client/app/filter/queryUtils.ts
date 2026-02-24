import OppgaveQueryModel from './OppgaveQueryModel';
import { IdentifiedOppgaveQuery } from './filterFrontendTypes';
import { kodeFraKey, områdeFraKey } from './utils';

// -------------------- Filter Manipulations --------------------

const removeFilter =
	(nodeId: string) =>
	(model: IdentifiedOppgaveQuery): IdentifiedOppgaveQuery => {
		const newModel = new OppgaveQueryModel(model);
		return newModel.removeFilter(nodeId).toIdentifiedQuery();
	};

const addFilter =
	(nodeId: string) =>
	(model: IdentifiedOppgaveQuery): IdentifiedOppgaveQuery => {
		const newModel = new OppgaveQueryModel(model);
		return newModel.addFilter(nodeId).toIdentifiedQuery();
	};

const updateFilter =
	(nodeId: string, newData) =>
	(model: IdentifiedOppgaveQuery): IdentifiedOppgaveQuery => {
		const oppgaveQueryModel = new OppgaveQueryModel(model);
		const filterToUpdate = oppgaveQueryModel.getById(nodeId);
		const updatedData = { ...filterToUpdate, ...newData };
		const newModel = new OppgaveQueryModel(model);
		return newModel.updateFilter(nodeId, updatedData).toIdentifiedQuery();
	};

// -------------------- Group Manipulations --------------------

const addGruppe =
	(nodeId: string) =>
	(model: IdentifiedOppgaveQuery): IdentifiedOppgaveQuery => {
		const newModel = new OppgaveQueryModel(model);
		return newModel.addGruppe(nodeId).toIdentifiedQuery();
	};

// -------------------- Select Felt Manipulations --------------------

const removeSelectFelt =
	(id: string) =>
	(model: IdentifiedOppgaveQuery): IdentifiedOppgaveQuery => {
		const newModel = new OppgaveQueryModel(model);
		return newModel.removeSelectFelt(id).toIdentifiedQuery();
	};

const addSelectFelt =
	() =>
	(model: IdentifiedOppgaveQuery): IdentifiedOppgaveQuery => {
		const newModel = new OppgaveQueryModel(model);
		return newModel.addEnkelSelectFelt().toIdentifiedQuery();
	};

const updateSelectFelt =
	(id: string, verdi) =>
	(model: IdentifiedOppgaveQuery): IdentifiedOppgaveQuery => {
		const oppgaveQueryModel = new OppgaveQueryModel(model);
		const selectToUpdate = oppgaveQueryModel.getById(id);
		const data = {
			...selectToUpdate,
			område: områdeFraKey(verdi),
			kode: kodeFraKey(verdi),
		};
		const newModel = new OppgaveQueryModel(model).updateEnkelSelectFelt(id, data);
		return newModel.toIdentifiedQuery();
	};

const moveSelectFelt =
	(fromIndex: number, toIndex: number) =>
	(model: IdentifiedOppgaveQuery): IdentifiedOppgaveQuery => {
		const newModel = new OppgaveQueryModel(model);
		return newModel.moveSelectFelt(fromIndex, toIndex).toIdentifiedQuery();
	};

// -------------------- Order Manipulations --------------------

const removeSortering =
	(id) =>
	(model: IdentifiedOppgaveQuery): IdentifiedOppgaveQuery => {
		const newModel = new OppgaveQueryModel(model);
		return newModel.removeOrderFelt(id).toIdentifiedQuery();
	};

const resetSortering =
	() =>
	(model: IdentifiedOppgaveQuery): IdentifiedOppgaveQuery => {
		const newModel = new OppgaveQueryModel({ ...model, order: [] });
		return newModel.toIdentifiedQuery();
	};

const addSortering =
	(data?: any) =>
	(model: IdentifiedOppgaveQuery): IdentifiedOppgaveQuery => {
		const newModel = new OppgaveQueryModel(model);
		return newModel.addEnkelOrderFelt(data).toIdentifiedQuery();
	};

const updateSortering =
	(id, newData) =>
	(model: IdentifiedOppgaveQuery): IdentifiedOppgaveQuery => {
		const newOppgaveQueryModel = new OppgaveQueryModel(model);
		const orderToUpdate = newOppgaveQueryModel.getById(id);
		const updatedData = { ...orderToUpdate, ...newData };
		const newModel = new OppgaveQueryModel(model);
		return newModel.updateEnkelOrderFelt(id, updatedData).toIdentifiedQuery();
	};

const moveSortering =
	(fromIndex: number, toIndex: number) =>
	(model: IdentifiedOppgaveQuery): IdentifiedOppgaveQuery => {
		const newModel = new OppgaveQueryModel(model);
		return newModel.moveOrderFelt(fromIndex, toIndex).toIdentifiedQuery();
	};

// -------------------- Helpers --------------------

export type QueryFunction = (query: IdentifiedOppgaveQuery) => IdentifiedOppgaveQuery;
const applyFunctions = (initialValue: IdentifiedOppgaveQuery, fns: Array<QueryFunction>) =>
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
	moveSortering,
	applyFunctions,
};

import OppgaveQueryModel from './OppgaveQueryModel';
import { IdentifiedOppgaveQuery } from './filterFrontendTypes';

type ModelMethods = {
	[K in keyof OppgaveQueryModel]: OppgaveQueryModel[K] extends (...args: any[]) => OppgaveQueryModel ? K : never;
}[keyof OppgaveQueryModel];

const withMethod =
	<M extends ModelMethods>(method: M) =>
	(...args: Parameters<OppgaveQueryModel[M]>) =>
	(model: IdentifiedOppgaveQuery): IdentifiedOppgaveQuery => {
		// @ts-expect-error "TS2556: A spread argument must either have a tuple type or be passed to a rest parameter." Løses kanskje i nyere versjoner av TypeScript?
		return new OppgaveQueryModel(model)[method](...args).toIdentifiedQuery();
	};

// -------------------- Filter Manipulations --------------------

const addFeltverdiFilter = withMethod('addFeltverdiFilter');

const addGruppeFilter = withMethod('addGruppeFilter');

const updateFilter = withMethod('updateFilter');

const removeFilter = withMethod('removeFilter');

// -------------------- Select Felt Manipulations --------------------

const removeSelectFelt = withMethod('removeSelectFelt');

const addEnkelSelectFelt = withMethod('addEnkelSelectFelt');

const updateSelectFelt = withMethod('updateEnkelSelectFelt');

const moveSelectFelt = withMethod('moveSelectFelt');

// -------------------- Order Manipulations --------------------

const removeSortering = withMethod('removeOrderFelt');

const resetSortering = withMethod('nullstillOrderFelt');

const addSortering = withMethod('addEnkelOrderFelt');

const updateSortering = withMethod('updateEnkelOrderFelt');

const moveSortering = withMethod('moveOrderFelt');

// -------------------- Helpers --------------------

export type QueryFunction = (query: IdentifiedOppgaveQuery) => IdentifiedOppgaveQuery;
const applyFunctions = (initialValue: IdentifiedOppgaveQuery, fns: Array<QueryFunction>) =>
	fns.reduce((acc, fn) => fn(acc), initialValue);

// -------------------- Export --------------------

export {
	removeFilter,
	addGruppeFilter,
	addFeltverdiFilter,
	removeSelectFelt,
	addEnkelSelectFelt,
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

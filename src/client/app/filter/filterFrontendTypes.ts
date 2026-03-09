import { v4 as uuid } from 'uuid';
import { CombineOppgavefilter, FeltverdiOppgavefilter, OppgaveQuery, Oppgavefilter } from './filterTsTypes';

export type WithNodeId<T> = T & { _nodeId: string };

export type WithNodeIdRecursive<T extends object> = T extends any
	? WithNodeId<{
			[K in keyof T]: T[K] extends (infer U)[] ? ([U] extends [object] ? WithNodeIdRecursive<U>[] : T[K]) : T[K];
		}>
	: never;

export type IdentifiedFeltverdiOppgavefilter = WithNodeId<FeltverdiOppgavefilter>;

export type IdentifiedCombineOppgavefilter = WithNodeIdRecursive<CombineOppgavefilter>;

export type IdentifiedOppgavefilter = IdentifiedFeltverdiOppgavefilter | IdentifiedCombineOppgavefilter;

export type IdentifiedOppgaveQuery = WithNodeIdRecursive<OppgaveQuery>;

export function tilIdentifiedFilter(filter: Oppgavefilter): IdentifiedOppgavefilter {
	if (filter.type === 'combine') {
		return {
			...tilIdentified(filter),
			filtere: filter.filtere.map(tilIdentifiedFilter),
		};
	}
	return tilIdentified(filter);
}

export function tilIdentified<T>(uident: T): WithNodeId<T> {
	return { ...uident, _nodeId: uuid() };
}

export function tilIdentifiedQuery(query: OppgaveQuery): IdentifiedOppgaveQuery {
	return {
		...query,
		_nodeId: uuid(),
		filtere: query.filtere.map(tilIdentifiedFilter),
		select: query.select.map(tilIdentified),
		order: query.order.map(tilIdentified),
	};
}

export function fjernNodeIdFraFilter(filter: IdentifiedOppgavefilter): Oppgavefilter {
	if (filter.type === 'combine') {
		return { ...fjernNodeId(filter), filtere: filter.filtere.map(fjernNodeIdFraFilter) };
	}
	return fjernNodeId(filter);
}

export function fjernNodeIdFraQuery(query: IdentifiedOppgaveQuery): OppgaveQuery {
	const { _nodeId, ...rest } = query;
	return {
		...rest,
		filtere: query.filtere.map(fjernNodeIdFraFilter),
		select: query.select.map(fjernNodeId),
		order: query.order.map(fjernNodeId),
	};
}

export function fjernNodeId<T extends object>(obj: WithNodeId<T>): Omit<T, '_nodeId'> {
	const { _nodeId, ...rest } = obj;
	return rest;
}

export function isIdentifiedQuery(query: OppgaveQuery | IdentifiedOppgaveQuery): query is IdentifiedOppgaveQuery {
	return '_nodeId' in query;
}

import { v4 as uuid } from 'uuid';
import {
	CombineOppgavefilter,
	EnkelOrderFelt,
	EnkelSelectFelt,
	FeltverdiOppgavefilter,
	OppgaveQuery,
	Oppgavefilter,
} from './filterTsTypes';

export type WithNodeIdField<T, X extends keyof T> = T & { _nodeId: string };

export type WithNodeId<T> = T & { _nodeId: string };

export type WithNodeIdRecursive<T extends object> = WithNodeId<{
	[K in keyof T]: T[K] extends (infer U)[] ? ([U] extends [object] ? WithNodeIdRecursive<U>[] : T[K]) : T[K];
}>;

export type IdentifiedFeltverdiOppgavefilter = WithNodeId<FeltverdiOppgavefilter>;

export type IdentifiedCombineOppgavefilter = WithNodeId<Omit<CombineOppgavefilter, 'filtere'>> & {
	filtere: IdentifiedOppgavefilter[];
};

export type IdentifiedOppgavefilter = IdentifiedFeltverdiOppgavefilter | IdentifiedCombineOppgavefilter;

export type IdentifiedOppgaveQuery = {
	_nodeId: string;
	filtere: IdentifiedOppgavefilter[];
	select: WithNodeId<EnkelSelectFelt>[];
	order: WithNodeId<EnkelOrderFelt>[];
	limit: number;
};

// export type IdentifiedOppgaveQuery = WithNodeIdRecursive<OppgaveQuery>;

export function tilIdentifiedFilter(filter: Oppgavefilter): IdentifiedOppgavefilter {
	if (filter.type === 'combine') {
		return {
			...filter,
			_nodeId: uuid(),
			filtere: filter.filtere.map(tilIdentifiedFilter),
		};
	}
	return { ...filter, _nodeId: uuid() };
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

export function tilApiFilter(filter: IdentifiedOppgavefilter): Oppgavefilter {
	if (filter.type === 'combine') {
		const { _nodeId, ...rest } = filter;
		return { ...rest, filtere: filter.filtere.map(tilApiFilter) };
	}
	const { _nodeId, ...rest } = filter;
	return rest;
}

export function tilApiQuery(query: IdentifiedOppgaveQuery): OppgaveQuery {
	const { _nodeId, ...rest } = query;
	return {
		...rest,
		filtere: query.filtere.map(tilApiFilter),
		select: query.select.map(fjernNodeId),
		order: query.order.map(fjernNodeId),
	};
}

function fjernNodeId<T extends object>(obj: WithNodeId<T>): Omit<T, '_nodeId'> {
	const { _nodeId, ...rest } = obj;
	return rest;
}

export function isIdentifiedQuery(query: OppgaveQuery | IdentifiedOppgaveQuery): query is IdentifiedOppgaveQuery {
	return '_nodeId' in query;
}

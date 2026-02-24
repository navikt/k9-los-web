import { v4 as uuid } from 'uuid';
import { CombineOppgavefilter, FeltverdiOppgavefilter, OppgaveQuery, Oppgavefilter } from './filterTsTypes';

export type WithNodeId<T> = T & { _nodeId: string };

export type IdentifiedFeltverdiOppgavefilter = WithNodeId<FeltverdiOppgavefilter>;

export type IdentifiedCombineOppgavefilter = WithNodeId<Omit<CombineOppgavefilter, 'filtere'>> & {
	filtere: IdentifiedOppgavefilter[];
};

export type IdentifiedOppgavefilter = IdentifiedFeltverdiOppgavefilter | IdentifiedCombineOppgavefilter;

export type IdentifiedOppgaveQuery = WithNodeId<Omit<OppgaveQuery, 'filtere'>> & {
	filtere: IdentifiedOppgavefilter[];
};

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

export function tilIdentifiedQuery(query: OppgaveQuery): IdentifiedOppgaveQuery {
	return {
		...query,
		_nodeId: uuid(),
		filtere: query.filtere.map(tilIdentifiedFilter),
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
	};
}

export function isIdentifiedQuery(query: OppgaveQuery | IdentifiedOppgaveQuery): query is IdentifiedOppgaveQuery {
	return '_nodeId' in query;
}

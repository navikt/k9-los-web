import React from 'react';
import { IdentifiedOppgaveQuery, WithNodeId } from './filterFrontendTypes';
import { QueryFunction } from './queryUtils';

export type FilterContextType = {
	oppgaveQuery: IdentifiedOppgaveQuery;
	updateQuery: (operations: Array<QueryFunction>) => void;
	errors: WithNodeId<{ felt: string; message: string }>[];
	readOnly?: boolean;
};

export const FilterContext = React.createContext<FilterContextType>(null);

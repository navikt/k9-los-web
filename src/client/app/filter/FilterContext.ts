import React from 'react';
import { IdentifiedOppgaveQuery } from './filterFrontendTypes';
import { QueryFunction } from './queryUtils';

export type FilterContextType = {
	oppgaveQuery: IdentifiedOppgaveQuery;
	updateQuery: (operations: Array<QueryFunction>) => void;
	errors: { _nodeId: string; felt: string; message: string }[];
	readOnly?: boolean;
};

export const FilterContext = React.createContext<FilterContextType>(null);

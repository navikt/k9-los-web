import React from 'react';
import { OppgaveQuery } from './filterTsTypes';
import { QueryFunction } from './queryUtils';

export type FilterContextType = {
	oppgaveQuery: OppgaveQuery;
	updateQuery: (operations: Array<QueryFunction>) => void;
	errors: { id: string; felt: string; message: string }[];
	readOnly?: boolean;
};

export const FilterContext = React.createContext<FilterContextType>(null);

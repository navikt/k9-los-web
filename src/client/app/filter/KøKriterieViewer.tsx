import { Heading } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import React, { useMemo } from 'react';
import { FilterContext, type FilterContextType } from './FilterContext';
import type { OppgaveQuery } from './filterTsTypes';
import OppgaveQueryModel from './OppgaveQueryModel';
import OppgavefilterPanel from './parts/OppgavefilterPanel';

interface OwnProps {
	query: OppgaveQuery;
	tittel: string;
}

const KøKriterieViewer = ({ query, tittel }: OwnProps) => {
	const oppgaveQuery = useMemo(() => new OppgaveQueryModel(query).toIdentifiedQuery(), [query]);

	const { felter } = React.useContext(AppContext);

	const filterContextValues = useMemo<FilterContextType>(
		() => ({
			oppgaveQuery,
			updateQuery: () => {},
			errors: [],
			readOnly: true,
		}),
		[oppgaveQuery],
	);

	if (felter.length === 0) {
		return null;
	}

	return (
		<FilterContext.Provider value={filterContextValues}>
			<div className="mt-0 p-4 rounded-lg flex flex-col flex-grow">
				<Heading size="small" spacing className="mt-0">
					{tittel}
				</Heading>
				<div className="flex flex-col gap-4">
					{oppgaveQuery.filtere.map((item) => (
						<OppgavefilterPanel key={item._nodeId} køvisning oppgavefilter={item} />
					))}
				</div>
			</div>
		</FilterContext.Provider>
	);
};

export default KøKriterieViewer;

import React, { useMemo } from 'react';
import { Heading } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterContext } from './FilterContext';
import OppgaveQueryModel from './OppgaveQueryModel';
import { OppgaveQuery, OppgavefilterKode } from './filterTsTypes';
import OppgavefilterPanel from './parts/OppgavefilterPanel';
import { addGruppe } from './queryUtils';

interface OwnProps {
	query: OppgaveQuery;
	tittel: string;
	paakrevdeKoder?: OppgavefilterKode[];
}

const KøKriterieViewer = ({ query, tittel, paakrevdeKoder }: OwnProps) => {
	const oppgaveQuery = useMemo(() => new OppgaveQueryModel(query).toOppgaveQuery(), [query]);

	const { felter } = React.useContext(AppContext);

	const filterContextValues = useMemo(
		() => ({
			oppgaveQuery,
			updateQuery: () => {
				// No-op in read-only mode
			},
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
			<div className="mt-3 p-4 rounded-lg flex flex-col flex-grow">
				<Heading size="small" spacing className="mt-3">
					{tittel}
				</Heading>
				<div className="flex flex-col gap-4">
					{oppgaveQuery.filtere.map((item) => (
						<OppgavefilterPanel
							key={item.id}
							køvisning
							oppgavefilter={item}
							addGruppeOperation={addGruppe(oppgaveQuery.id)}
							paakrevdeKoder={paakrevdeKoder}
						/>
					))}
				</div>
			</div>
		</FilterContext.Provider>
	);
};

export default KøKriterieViewer;

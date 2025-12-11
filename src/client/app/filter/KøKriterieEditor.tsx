import React, { useContext } from 'react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';
import { FilterContext } from 'filter/FilterContext';
import KøKriterieEditorProvider from 'filter/KøKriterieEditorProvider';
import { OppgaveQuery, OppgavefilterKode } from './filterTsTypes';
import OppgavefilterPanel from './parts/OppgavefilterPanel';
import { addFilter, addGruppe } from './queryUtils';

export const KøKriterieEditorContent = ({
	paakrevdeKoder,
	readOnlyKoder,
}: {
	paakrevdeKoder?: OppgavefilterKode[];
	readOnlyKoder?: OppgavefilterKode[];
}) => {
	const { oppgaveQuery, updateQuery } = useContext(FilterContext);

	return (
		<div className="flex flex-col flex-grow">
			<div className="flex flex-col gap-4">
				{oppgaveQuery.filtere.map((item) => (
					<OppgavefilterPanel
						key={item.id}
						køvisning
						oppgavefilter={item}
						addGruppeOperation={addGruppe(oppgaveQuery.id)}
						paakrevdeKoder={paakrevdeKoder}
						readOnlyKoder={readOnlyKoder}
					/>
				))}
			</div>
			<div>
				<Button
					className="mt-4 mb-13"
					icon={<PlusCircleIcon aria-hidden />}
					variant="tertiary"
					size="small"
					onClick={() => updateQuery([addFilter(oppgaveQuery.id)])}
				>
					Legg til nytt kriterie
				</Button>
			</div>
		</div>
	);
};

interface OwnProps {
	lagre: (oppgaveQuery: OppgaveQuery) => void;
	avbryt: () => void;
	initialQuery?: OppgaveQuery;
	tittel: string;
	paakrevdeKoder?: OppgavefilterKode[];
	readOnlyKoder?: OppgavefilterKode[];
	visSortering?: boolean;
}

const KøKriterieEditor = ({
	initialQuery,
	lagre,
	avbryt,
	tittel,
	paakrevdeKoder,
	readOnlyKoder,
	visSortering,
}: OwnProps) => {
	return (
		<KøKriterieEditorProvider avbryt={avbryt} lagre={lagre} initialQuery={initialQuery} visSortering={visSortering}>
			<Heading size="small" spacing className="mt-3">
				{tittel}
			</Heading>
			<KøKriterieEditorContent paakrevdeKoder={paakrevdeKoder} readOnlyKoder={readOnlyKoder} />
		</KøKriterieEditorProvider>
	);
};

export default KøKriterieEditor;

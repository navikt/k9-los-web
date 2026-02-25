import React, { useContext } from 'react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';
import { FilterContext } from 'filter/FilterContext';
import KøKriterieEditorProvider from 'filter/KøKriterieEditorProvider';
import { OppgaveQuery, OppgavefilterKode } from './filterTsTypes';
import OppgavefilterPanel from './parts/OppgavefilterPanel';
import { addFeltverdiFilter, addGruppeFilter } from './queryUtils';

export const KøKriterieEditorContent = ({
	paakrevdeKoder,
	readOnlyKoder,
}: {
	paakrevdeKoder?: string[];
	readOnlyKoder?: string[];
}) => {
	const { oppgaveQuery, updateQuery } = useContext(FilterContext);

	return (
		<div className="flex flex-col flex-grow">
			<div className="flex flex-col gap-4">
				{oppgaveQuery.filtere.map((item) => (
					<OppgavefilterPanel
						key={item._nodeId}
						køvisning
						oppgavefilter={item}
						addGruppeOperation={addGruppeFilter(oppgaveQuery._nodeId)}
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
					onClick={() => updateQuery([addFeltverdiFilter(oppgaveQuery._nodeId)])}
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
	paakrevdeKoder?: string[];
	readOnlyKoder?: string[];
	visSortering?: boolean;
	hovedknappTekst: string;
}

const KøKriterieEditor = ({
	initialQuery,
	lagre,
	avbryt,
	tittel,
	paakrevdeKoder,
	readOnlyKoder,
	visSortering,
	hovedknappTekst,
}: OwnProps) => {
	return (
		<KøKriterieEditorProvider
			avbryt={avbryt}
			lagre={lagre}
			initialQuery={initialQuery}
			visSortering={visSortering}
			hovedknappTekst={hovedknappTekst}
		>
			<Heading size="small" spacing className="mt-3">
				{tittel}
			</Heading>
			<KøKriterieEditorContent paakrevdeKoder={paakrevdeKoder} readOnlyKoder={readOnlyKoder} />
		</KøKriterieEditorProvider>
	);
};

export default KøKriterieEditor;

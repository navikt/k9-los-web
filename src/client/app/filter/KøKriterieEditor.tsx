import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';
import { FilterContext } from 'filter/FilterContext';
import type { Feltreferanse } from 'filter/feltIdentitet';
import KøKriterieEditorProvider from 'filter/KøKriterieEditorProvider';
import { useContext } from 'react';
import type { OppgaveQuery } from './filterTsTypes';
import OppgavefilterPanel from './parts/OppgavefilterPanel';
import { addFeltverdiFilter, addGruppeFilter } from './queryUtils';

export const KøKriterieEditorContent = ({
	paakrevdeFelter,
	readOnlyFelter,
}: {
	paakrevdeFelter?: Feltreferanse[];
	readOnlyFelter?: Feltreferanse[];
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
						paakrevdeFelter={paakrevdeFelter}
						readOnlyFelter={readOnlyFelter}
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
	paakrevdeFelter?: Feltreferanse[];
	readOnlyFelter?: Feltreferanse[];
	visSortering?: boolean;
	hovedknappTekst: string;
}

const KøKriterieEditor = ({
	initialQuery,
	lagre,
	avbryt,
	tittel,
	paakrevdeFelter,
	readOnlyFelter,
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
			<KøKriterieEditorContent paakrevdeFelter={paakrevdeFelter} readOnlyFelter={readOnlyFelter} />
		</KøKriterieEditorProvider>
	);
};

export default KøKriterieEditor;

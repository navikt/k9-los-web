import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Label, ToggleGroup } from '@navikt/ds-react';
import { FilterContext } from 'filter/FilterContext';
import { type Feltreferanse, sammeFelt } from 'filter/feltIdentitet';
import { addFeltverdiFilter, addGruppeFilter, type QueryFunction, removeFilter, updateFilter } from 'filter/queryUtils';
import { useContext } from 'react';
import { assertNever } from 'utils/assert-never';
import type { IdentifiedCombineOppgavefilter, IdentifiedOppgavefilter } from '../filterFrontendTypes';
import * as filterGruppeStyles from './filterGruppe.module.css';
import Kriterie from './Kriterie';
import VelgKriterie from './VelgKriterie';

interface OppgavefilterPanelProps {
	oppgavefilter: IdentifiedOppgavefilter;
	addGruppeOperation?: QueryFunction;
	køvisning?: boolean;
	paakrevdeFelter?: Feltreferanse[];
	readOnlyFelter?: Feltreferanse[];
}

const OppgavefilterPanel = ({
	oppgavefilter,
	addGruppeOperation,
	køvisning,
	paakrevdeFelter,
	readOnlyFelter = [],
}: OppgavefilterPanelProps) => {
	const { readOnly: contextReadOnly } = useContext(FilterContext);

	if (oppgavefilter.type === 'feltverdi' && oppgavefilter.kode === null) {
		return (
			<VelgKriterie
				oppgavefilter={oppgavefilter}
				addGruppeOperation={addGruppeOperation}
				paakrevdeFelter={paakrevdeFelter}
			/>
		);
	}

	if (oppgavefilter.type === 'feltverdi') {
		return (
			<Kriterie
				oppgavefilter={oppgavefilter}
				paakrevdeFelter={paakrevdeFelter}
				readOnly={contextReadOnly || readOnlyFelter.some((felt) => sammeFelt(felt, oppgavefilter))}
			/>
		);
	}
	if (oppgavefilter.type === 'combine') {
		return (
			<FilterGruppe
				oppgavefilter={oppgavefilter}
				køvisning={køvisning}
				paakrevdeFelter={paakrevdeFelter}
				readOnlyFelter={readOnlyFelter}
			/>
		);
	}

	return assertNever(oppgavefilter);
};

interface FilterGruppeProps {
	oppgavefilter: IdentifiedCombineOppgavefilter;
	køvisning: boolean;
	paakrevdeFelter?: Feltreferanse[];
	readOnlyFelter?: Feltreferanse[];
}
const FilterGruppe = ({ oppgavefilter, køvisning, paakrevdeFelter, readOnlyFelter }: FilterGruppeProps) => {
	const { updateQuery, readOnly } = useContext(FilterContext);
	const handleToggle = (value: string) => {
		updateQuery([updateFilter(oppgavefilter._nodeId, { combineOperator: value })]);
	};
	return (
		<div className="rounded-sm border-solid border-[1px] border-ax-bg-accent-strong p-4">
			<div className="flex">
				<div className={`flex mb-3 ${filterGruppeStyles.toggle}`}>
					<Label className="mr-2 self-center" size="small">
						Gruppe:
					</Label>
					{readOnly ? (
						<span className="self-center text-sm">{oppgavefilter.combineOperator === 'AND' ? 'Og' : 'Eller'}</span>
					) : (
						<ToggleGroup onChange={handleToggle} size="small" value={oppgavefilter.combineOperator}>
							<ToggleGroup.Item value="AND">Og</ToggleGroup.Item>
							<ToggleGroup.Item value="OR">Eller</ToggleGroup.Item>
						</ToggleGroup>
					)}
				</div>
				{!readOnly && (
					<Button
						icon={<TrashIcon height="1.5rem" width="1.5rem" />}
						size="small"
						variant="tertiary"
						className="ml-auto"
						onClick={() => updateQuery([removeFilter(oppgavefilter._nodeId)])}
					/>
				)}
			</div>
			<div className="flex flex-col gap-4">
				{oppgavefilter.filtere.map((item) => (
					<OppgavefilterPanel
						key={item._nodeId}
						oppgavefilter={item}
						addGruppeOperation={addGruppeFilter(oppgavefilter._nodeId)}
						køvisning={køvisning}
						paakrevdeFelter={paakrevdeFelter}
						readOnlyFelter={readOnlyFelter}
					/>
				))}
			</div>
			{!readOnly && (
				<Button
					className="mt-4 mb-13"
					icon={<PlusCircleIcon aria-hidden />}
					variant="tertiary"
					size="small"
					onClick={() => updateQuery([addFeltverdiFilter(oppgavefilter._nodeId)])}
				>
					Legg til nytt kriterie
				</Button>
			)}
		</div>
	);
};

export default OppgavefilterPanel;

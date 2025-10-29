/* eslint-disable no-use-before-define */
import React, { useContext } from 'react';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Label, ToggleGroup } from '@navikt/ds-react';
import { FilterContext } from 'filter/FilterContext';
import { addFilter, addGruppe, removeFilter, updateFilter } from 'filter/queryUtils';
import { CombineOppgavefilter, FeltverdiOppgavefilter, OppgaveQuery, OppgavefilterKode } from '../filterTsTypes';
import Kriterie from './Kriterie';
import VelgKriterie from './VelgKriterie';
import * as filterGruppeStyles from './filterGruppe.css';

interface OppgavefilterPanelProps {
	oppgavefilter: FeltverdiOppgavefilter | CombineOppgavefilter;
	addGruppeOperation?: (model: OppgaveQuery) => OppgaveQuery;
	køvisning?: boolean;
	paakrevdeKoder?: OppgavefilterKode[];
	readOnlyKoder?: OppgavefilterKode[];
}

/* eslint-disable @typescript-eslint/no-use-before-define */
const OppgavefilterPanel = ({
	oppgavefilter,
	addGruppeOperation,
	køvisning,
	paakrevdeKoder,
	readOnlyKoder = [],
}: OppgavefilterPanelProps) => {
	const { readOnly: contextReadOnly } = useContext(FilterContext);

	if (oppgavefilter.type === 'feltverdi' && 'kode' in oppgavefilter && oppgavefilter.kode === null) {
		return (
			<VelgKriterie
				oppgavefilter={oppgavefilter}
				addGruppeOperation={addGruppeOperation}
				køvisning={køvisning}
				paakrevdeKoder={paakrevdeKoder}
			/>
		);
	}

	if (oppgavefilter.type === 'feltverdi' && 'operator' in oppgavefilter) {
		return (
			<Kriterie
				oppgavefilter={oppgavefilter}
				paakrevdeKoder={paakrevdeKoder}
				readOnly={contextReadOnly || readOnlyKoder.includes(oppgavefilter.kode)}
			/>
		);
	}
	if (oppgavefilter.type === 'combine' && 'combineOperator' in oppgavefilter) {
		return <FilterGruppe oppgavefilter={oppgavefilter} køvisning={køvisning} />;
	}

	throw new Error(`Unhandled type: ${oppgavefilter.type}`);
};

interface FilterGruppeProps {
	oppgavefilter: CombineOppgavefilter;
	køvisning: boolean;
}
const FilterGruppe = ({ oppgavefilter, køvisning }: FilterGruppeProps) => {
	const { updateQuery, readOnly } = useContext(FilterContext);
	const handleToggle = (value: string) => {
		updateQuery([updateFilter(oppgavefilter.id, { combineOperator: value })]);
	};
	return (
		<div className="rounded-sm border-solid border-[1px] border-surface-action p-4">
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
						onClick={() => updateQuery([removeFilter(oppgavefilter.id)])}
					/>
				)}
			</div>
			<div className="flex flex-col gap-4">
				{oppgavefilter.filtere.map((item) => (
					<OppgavefilterPanel
						key={item.id}
						oppgavefilter={item}
						addGruppeOperation={addGruppe(oppgavefilter.id)}
						køvisning={køvisning}
					/>
				))}
			</div>
			{!readOnly && (
				<Button
					className="mt-4 mb-13"
					icon={<PlusCircleIcon aria-hidden />}
					variant="tertiary"
					size="small"
					onClick={() => updateQuery([addFilter(oppgavefilter.id)])}
				>
					Legg til nytt kriterie
				</Button>
			)}
		</div>
	);
};

export default OppgavefilterPanel;

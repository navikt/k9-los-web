/* eslint-disable no-use-before-define */
import React, { useContext } from 'react';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Label, ToggleGroup } from '@navikt/ds-react';
import { FilterContext } from 'filter/FilterContext';
import { addFilter, addGruppe, removeFilter, updateFilter } from 'filter/queryUtils';
import { IdentifiedCombineOppgavefilter, IdentifiedOppgavefilter } from '../filterFrontendTypes';
import { OppgavefilterKode } from '../filterTsTypes';
import { QueryFunction } from '../queryUtils';
import Kriterie from './Kriterie';
import VelgKriterie from './VelgKriterie';
import * as filterGruppeStyles from './filterGruppe.css';

interface OppgavefilterPanelProps {
	oppgavefilter: IdentifiedOppgavefilter;
	addGruppeOperation?: QueryFunction;
	køvisning?: boolean;
	paakrevdeKoder?: string[];
	readOnlyKoder?: string[];
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

	if (oppgavefilter.type === 'feltverdi' && oppgavefilter.kode === null) {
		return (
			<VelgKriterie
				oppgavefilter={oppgavefilter}
				addGruppeOperation={addGruppeOperation}
				paakrevdeKoder={paakrevdeKoder}
			/>
		);
	}

	if (oppgavefilter.type === 'feltverdi') {
		return (
			<Kriterie
				oppgavefilter={oppgavefilter}
				paakrevdeKoder={paakrevdeKoder}
				readOnly={contextReadOnly || readOnlyKoder.includes(oppgavefilter.kode)}
			/>
		);
	}
	if (oppgavefilter.type === 'combine') {
		return <FilterGruppe oppgavefilter={oppgavefilter} køvisning={køvisning} />;
	}

	throw new Error(`Unhandled type: ${(oppgavefilter as any).type}`);
};

interface FilterGruppeProps {
	oppgavefilter: IdentifiedCombineOppgavefilter;
	køvisning: boolean;
}
const FilterGruppe = ({ oppgavefilter, køvisning }: FilterGruppeProps) => {
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
						addGruppeOperation={addGruppe(oppgavefilter._nodeId)}
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
					onClick={() => updateQuery([addFilter(oppgavefilter._nodeId)])}
				>
					Legg til nytt kriterie
				</Button>
			)}
		</div>
	);
};

export default OppgavefilterPanel;

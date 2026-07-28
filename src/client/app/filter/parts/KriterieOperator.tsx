import React, { ChangeEvent, useContext, useEffect, useMemo } from 'react';
import { Select } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { IdentifiedFeltverdiOppgavefilter } from 'filter/filterFrontendTypes';
import { TolkesSom } from 'filter/filterTsTypes';
import { updateFilter } from 'filter/queryUtils';
import { OPERATORS, operatorsFraTolkesSom } from 'filter/utils';

function KriterieOperator({
	oppgavefilter,
	readOnly,
}: {
	oppgavefilter: IdentifiedFeltverdiOppgavefilter;
	readOnly: boolean;
}) {
	const { updateQuery } = useContext(FilterContext);
	const { felter: kriterierSomKanVelges } = useContext(AppContext);

	const kriterieDefinisjon = kriterierSomKanVelges.find(
		(kriterie) => kriterie.område === oppgavefilter.område && kriterie.kode === oppgavefilter.kode,
	);

	if (!kriterieDefinisjon) {
		throw Error('KriterieDefinisjon ikke funnet');
	}

	const operatorDisplayMap = {
		[OPERATORS.EQUALS]: 'Er lik',
		[OPERATORS.NOT_EQUALS]: 'Er ikke lik',
		[OPERATORS.IN]: 'Inkluder',
		[OPERATORS.NOT_IN]: 'Ekskluder',
		[OPERATORS.LESS_THAN]: 'Mindre enn (<)',
		[OPERATORS.GREATER_THAN]: 'Større enn (>)',
		[OPERATORS.LESS_THAN_OR_EQUALS]:
			kriterieDefinisjon.tolkes_som === TolkesSom.Timestamp ? 'Til og med' : 'Mindre enn eller lik (<=)',
		[OPERATORS.GREATER_THAN_OR_EQUALS]:
			kriterieDefinisjon.tolkes_som === TolkesSom.Timestamp ? 'Fra og med' : 'Større enn eller lik (>=)',
		[OPERATORS.INTERVAL]: 'Fra og med, til og med',
	};

	const operators = useMemo(
		() => operatorsFraTolkesSom(kriterieDefinisjon.tolkes_som, kriterieDefinisjon.verdiforklaringer?.length),
		[kriterieDefinisjon.tolkes_som, kriterieDefinisjon.verdiforklaringer?.length],
	);

	// I readOnly modus: vis alltid operatoren selv om den ikke er i listen
	const operatorsToShow = useMemo(() => {
		if (readOnly && oppgavefilter.operator && !operators.includes(oppgavefilter.operator)) {
			return [...operators, oppgavefilter.operator];
		}
		return operators;
	}, [operators, oppgavefilter.operator, readOnly]);

	// Normaliserer operatoren dersom den ikke er gyldig for feltet. Vakten gjør at effekten
	// er en no-op når brukeren velger en gyldig operator, så den kommer ikke i veien for valget.
	useEffect(() => {
		if (!readOnly && operators.length && !operators.includes(oppgavefilter.operator)) {
			updateQuery([
				updateFilter(oppgavefilter._nodeId, {
					operator: operators[0],
				}),
			]);
		}
	}, [operators, oppgavefilter.operator, oppgavefilter._nodeId, readOnly, updateQuery]);

	if (operatorsToShow.length <= 1) {
		return null;
	}

	const handleChangeOperator = (event: ChangeEvent<HTMLSelectElement>) => {
		const newOperator = event.target.value;
		const switchingFromInterval = oppgavefilter.operator === OPERATORS.INTERVAL && newOperator !== OPERATORS.INTERVAL;

		updateQuery([
			updateFilter(oppgavefilter._nodeId, {
				operator: newOperator,
				...(switchingFromInterval && { verdi: oppgavefilter.verdi?.slice(0, 1) ?? [] }),
			}),
		]);
	};

	return (
		<div>
			<Select
				label="Operator"
				size="small"
				id={`${kriterieDefinisjon.kode}-operator`}
				hideLabel
				className="w-[12rem]"
				value={oppgavefilter.operator}
				onChange={handleChangeOperator}
				readOnly={readOnly}
			>
				{operatorsToShow.map((operator) => (
					<option key={operator} value={operator}>
						{operatorDisplayMap[operator]}
					</option>
				))}
			</Select>
		</div>
	);
}

export default KriterieOperator;

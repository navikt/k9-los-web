import React, { useContext, useEffect, useMemo } from 'react';
import { Select } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { FeltverdiOppgavefilter, TolkesSom } from 'filter/filterTsTypes';
import { updateFilter } from 'filter/queryUtils';
import { OPERATORS, operatorsFraTolkesSom } from 'filter/utils';

function KriterieOperator({ oppgavefilter, readOnly }: { oppgavefilter: FeltverdiOppgavefilter; readOnly: boolean }) {
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
		[JSON.stringify(kriterieDefinisjon)],
	);

	useEffect(() => {
		if (operators.length && !operators.includes(oppgavefilter.operator)) {
			updateQuery([
				updateFilter(oppgavefilter.id, {
					operator: operators[0],
				}),
			]);
		}
	}, [JSON.stringify(operators), JSON.stringify(kriterieDefinisjon)]);
	if (operators.length <= 1) {
		return null;
	}

	const handleChangeOperator = (event) => {
		updateQuery([
			updateFilter(oppgavefilter.id, {
				operator: event.target.value,
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
				{operators.map((operator) => (
					<option key={operator} value={operator}>
						{operatorDisplayMap[operator]}
					</option>
				))}
			</Select>
		</div>
	);
}

export default KriterieOperator;

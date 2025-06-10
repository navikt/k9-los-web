import React, { useContext } from 'react';
import { Select } from '@navikt/ds-react';
import { FilterContext } from 'filter/FilterContext';
import { updateFilter } from 'filter/queryUtils';
import { OPERATORS } from 'filter/utils';

function OperatorSelect({ oppgavefilter }) {
	const { updateQuery } = useContext(FilterContext);
	const handleChangeOperator = (event) => {
		updateQuery([
			updateFilter(oppgavefilter.id, {
				operator: event.target.value,
			}),
		]);
	};

	return (
		<Select label="Operator" size="small" hideLabel value={oppgavefilter.operator} onChange={handleChangeOperator}>
			<option value={OPERATORS.EQUALS}>er lik</option>
			<option value={OPERATORS.NOT_EQUALS}>er IKKE lik</option>
			<option value={OPERATORS.IN}>Inkluder</option>
			<option value={OPERATORS.NOT_IN}>Ekskluder</option>
			<option value={OPERATORS.LESS_THAN}>mindre enn (&#60;)</option>
			<option value={OPERATORS.GREATER_THAN}>større enn (&#62;)</option>
			<option value={OPERATORS.LESS_THAN_OR_EQUALS}>mindre enn eller lik (&#60;=)</option>
			<option value={OPERATORS.GREATER_THAN_OR_EQUALS}>større enn eller lik (&#62;=)</option>
		</Select>
	);
}

export default OperatorSelect;

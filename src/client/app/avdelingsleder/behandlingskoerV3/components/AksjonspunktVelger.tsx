import React, { FunctionComponent } from 'react';
import SearchDropdownMedPredefinerteVerdier, {
	SearchDropdownPredefinerteVerdierProps,
} from 'filter/parts/SearchDropdownMedPredefinerteVerdier';

const AksjonspunktVelger: FunctionComponent<
	SearchDropdownPredefinerteVerdierProps & { skjulValgteVerdierUnderDropdown?: boolean }
> = ({ onChange, feltdefinisjon, oppgavefilter, error, skjulValgteVerdierUnderDropdown }) => {
	const formaterteOppgavekoder = feltdefinisjon.verdiforklaringer
		.map(({ verdi, visningsnavn, gruppering }) => ({
			value: verdi,
			label: visningsnavn,
			group: gruppering,
		}))
		.sort((a, b) => Number(a.value) - Number(b.value));
	const grupper = [...new Set(formaterteOppgavekoder.map(({ group }) => group))].sort();
	return (
		<SearchDropdownMedPredefinerteVerdier
			feltdefinisjon={feltdefinisjon}
			onChange={onChange}
			oppgavefilter={oppgavefilter}
			suggestions={formaterteOppgavekoder}
			groups={grupper}
			error={error}
			skjulValgteVerdierUnderDropdown={skjulValgteVerdierUnderDropdown}
		/>
	);
};

export default AksjonspunktVelger;

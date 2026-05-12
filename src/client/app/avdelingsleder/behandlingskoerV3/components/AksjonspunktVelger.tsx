import React, { FunctionComponent } from 'react';
import { Synlighet } from 'filter/filterTsTypes';
import SearchDropdownMedPredefinerteVerdier, {
	SearchDropdownPredefinerteVerdierProps,
} from 'filter/parts/SearchDropdownMedPredefinerteVerdier';
import { sorterVerdiforklaringer } from 'filter/utils';

const AksjonspunktVelger: FunctionComponent<
	SearchDropdownPredefinerteVerdierProps & { skjulValgteVerdierUnderDropdown?: boolean }
> = ({ onChange, feltdefinisjon, oppgavefilter, error, skjulValgteVerdierUnderDropdown, readOnly }) => {
	const formaterteOppgavekoder = sorterVerdiforklaringer(feltdefinisjon.verdiforklaringer)
		.filter(({ synlighet }) => synlighet !== Synlighet.Skjult)
		.map(({ verdi, visningsnavn, gruppering, synlighet }) => ({
			value: verdi,
			label: visningsnavn,
			group: gruppering,
			secondary: synlighet === Synlighet.UnderStreken,
		}));

	// Finn grupper som kun har sekundære elementer
	const alleGrupper = [...new Set(formaterteOppgavekoder.map(({ group }) => group))];
	const sekundæreGrupper = alleGrupper.filter((group) => {
		const itemsInGroup = formaterteOppgavekoder.filter((item) => item.group === group);
		return itemsInGroup.length > 0 && itemsInGroup.every((item) => item.secondary);
	});

	// Sorter grupper: primære først (alfabetisk), deretter sekundære (alfabetisk)
	const grupper = alleGrupper.sort((a, b) => {
		const aIsSecondary = sekundæreGrupper.includes(a);
		const bIsSecondary = sekundæreGrupper.includes(b);
		if (aIsSecondary && !bIsSecondary) return 1;
		if (!aIsSecondary && bIsSecondary) return -1;
		return a.localeCompare(b);
	});

	return (
		<SearchDropdownMedPredefinerteVerdier
			feltdefinisjon={feltdefinisjon}
			onChange={onChange}
			oppgavefilter={oppgavefilter}
			suggestions={formaterteOppgavekoder}
			groups={grupper}
			secondaryGroups={sekundæreGrupper}
			error={error}
			skjulValgteVerdierUnderDropdown={skjulValgteVerdierUnderDropdown}
			readOnly={readOnly}
		/>
	);
};

export default AksjonspunktVelger;

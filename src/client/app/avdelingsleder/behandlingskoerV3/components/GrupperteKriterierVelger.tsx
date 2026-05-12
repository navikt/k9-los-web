import React, { FunctionComponent } from 'react';
import { Synlighet } from 'filter/filterTsTypes';
import SearchDropdownMedPredefinerteVerdier, {
	SearchDropdownPredefinerteVerdierProps,
} from 'filter/parts/SearchDropdownMedPredefinerteVerdier';
import { sorterGrupperinger, sorterVerdiforklaringer } from 'filter/utils';

const GrupperteKriterierVelger: FunctionComponent<
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

	// Sorter grupper etter effektiv rekkefølge, med sekundære grupper etter primære
	const primære = sorterGrupperinger(
		alleGrupper.filter((g) => !sekundæreGrupper.includes(g)),
		feltdefinisjon.verdiforklaringer,
	);
	const sekundære = sorterGrupperinger(sekundæreGrupper, feltdefinisjon.verdiforklaringer);
	const grupper = [...primære, ...sekundære];

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

export default GrupperteKriterierVelger;

import React, { FunctionComponent } from 'react';
import SearchDropdownMedPredefinerteVerdier, {
	SearchDropdownPredefinerteVerdierProps,
} from 'filter/parts/SearchDropdownMedPredefinerteVerdier';

const AksjonspunktVelger: FunctionComponent<
	SearchDropdownPredefinerteVerdierProps & { skjulValgteVerdierUnderDropdown?: boolean }
> = ({ onChange, feltdefinisjon, oppgavefilter, error, skjulValgteVerdierUnderDropdown }) => {
	const formaterteOppgavekoder = feltdefinisjon.verdiforklaringer
		.filter(({ synlighet }) => synlighet !== 'SKJULT')
		.map(({ verdi, visningsnavn, gruppering, synlighet, sekundærvalg }) => {
			// sekundærvalg skal fases ut til fordel for synlighet, har begge feltene p.t. for å være foroverkompatibelt
			const secondary = synlighet ? synlighet === 'UNDER_STREKEN' : (sekundærvalg ?? false);
			return {
				value: verdi,
				label: visningsnavn,
				group: gruppering,
				secondary,
			};
		})
		.sort((a, b) => Number(a.value) - Number(b.value));

	// Finn grupper som kun har sekundærvalg-elementer
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
		/>
	);
};

export default AksjonspunktVelger;

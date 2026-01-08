import React, { useContext } from 'react';
import { FilterContext } from 'filter/FilterContext';
import { FeltverdiOppgavefilter, Oppgavefelt } from 'filter/filterTsTypes';
import { updateFilter } from 'filter/queryUtils';
import { SelectedValues } from 'sharedComponents/searchWithDropdown/SelectedValues';

interface Props {
	oppgavefilter: FeltverdiOppgavefilter;
	feltdefinisjon: Oppgavefelt;
}

export const Aksjonspunktvisning = ({ oppgavefilter, feltdefinisjon }: Props) => {
	const { updateQuery } = useContext(FilterContext);
	const formaterteOppgavekoder = feltdefinisjon.verdiforklaringer
		.map(({ verdi, visningsnavn, gruppering }) => ({
			value: verdi,
			label: visningsnavn,
			group: gruppering,
		}))
		.sort((a, b) => Number(a.value) - Number(b.value));

	const valgteAksjonspunkter = oppgavefilter.verdi || [];
	const values = valgteAksjonspunkter.map((value) => {
		const aksjonspunkt = formaterteOppgavekoder.find((ap) => ap.value === value);
		return {
			label: aksjonspunkt?.label,
			value,
			group: aksjonspunkt?.group,
		};
	});

	const update = (value: string[]) => {
		updateQuery([
			updateFilter(oppgavefilter.id, {
				verdi: value,
			}),
		]);
	};

	const remove = (v: string) => {
		const newSelectedValues = valgteAksjonspunkter.filter((s) => s !== v);
		update(newSelectedValues);
	};

	const removeAllValues = () => {
		update([]);
	};

	return <SelectedValues values={values} remove={remove} removeAllValues={removeAllValues} />;
};

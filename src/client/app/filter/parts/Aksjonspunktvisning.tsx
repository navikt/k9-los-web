import React, { useContext } from 'react';
import { useKodeverk } from 'api/rest-api-hooks';
import { FilterContext } from 'filter/FilterContext';
import { FeltverdiOppgavefilter } from 'filter/filterTsTypes';
import { removeFilter, updateFilter } from 'filter/queryUtils';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { SelectedValues } from 'sharedComponents/searchWithDropdown/SelectedValues';

interface Props {
	oppgavefilter: FeltverdiOppgavefilter;
}

export const Aksjonspunktvisning = ({ oppgavefilter }: Props) => {
	const oppgavekoder = useKodeverk(kodeverkTyper.OPPGAVE_KODE);
	const { updateQuery } = useContext(FilterContext);
	const formaterteOppgavekoder = oppgavekoder
		.map((oppgavekode) => ({
			value: oppgavekode.kode,
			label: `${oppgavekode.kode} - ${oppgavekode.navn}`,
			group: oppgavekode.gruppering,
		}))
		.sort((a, b) => Number(a.value) - Number(b.value));

	const valgteAksjonspunkter = oppgavefilter.verdi as string[];
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

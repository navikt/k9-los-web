import React, { useContext, useEffect, useState } from 'react';
import { UNSAFE_Combobox } from '@navikt/ds-react';
import { FilterContext } from 'filter/FilterContext';
import { IdentifiedFeltverdiOppgavefilter } from 'filter/filterFrontendTypes';
import { Oppgavefelt, Synlighet } from 'filter/filterTsTypes';
import { updateFilter } from 'filter/queryUtils';
import { COMBOBOX_SEPARATOR_VALUE, comboboxSeparatorStyle, sorterVerdiforklaringer } from 'filter/utils';

type ComboboxOption = {
	label: string;
	value: string;
};

interface Props {
	feltdefinisjon?: Oppgavefelt;
	oppgavefilter: IdentifiedFeltverdiOppgavefilter;
	error?: string;
	readOnly?: boolean;
}

const MultiSelectKriterie = ({ feltdefinisjon, oppgavefilter, error, readOnly }: Props) => {
	const [value, setValue] = useState('');
	const [visSekundærvalg, setVisSekundærvalg] = useState(false);
	const [options, setOptions] = useState<ComboboxOption[]>([]);
	const { updateQuery } = useContext(FilterContext);
	const verdier = oppgavefilter.verdi;
	const selectedOptions = verdier?.map((v) => {
		const option = feltdefinisjon.verdiforklaringer.find((verdiforklaring) => verdiforklaring.verdi === v);
		if (!option) {
			return { value: v, label: v };
		}
		return { value: option.verdi, label: option.visningsnavn };
	});

	const getOptions = () => {
		const sortert = sorterVerdiforklaringer(feltdefinisjon.verdiforklaringer);
		const primærvalg = sortert
			.filter((v) => v.synlighet !== Synlighet.UnderStreken)
			.map((v) => ({ value: v.verdi, label: v.visningsnavn }));
		const sekundærvalg = sortert
			.filter((v) => v.synlighet === Synlighet.UnderStreken)
			.map((v) => ({ value: v.verdi, label: v.visningsnavn }));

		const harSekundærvalg = sekundærvalg.length > 0;
		if (visSekundærvalg && harSekundærvalg) {
			return [...primærvalg, { value: COMBOBOX_SEPARATOR_VALUE, label: '' }, ...sekundærvalg];
		}

		if (harSekundærvalg) {
			return [...primærvalg, { value: '--- Vis alle ---', label: '--- Vis alle ---' }];
		}

		return primærvalg;
	};

	useEffect(() => {
		setOptions(getOptions());
	}, [feltdefinisjon, visSekundærvalg]);

	const onToggleSelected = (option: string, isSelected: boolean) => {
		if (option === COMBOBOX_SEPARATOR_VALUE) return;
		if (option === '--- Vis alle ---') {
			setVisSekundærvalg(true);
			setValue('');
			return;
		}
		const verdi = feltdefinisjon?.verdiforklaringer.find((v) => v.verdi === option)?.verdi;
		if (isSelected) {
			updateQuery([updateFilter(oppgavefilter._nodeId, { verdi: [...(oppgavefilter?.verdi || []), verdi] })]);
		} else {
			updateQuery([updateFilter(oppgavefilter._nodeId, { verdi: verdier?.filter((o) => o !== verdi) })]);
		}
	};
	return (
		<div className="multiSelectKriterie">
			<style>{comboboxSeparatorStyle('multiSelectKriterie')}</style>
			<UNSAFE_Combobox
				size="small"
				label={feltdefinisjon.visningsnavn}
				shouldAutocomplete
				clearButton
				onClear={() => {
					setValue('');
				}}
				hideLabel
				options={options}
				isMultiSelect
				onChange={setValue}
				onToggleSelected={onToggleSelected}
				selectedOptions={selectedOptions || []}
				value={value}
				error={error}
				readOnly={readOnly}
			/>
		</div>
	);
};

export default MultiSelectKriterie;

import React, { useContext, useEffect, useState } from 'react';
import { UNSAFE_Combobox } from '@navikt/ds-react';
import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';
import { FilterContext } from 'filter/FilterContext';
import { IdentifiedFeltverdiOppgavefilter } from 'filter/filterFrontendTypes';
import { Oppgavefelt } from 'filter/filterTsTypes';
import { updateFilter } from 'filter/queryUtils';
import { COMBOBOX_SEPARATOR_VALUE, comboboxSeparatorStyle } from 'filter/utils';

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
		const primærvalg = feltdefinisjon.verdiforklaringer
			?.filter((v) => !v.sekundærvalg)
			.map((v) => ({ value: v.verdi, label: v.visningsnavn }));
		const sekundærvalg = feltdefinisjon.verdiforklaringer
			?.filter((v) => v.sekundærvalg)
			.map((v) => ({ value: v.verdi, label: v.visningsnavn }));

		const harSekundærvalg = sekundærvalg?.length > 0;
		if (visSekundærvalg && harSekundærvalg) {
			return [...primærvalg, { value: COMBOBOX_SEPARATOR_VALUE, label: '' }, ...sekundærvalg];
		}

		const filteredOptions = feltdefinisjon.verdiforklaringer
			?.filter((v) => !v.sekundærvalg)
			?.map((v) => ({ value: v.verdi, label: v.visningsnavn }));

		if (harSekundærvalg) {
			return [...filteredOptions, { value: '--- Vis alle ---', label: '--- Vis alle ---' }];
		}

		return filteredOptions;
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

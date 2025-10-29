/* eslint-disable react/jsx-pascal-case */
/* eslint-disable camelcase */
import React, { useContext, useEffect, useState } from 'react';
import { UNSAFE_Combobox } from '@navikt/ds-react';
import { FilterContext } from 'filter/FilterContext';
import { FeltverdiOppgavefilter, Oppgavefelt } from 'filter/filterTsTypes';
import { updateFilter } from 'filter/queryUtils';

interface Props {
	feltdefinisjon?: Oppgavefelt;
	oppgavefilter: FeltverdiOppgavefilter;
	error?: string;
	readOnly?: boolean;
}

const MultiSelectKriterie = ({ feltdefinisjon, oppgavefilter, error, readOnly }: Props) => {
	const [value, setValue] = useState('');
	const [visSekundærvalg, setVisSekundærvalg] = useState(false);
	const [selectedChildIndex, setSelectedChildIndex] = useState(undefined);
	const [options, setOptions] = useState([]);
	const { updateQuery } = useContext(FilterContext);
	const verdier = oppgavefilter.verdi as string[];
	const selectedOptions = verdier?.map((v) => {
		const option = feltdefinisjon.verdiforklaringer.find((verdiforklaring) => verdiforklaring.verdi === v);
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
			const valg = [...primærvalg, ...sekundærvalg];
			const selectedChild = valg.findIndex((v) => v === sekundærvalg[0]);
			if (selectedChild !== -1) {
				setSelectedChildIndex(selectedChild + 1);
			}
			return valg;
		}

		const filteredOptions = feltdefinisjon.verdiforklaringer
			?.filter((v) => !v.sekundærvalg)
			?.map((v) => ({ value: v.verdi, label: v.visningsnavn }));
		return [...filteredOptions, harSekundærvalg ? '--- Vis alle ---' : false].filter(Boolean);
	};

	useEffect(() => {
		setOptions(getOptions());
	}, [feltdefinisjon, visSekundærvalg]);

	const onToggleSelected = (option: string, isSelected: boolean) => {
		if (option === '--- Vis alle ---') {
			setVisSekundærvalg(true);
			setValue('');
			return;
		}
		const verdi = feltdefinisjon?.verdiforklaringer.find((v) => v.verdi === option)?.verdi;
		if (isSelected) {
			updateQuery([updateFilter(oppgavefilter.id, { verdi: [...(oppgavefilter?.verdi || []), verdi] })]);
		} else {
			updateQuery([updateFilter(oppgavefilter.id, { verdi: verdier?.filter((o) => o !== verdi) })]);
		}
	};
	return (
		<div className="multiSelectKriterie">
			<style>
				{`.multiSelectKriterie ul > li:nth-child(${selectedChildIndex}) {
           border-top: 2px solid black; 
        }`}
			</style>
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

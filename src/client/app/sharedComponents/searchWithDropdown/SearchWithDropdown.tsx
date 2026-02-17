/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from 'react';
import { UNSAFE_Combobox } from '@navikt/ds-react';
import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';
import { SelectedValues } from './SelectedValues';
import * as styles from './searchWithDropdown.css';

interface SuggestionsType {
	label: string;
	value: string;
	group?: string;
}

export type SearchWithDropdownProps = {
	label?: string;
	size?: 'small' | 'medium';
	description?: string;
	suggestions: SuggestionsType[];
	groups?: string[];
	secondaryGroups?: string[];
	heading?: string;
	updateSelection: (values: string[]) => void;
	selectedValues: string[];
	showLabel?: boolean;
	error?: string;
	className?: string;
	id?: string;
	skjulValgteVerdierUnderDropdown?: boolean;
};

const SearchWithDropdown: React.FC<SearchWithDropdownProps> = (props) => {
	const {
		label,
		description,
		suggestions,
		secondaryGroups = [],
		updateSelection,
		selectedValues,
		error,
		className,
		id,
		showLabel = false,
		size = 'small',
		skjulValgteVerdierUnderDropdown = false,
	} = props;

	const [value, setValue] = useState('');
	const [visSekundærvalg, setVisSekundærvalg] = useState(false);

	const getSuggestion = (suggestionValue: string) => suggestions.find((s) => s.value === suggestionValue);

	const hasSecondaryGroups = secondaryGroups.length > 0;

	useEffect(() => {
		if (hasSecondaryGroups) {
			const hasSelectedSecondary = selectedValues.some((v) => secondaryGroups.includes(getSuggestion(v)?.group));
			if (hasSelectedSecondary) {
				setVisSekundærvalg(true);
			}
		}
	}, []);

	const primaryOptions: ComboboxOption[] = suggestions
		.filter((s) => !hasSecondaryGroups || !secondaryGroups.includes(s.group))
		.map((s) => ({ label: s.label, value: s.value }));

	const secondaryOptions: ComboboxOption[] = suggestions
		.filter((s) => hasSecondaryGroups && secondaryGroups.includes(s.group))
		.map((s) => ({ label: s.label, value: s.value }));

	const getOptions = (): ComboboxOption[] => {
		if (!hasSecondaryGroups) {
			return suggestions.map((s) => ({ label: s.label, value: s.value }));
		}
		if (visSekundærvalg) {
			return [...primaryOptions, ...secondaryOptions];
		}
		return [...primaryOptions, { value: '--- Vis alle ---', label: '--- Vis alle ---' }];
	};

	const options = getOptions();

	const selectedOptions: ComboboxOption[] = selectedValues
		.map((v) => {
			const s = getSuggestion(v);
			return s ? { label: s.label, value: s.value } : undefined;
		})
		.filter(Boolean);

	const onToggleSelected = (option: string, isSelected: boolean) => {
		if (option === '--- Vis alle ---') {
			setVisSekundærvalg(true);
			setValue('');
			return;
		}
		if (isSelected) {
			updateSelection([...selectedValues, option]);
		} else {
			updateSelection(selectedValues.filter((v) => v !== option));
		}
	};

	const onRemoveSuggestion = (suggestionValue: string) => {
		updateSelection(selectedValues.filter((v) => v !== suggestionValue));
	};

	const removeAllSuggestions = () => {
		updateSelection([]);
	};

	const sv = selectedValues.map((s) => getSuggestion(s)).filter(Boolean);

	return (
		<div className={`${styles.searchContainer} ${className || ''}`}>
			<UNSAFE_Combobox
				id={id}
				size={size}
				label={label}
				description={description}
				hideLabel={!showLabel}
				options={options}
				isMultiSelect
				shouldShowSelectedOptions={false}
				shouldAutocomplete
				onChange={setValue}
				onClear={() => setValue('')}
				onToggleSelected={onToggleSelected}
				selectedOptions={selectedOptions}
				value={value}
				error={error}
			/>
			{!skjulValgteVerdierUnderDropdown && sv.length > 0 && (
				<SelectedValues values={sv} remove={onRemoveSuggestion} removeAllValues={removeAllSuggestions} />
			)}
		</div>
	);
};

export default SearchWithDropdown;

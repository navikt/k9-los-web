/* eslint-disable react/jsx-pascal-case */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import { Button, Checkbox, ErrorMessage, Label, Search, UNSAFE_Combobox } from '@navikt/ds-react';
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
	readOnly?: boolean;
};

/** Grouped dropdown built with Aksel primitives (Search + Popover + Checkbox) */
const GroupedSearchWithDropdown: React.FC<SearchWithDropdownProps> = (props) => {
	const {
		label,
		suggestions,
		groups = [],
		secondaryGroups = [],
		heading,
		updateSelection,
		selectedValues,
		error,
		className,
		id,
		showLabel = false,
		size = 'small',
		skjulValgteVerdierUnderDropdown = false,
		readOnly = false,
	} = props;

	const [selectedSuggestionValues, setSelectedSuggestionValues] = useState(selectedValues);
	const [currentInput, setCurrentInput] = useState('');
	const [openGroups, setOpenGroups] = useState<string[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [visUnderStreken, setVisUnderStreken] = useState(false);
	const anchorRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const selectedRef = useRef(selectedSuggestionValues);
	const prevSyncedRef = useRef(JSON.stringify(selectedValues));

	const handleClickOutside = useCallback((e: MouseEvent) => {
		if (
			dropdownRef.current?.contains(e.target as Node) ||
			anchorRef.current?.contains(e.target as Node)
		)
			return;
		setIsOpen(false);
	}, []);

	const getSuggestion = (v: string) => suggestions.find((s) => s.value === v);

	const showFilteredOnly = currentInput.length > 0;
	const filteredSuggestions = showFilteredOnly
		? suggestions.filter(
				(s) =>
					s.label.toLowerCase().includes(currentInput.toLowerCase()) || s.value.includes(currentInput),
			)
		: suggestions;

	const isInitialMount = useRef(true);
	useEffect(() => {
		// Ikke overskriv lokal state mens dropdown er åpen — lokal state er autoritativ
		if (!isInitialMount.current && isOpen) return;

		setSelectedSuggestionValues(selectedValues);
		selectedRef.current = selectedValues;
		prevSyncedRef.current = JSON.stringify(selectedValues);
		if (isInitialMount.current) {
			isInitialMount.current = false;
			const selectedGroups = selectedValues
				.map((v) => getSuggestion(v)?.group)
				.filter(Boolean);
			setOpenGroups((prev) => [...new Set([...prev, ...selectedGroups])]);
		}
		setCurrentInput('');
	}, [JSON.stringify(selectedValues)]);

	useEffect(() => {
		if (secondaryGroups.length > 0) {
			const hasSelectedSecondary = selectedValues.some((v) =>
				secondaryGroups.includes(getSuggestion(v)?.group),
			);
			if (hasSelectedSecondary) setVisUnderStreken(true);
		}
	}, []);

	// Sync local selection to parent on every change
	useEffect(() => {
		const key = JSON.stringify(selectedSuggestionValues);
		if (key !== prevSyncedRef.current) {
			prevSyncedRef.current = key;
			updateSelection(selectedSuggestionValues);
		}
	}, [selectedSuggestionValues]);

	useEffect(() => {
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isOpen, handleClickOutside]);

	const onSelect = (value: string) => {
		setSelectedSuggestionValues((prev) => {
			const next = prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
			selectedRef.current = next;
			return next;
		});
	};

	const toggleGroupOpen = (group: string) => {
		setOpenGroups((prev) =>
			prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group],
		);
	};

	const toggleGroupSelection = (group: string) => {
		const groupValues = suggestions.filter((s) => s.group === group).map((s) => s.value);
		setSelectedSuggestionValues((prev) => {
			const allSelected = groupValues.every((v) => prev.includes(v));
			if (allSelected) {
				// Deselect all in group → collapse group
				setOpenGroups((og) => og.filter((g) => g !== group));
				const next = prev.filter((v) => !groupValues.includes(v));
				selectedRef.current = next;
				return next;
			}
			// Select all in group → expand group
			setOpenGroups((og) => (og.includes(group) ? og : [...og, group]));
			const next = [...new Set([...prev, ...groupValues])];
			selectedRef.current = next;
			return next;
		});
	};

	const groupHasSelection = (group: string) =>
		selectedSuggestionValues.some((v) => getSuggestion(v)?.group === group);

	const primaryGroups = groups.filter((g) => !secondaryGroups.includes(g));
	const secondaryGroupList = groups.filter((g) => secondaryGroups.includes(g));
	const hasSecondary = secondaryGroupList.length > 0;

	const onRemoveSuggestion = (v: string) => {
		const newValues = selectedSuggestionValues.filter((s) => s !== v);
		setSelectedSuggestionValues(newValues);
		selectedRef.current = newValues;
		updateSelection(newValues);
	};

	const removeAllSuggestions = () => {
		setSelectedSuggestionValues([]);
		selectedRef.current = [];
		updateSelection([]);
	};

	const renderGroup = (group: string, isFirstSecondary = false) => {
		const suggestionsInGroup = suggestions.filter((s) => s.group === group);
		const numSelected = selectedSuggestionValues.filter((v) => getSuggestion(v)?.group === group).length;

		return (
			<li key={group} className={isFirstSecondary ? styles.secondarySection : undefined}>
				<div className={styles.groupHeader}>
					<Checkbox
						className="flex-shrink-0"
						size="small"
						value={group}
						onChange={() => toggleGroupSelection(group)}
						checked={groupHasSelection(group)}
					>
						{group}
					</Checkbox>
					<div className="flex items-center ml-auto gap-1">
						{numSelected > 0 && <span className={styles.numberBubble}>{numSelected}</span>}
						<button
							type="button"
							onClick={() => toggleGroupOpen(group)}
							className={styles.chevronButton}
							aria-label={`${openGroups.includes(group) ? 'Skjul' : 'Vis'} ${group}`}
						>
							<ChevronRightIcon
								width="1.5rem"
								height="1.5rem"
								className={openGroups.includes(group) ? styles.chevronOpen : undefined}
							/>
						</button>
					</div>
				</div>
				{openGroups.includes(group) && (
					<ul className={styles.subList}>
						{suggestionsInGroup.map((suggestion) => (
							<li key={suggestion.value} className={styles.subItem}>
								<Checkbox
									size="small"
									value={suggestion.value}
									onChange={() => onSelect(suggestion.value)}
									checked={selectedSuggestionValues.includes(suggestion.value)}
								>
									{suggestion.label}
								</Checkbox>
							</li>
						))}
					</ul>
				)}
			</li>
		);
	};

	const sv = selectedSuggestionValues.map((s) => getSuggestion(s)).filter(Boolean);

	return (
		<div className={`${styles.searchContainer} ${className || ''}`}>
			<div>
				{readOnly ? (
					<UNSAFE_Combobox
						id={id}
						size={size}
						label={label}
						hideLabel={!showLabel}
						options={[]}
						isMultiSelect
						shouldShowSelectedOptions={false}
						selectedOptions={sv.map((s) => ({ label: s.label, value: s.value }))}
						readOnly
					/>
				) : (
					<>
						<Label htmlFor={id} size={size} className={showLabel ? '' : 'aksel-sr-only'}>
							{label}
						</Label>
						<div ref={anchorRef}>
							<Search
								id={id}
								label={label}
								hideLabel
								size={size}
								variant="secondary"
								value={currentInput}
								onChange={(val) => setCurrentInput(val)}
								onFocus={() => setIsOpen(true)}
								onClear={() => setCurrentInput('')}
								autoComplete="off"
							/>
						</div>
					</>
				)}
				{isOpen && (
					<div ref={dropdownRef} className={styles.dropdown}>
						<fieldset className={styles.fieldset}>
							{heading && <legend className="aksel-sr-only">{heading}</legend>}
							<ul className={styles.groupList}>
								{!showFilteredOnly &&
									primaryGroups
										.filter((g) => filteredSuggestions.some((s) => s.group === g))
										.map((g) => renderGroup(g))}
								{!showFilteredOnly &&
									visUnderStreken &&
									secondaryGroupList
										.filter((g) => filteredSuggestions.some((s) => s.group === g))
										.map((g, i) => renderGroup(g, i === 0))}
								{showFilteredOnly &&
									filteredSuggestions.map((suggestion) => (
										<li key={suggestion.value} className={styles.filterItem}>
											<Checkbox
												size="small"
												value={suggestion.value}
												onChange={() => onSelect(suggestion.value)}
												checked={selectedSuggestionValues.includes(suggestion.value)}
											>
												{suggestion.label}
											</Checkbox>
										</li>
									))}
							</ul>
						</fieldset>
						<div className={styles.popoverButtons}>
							{hasSecondary && !showFilteredOnly && (
								<Button
									onClick={() => setVisUnderStreken(!visUnderStreken)}
									variant="tertiary"
									size="small"
									type="button"
								>
									{visUnderStreken ? 'Skjul valg under streken' : 'Vis alle valg'}
								</Button>
							)}
							<Button onClick={() => setIsOpen(false)} variant="tertiary" size="small" type="button">
								Lukk
							</Button>
						</div>
					</div>
				)}
			</div>
			{!skjulValgteVerdierUnderDropdown && sv.length > 0 && (
				<SelectedValues values={sv} remove={readOnly ? undefined : onRemoveSuggestion} removeAllValues={readOnly ? undefined : removeAllSuggestions} />
			)}
			{error && <ErrorMessage>{error}</ErrorMessage>}
		</div>
	);
};

/** Simple (ungrouped) dropdown using Aksel UNSAFE_Combobox */
const SimpleSearchWithDropdown: React.FC<SearchWithDropdownProps> = (props) => {
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
		readOnly = false,
	} = props;

	const [value, setValue] = useState('');
	const [visSekundærvalg, setVisSekundærvalg] = useState(false);

	const getSuggestion = (v: string) => suggestions.find((s) => s.value === v);
	const hasSecondaryGroups = secondaryGroups.length > 0;

	useEffect(() => {
		if (hasSecondaryGroups) {
			const hasSelectedSecondary = selectedValues.some((v) => secondaryGroups.includes(getSuggestion(v)?.group));
			if (hasSelectedSecondary) setVisSekundærvalg(true);
		}
	}, []);

	const primaryOptions: ComboboxOption[] = suggestions
		.filter((s) => !hasSecondaryGroups || !secondaryGroups.includes(s.group))
		.map((s) => ({ label: s.label, value: s.value }));

	const secondaryOptions: ComboboxOption[] = suggestions
		.filter((s) => hasSecondaryGroups && secondaryGroups.includes(s.group))
		.map((s) => ({ label: s.label, value: s.value }));

	const getOptions = (): ComboboxOption[] => {
		if (!hasSecondaryGroups) return suggestions.map((s) => ({ label: s.label, value: s.value }));
		if (visSekundærvalg) return [...primaryOptions, ...secondaryOptions];
		return [...primaryOptions, { value: '--- Vis alle ---', label: '--- Vis alle ---' }];
	};

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
		if (isSelected) updateSelection([...selectedValues, option]);
		else updateSelection(selectedValues.filter((v) => v !== option));
	};

	const onRemoveSuggestion = (v: string) => updateSelection(selectedValues.filter((s) => s !== v));
	const removeAllSuggestions = () => updateSelection([]);

	const sv = selectedValues.map((s) => getSuggestion(s)).filter(Boolean);

	return (
		<div className={`${styles.searchContainer} ${className || ''}`}>
			<UNSAFE_Combobox
				id={id}
				size={size}
				label={label}
				description={description}
				hideLabel={!showLabel}
				options={getOptions()}
				isMultiSelect
				shouldShowSelectedOptions={false}
				shouldAutocomplete
				onChange={setValue}
				onClear={() => setValue('')}
				onToggleSelected={onToggleSelected}
				selectedOptions={selectedOptions}
				value={value}
				error={error}
				readOnly={readOnly}
			/>
			{!skjulValgteVerdierUnderDropdown && sv.length > 0 && (
				<SelectedValues values={sv} remove={readOnly ? undefined : onRemoveSuggestion} removeAllValues={readOnly ? undefined : removeAllSuggestions} />
			)}
		</div>
	);
};

const SearchWithDropdown: React.FC<SearchWithDropdownProps> = (props) => {
	if (props.groups?.length > 0) {
		return <GroupedSearchWithDropdown {...props} />;
	}
	return <SimpleSearchWithDropdown {...props} />;
};

export default SearchWithDropdown;

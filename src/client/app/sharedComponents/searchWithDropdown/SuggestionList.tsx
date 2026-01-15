import React, { useEffect, useState } from 'react';
import { ComboboxList, ComboboxPopover } from '@reach/combobox';
import { Button, Checkbox } from '@navikt/ds-react';
import SelectCheckbox from '../SelectCheckbox';
import * as styles from './searchWithDropdown.css';

const SuggestionList = ({
	groups,
	secondaryGroups = [],
	heading,
	suggestions,
	filteredSuggestions,
	showFilteredSuggestionsOnly,
	selectedSuggestionValues,
	onSelect,
	toggleGroupOpen,
	toggleGroupSelectionValues,
	updateSelection,
	openSuggestionGroups,
	setIsPopoverOpen,
	getSuggestion,
}) => {
	const [visUnderStreken, setVisUnderStreken] = useState(false);

	useEffect(() => {
		updateSelection(selectedSuggestionValues);
	}, [selectedSuggestionValues]);

	useEffect(() => {
		if (secondaryGroups.length > 0) {
			const hasSelectedSecondary = selectedSuggestionValues.some((value) =>
				secondaryGroups.includes(getSuggestion(value)?.group),
			);
			if (hasSelectedSecondary) {
				setVisUnderStreken(true);
			}
		}
	}, []);

	const groupHasSelectedSuggestions = (group) =>
		selectedSuggestionValues.some((suggestionValue) => getSuggestion(suggestionValue)?.group === group);

	const groupIsOpen = (group) => openSuggestionGroups.includes(group);

	const isSecondary = (group) => secondaryGroups.includes(group);

	const primaryGroups = groups?.filter((group) => !isSecondary(group)) || [];
	const secondaryGroupsInList = groups?.filter((group) => isSecondary(group)) || [];
	const hasSecondaryGroups = secondaryGroupsInList.length > 0;

	const renderGroup = (group, isFirstSecondary = false) => {
		const suggestionsInThisGroup = suggestions.filter((suggestion) => suggestion?.group === group);
		const numberOfSelectedItemsInGroup = selectedSuggestionValues.filter(
			(suggestionValue) => getSuggestion(suggestionValue)?.group === group,
		).length;

		return (
			<li key={group} className={isFirstSecondary ? styles.secondarySection : undefined}>
				<SelectCheckbox
					value={group}
					label={group}
					onClick={(suggestionGroup) => toggleGroupSelectionValues(suggestionGroup)}
					toggleGroupOpen={(suggestionGroup) => toggleGroupOpen(suggestionGroup)}
					numberOfItems={numberOfSelectedItemsInGroup}
					isChecked={groupHasSelectedSuggestions(group)}
					isOpen={groupIsOpen(group)}
				/>
				{openSuggestionGroups.includes(group) && (
					<ul>
						{suggestionsInThisGroup.map((suggestion) => (
							<li key={suggestion.value} className={styles.suggestionSubgroup}>
								<Checkbox
									className={styles.suggestionCheckbox}
									value={suggestion.value}
									onClick={() => onSelect(suggestion.value)}
									checked={selectedSuggestionValues.includes(suggestion.value)}
									size="small"
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

	return (
		<ComboboxPopover className={`${styles.suggestionPopover}`} portal={false}>
			{groups?.length > 0 && (
				<fieldset className={styles.fieldset}>
					<legend className="navds-sr-only">{heading}</legend>
					<ComboboxList className={styles.list}>
						{!showFilteredSuggestionsOnly &&
							primaryGroups
								.filter((group) => filteredSuggestions.some((suggestion) => suggestion.group === group))
								.map((group) => renderGroup(group))}
						{!showFilteredSuggestionsOnly &&
							visUnderStreken &&
							secondaryGroupsInList
								.filter((group) => filteredSuggestions.some((suggestion) => suggestion.group === group))
								.map((group, index) => renderGroup(group, index === 0))}
						{showFilteredSuggestionsOnly &&
							filteredSuggestions.map((suggestion) => (
								<Checkbox
									key={suggestion.value}
									className={styles.suggestionCheckbox}
									value={suggestion.value}
									onClick={() => onSelect(suggestion.value)}
									checked={selectedSuggestionValues.includes(suggestion.value)}
								>
									{suggestion.label}
								</Checkbox>
							))}
					</ComboboxList>
				</fieldset>
			)}
			{!groups && (
				<fieldset className={styles.fieldset}>
					<legend className="navds-sr-only">{heading}</legend>
					<ComboboxList className={styles.list}>
						{!showFilteredSuggestionsOnly &&
							suggestions.map((suggestion) => (
								<Checkbox
									key={suggestion.value}
									className={styles.suggestionCheckbox}
									value={suggestion.value}
									onClick={() => onSelect(suggestion.value)}
									checked={selectedSuggestionValues.includes(suggestion.value)}
								>
									{suggestion.label}
								</Checkbox>
							))}
						{showFilteredSuggestionsOnly &&
							filteredSuggestions.map((suggestion) => (
								<Checkbox
									key={suggestion.value}
									className={styles.suggestionCheckbox}
									value={suggestion.value}
									onClick={() => onSelect(suggestion.value)}
									checked={selectedSuggestionValues.includes(suggestion.value)}
								>
									{suggestion.label}
								</Checkbox>
							))}
					</ComboboxList>
				</fieldset>
			)}
			<p className={styles.popoverButtonWrapper}>
				{hasSecondaryGroups && !showFilteredSuggestionsOnly && (
					<Button onClick={() => setVisUnderStreken(!visUnderStreken)} variant="tertiary" size="small" type="button">
						{visUnderStreken ? 'Skjul valg under streken' : 'Vis alle valg'}
					</Button>
				)}
				<Button
					onClick={() => {
						setIsPopoverOpen(false);
					}}
					variant="tertiary"
					size="small"
					type="button"
				>
					Lukk
				</Button>
			</p>
		</ComboboxPopover>
	);
};

export default SuggestionList;

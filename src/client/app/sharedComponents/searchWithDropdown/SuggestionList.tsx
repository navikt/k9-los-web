import { useEffect } from 'react';
import { ComboboxList, ComboboxPopover } from '@reach/combobox';
import { Button, Checkbox } from '@navikt/ds-react';
import SelectCheckbox from '../SelectCheckbox';
import * as styles from './searchWithDropdown.module.css';

const SuggestionList = ({
	groups,
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
	useEffect(() => {
		updateSelection(selectedSuggestionValues);
	}, [selectedSuggestionValues]);
	const groupHasSelectedSuggestions = (group) =>
		selectedSuggestionValues.some((suggestionValue) => getSuggestion(suggestionValue)?.group === group);

	const groupIsOpen = (group) => openSuggestionGroups.includes(group);

	return (
		<ComboboxPopover className={`${styles.suggestionPopover}`} portal={false}>
			{groups?.length > 0 && (
				<fieldset className={styles.fieldset}>
					<legend className="navds-sr-only">{heading}</legend>
					<ComboboxList className={styles.list}>
						{!showFilteredSuggestionsOnly &&
							groups
								.filter((group) => filteredSuggestions.some((suggestion) => suggestion.group === group))
								.map((group) => {
									const suggestionsInThisGroup = suggestions.filter((suggestion) => suggestion?.group === group);
									const numberOfSelectedItemsInGroup = selectedSuggestionValues.filter(
										(suggestionValue) => getSuggestion(suggestionValue).group === group,
									).length;

									return (
										<li key={group}>
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
								})}
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

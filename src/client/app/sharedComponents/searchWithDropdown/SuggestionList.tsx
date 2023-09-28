import React from 'react';
import { ComboboxList, ComboboxPopover } from '@reach/combobox';
import { Button, Checkbox, Heading } from '@navikt/ds-react';
import SelectCheckbox from '../SelectCheckbox';
import styles from './searchWithDropdown.css';

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
	addButtonText,
	openSuggestionGroups,
	setIsPopoverOpen,
	getSuggestion,
}) => {
	const groupHasSelectedSuggestions = (group) =>
		selectedSuggestionValues.some((suggestionValue) => getSuggestion(suggestionValue).group === group);

	const groupIsOpen = (group) => openSuggestionGroups.includes(group);

	return (
		<ComboboxPopover className={`${styles.suggestionPopover}`} portal={false}>
			{groups?.length > 0 && (
				<>
					<Heading className={styles.listHeading} level="3" size="xsmall">
						Grupper
					</Heading>
					<fieldset className={styles.fieldset}>
						<legend className="navds-sr-only">{heading}</legend>
						<ComboboxList className={styles.list}>
							{!showFilteredSuggestionsOnly &&
								groups
									.filter((group) => filteredSuggestions.some((suggestion) => suggestion.group === group))
									.map((group) => {
										const suggestionsInThisGroup = suggestions.filter((suggestion) => suggestion.group === group);
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
				</>
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
						updateSelection(selectedSuggestionValues);
						setIsPopoverOpen(false);
					}}
					variant="primary"
					size="medium"
					type="button"
				>
					{addButtonText}
				</Button>
			</p>
		</ComboboxPopover>
	);
};

export default SuggestionList;

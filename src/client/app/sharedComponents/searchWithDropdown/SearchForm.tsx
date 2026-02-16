import React from 'react';
import { Combobox, ComboboxInput } from '@reach/combobox';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { BodyShort, Label } from '@navikt/ds-react';
import * as styles from './searchWithDropdown.css';

interface SearchFormProps {
	label: string;
	showLabel?: boolean;
	description?: string;
	inputId: string;
	descriptionId: string;
	currentInput: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	setIsPopoverOpen: (open: boolean) => void;
	isPopoverOpen: boolean;
	children?: React.ReactNode;
	onSelect: (value: string) => void;
	size?: 'small' | 'medium';
}

const SearchForm: React.FC<SearchFormProps> = ({
	label,
	description,
	inputId,
	descriptionId,
	currentInput,
	onChange,
	setIsPopoverOpen,
	isPopoverOpen,
	onSelect,
	children,
	showLabel = false,
	size = 'small',
}) => {
	const comboboxSize = size === 'medium' ? '3rem' : '2rem';
	return (
		<div className={styles.form}>
			<div className={showLabel ? 'mb-2' : ''}>
				<Label htmlFor={inputId} size={size} className={`${showLabel ? '' : 'aksel-sr-only'}`}>
					{label}
				</Label>
			</div>
			{description && (
				<BodyShort size={size} as="div" id={descriptionId} className="aksel-form-field__description">
					{description}
				</BodyShort>
			)}
			<Combobox className={`aksel-search__wrapper ${styles.searchWrapper}`} onSelect={onSelect} openOnFocus>
				<div className="flex">
					<div className="aksel-search__wrapper-inner">
						<ComboboxInput
							id={inputId}
							autoComplete="off"
							aria-describedby={descriptionId}
							className="aksel-search__input aksel-search__input--secondary aksel-text-field__input aksel-body-short aksel-body--small py-0"
							style={{ minHeight: comboboxSize }}
							onChange={onChange}
							value={currentInput}
							onFocus={() => setIsPopoverOpen(true)}
						/>
					</div>
					<button
						type="button"
						className={`${styles.searchButton} aksel-button aksel-button--primary aksel-button--medium aksel-button--icon-only p-1`}
						style={{ minWidth: comboboxSize, minHeight: comboboxSize }}
						onClick={() => {
							const comboboxInput = document.getElementById(inputId) as HTMLInputElement;
							if (isPopoverOpen) {
								comboboxInput?.blur();
								setIsPopoverOpen(false);
							} else {
								comboboxInput?.focus();
								setIsPopoverOpen(true);
							}
						}}
						aria-label="search button"
					>
						<span className="aksel-button__icon">
							<MagnifyingGlassIcon />
						</span>
					</button>
				</div>
				<div className="relative w-full">{children}</div>
			</Combobox>
		</div>
	);
};

export default SearchForm;

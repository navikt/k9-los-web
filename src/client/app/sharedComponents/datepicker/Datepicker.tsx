import React, { Component } from 'react';
import moment from 'moment';
import { Input } from 'nav-frontend-skjema';
import { DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import CalendarOverlay from './CalendarOverlay';
import CalendarToggleButton from './CalendarToggleButton';
import * as styles from './datepicker.module.css';

interface DatepickerProps {
	label?: React.ReactNode;
	placeholder?: string;
	onChange(...args: unknown[]): unknown;
	onBlur(...args: unknown[]): unknown;
	value?: string;
	feil?: {
		feilmelding?: string;
	};
	disabled?: boolean;
}

/**
 * @deprecated
 */
class Datepicker extends Component<DatepickerProps> {
	constructor() {
		super();
		this.state = { showCalendar: false };
		this.handleInputRef = this.handleInputRef.bind(this);
		this.handleButtonRef = this.handleButtonRef.bind(this);
		this.handleUpdatedRefs = this.handleUpdatedRefs.bind(this);
		this.toggleShowCalendar = this.toggleShowCalendar.bind(this);
		this.hideCalendar = this.hideCalendar.bind(this);
		this.elementIsCalendarButton = this.elementIsCalendarButton.bind(this);
		this.handleDayChange = this.handleDayChange.bind(this);
	}

	handleButtonRef(buttonRef) {
		if (buttonRef) {
			this.buttonRef = buttonRef;
			this.handleUpdatedRefs();
		}
	}

	handleInputRef(inputRef) {
		if (inputRef) {
			this.inputRef = inputRef;
			this.handleUpdatedRefs();
		}
	}

	handleUpdatedRefs() {
		const { inputRef, buttonRef } = this;
		if (inputRef) {
			this.setState({
				inputOffsetTop: inputRef.offsetTop,
				inputOffsetWidth: inputRef.offsetWidth,
			});
			if (buttonRef) {
				inputRef.style.paddingRight = `${buttonRef.offsetWidth}px`;
			}
		}
	}

	handleDayChange(selectedDay) {
		if (selectedDay) {
			const parsed = moment(selectedDay);
			if (parsed.isValid()) {
				const { onChange } = this.props;
				onChange(parsed.format(DDMMYYYY_DATE_FORMAT));
				this.setState({ showCalendar: false });
				this.inputRef.focus();
			}
		}
	}

	toggleShowCalendar() {
		const { showCalendar } = this.state;
		this.setState({ showCalendar: !showCalendar });
	}

	hideCalendar() {
		this.setState({ showCalendar: false });
	}

	elementIsCalendarButton(element) {
		return element === this.buttonRef;
	}

	render() {
		const { label, placeholder, onChange, onBlur, value, feil, disabled } = this.props;
		const { inputOffsetTop, inputOffsetWidth, showCalendar } = this.state;

		return (
			<>
				<div className={styles.inputWrapper}>
					<Input
						className={styles.dateInput}
						inputRef={this.handleInputRef}
						autoComplete="off"
						bredde="S"
						placeholder={placeholder}
						label={label}
						onChange={onChange}
						onBlur={onBlur}
						value={value || ''}
						feil={feil}
						disabled={disabled}
					/>
					<CalendarToggleButton
						inputOffsetTop={inputOffsetTop}
						inputOffsetWidth={inputOffsetWidth}
						className={styles.calendarToggleButton}
						toggleShowCalendar={this.toggleShowCalendar}
						buttonRef={this.handleButtonRef}
						disabled={disabled}
					/>
				</div>
				{showCalendar && (
					<CalendarOverlay
						disabled={disabled}
						value={value}
						onDayChange={this.handleDayChange}
						onClose={this.hideCalendar}
						elementIsCalendarButton={this.elementIsCalendarButton}
						className={styles.calendarRoot}
						dayPickerClassName={styles.calendarWrapper}
					/>
				)}
			</>
		);
	}
}

Datepicker.defaultProps = {
	label: '',
	placeholder: 'dd.mm.åååå',
	value: '',
	feil: null,
	disabled: false,
};

export default Datepicker;

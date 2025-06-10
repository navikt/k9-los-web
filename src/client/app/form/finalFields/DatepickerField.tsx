import React, { FunctionComponent } from 'react';
import { Field } from 'react-final-form';
import moment from 'moment';
import Datepicker from 'sharedComponents/datepicker/Datepicker';
import { ACCEPTED_DATE_INPUT_FORMATS, DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from 'utils/formats';
import { LabelType } from './Label';
import ReadOnlyField from './ReadOnlyField';
import renderNavField from './renderNavField';

const composeValidators = (validators) => (value) =>
	validators.reduce((error, validator) => error || validator(value), undefined);

const isoToDdMmYyyy = (string) => {
	const parsedDate = moment(string, ISO_DATE_FORMAT, true);
	if (parsedDate.isValid()) {
		return parsedDate.format(DDMMYYYY_DATE_FORMAT);
	}
	return string;
};

const acceptedFormatToIso = (string) => {
	const validDate = ACCEPTED_DATE_INPUT_FORMATS.map((format) => moment(string, format, true)).find((parsedDate) =>
		parsedDate.isValid(),
	);
	if (validDate) {
		return validDate.format(ISO_DATE_FORMAT);
	}
	return string;
};

export const RenderDatepickerField = renderNavField(Datepicker);

interface OwnProps {
	name: string;
	label?: LabelType;
	readOnly?: boolean;
	format?: (value: string) => string;
	parse?: (value: string) => string;
	isEdited?: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	validate?: ((text: any) => { id: string }[])[];
	onBlurValidation?: boolean;
	onBlur?: (any) => void;
	alwaysShowCalendar?: boolean;
	disabledDays?: {
		before?: Date;
		after?: Date;
	};
}

/**
 * @deprecated
 */
const DatepickerField: FunctionComponent<OwnProps> = ({
	name,
	label = '',
	readOnly,
	format = (value) => value,
	parse = (value) => value,
	isEdited,
	validate,
	...otherProps
}) => (
	<Field
		name={name}
		validate={validate ? composeValidators(validate) : undefined}
		// @ts-expect-error deprecated, fikser ikke
		component={readOnly ? ReadOnlyField : RenderDatepickerField}
		label={label}
		{...otherProps}
		format={(value) => isoToDdMmYyyy(format(value))}
		parse={(value) => parse(acceptedFormatToIso(value))}
		readOnly={readOnly}
		readOnlyHideEmpty
		isEdited={isEdited}
	/>
);

export default DatepickerField;

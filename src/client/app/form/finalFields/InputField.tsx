import React, { FunctionComponent } from 'react';
import { Field } from 'react-final-form';
import { Input as NavInput } from 'nav-frontend-skjema';
import { LabelType } from './Label';
import ReadOnlyField from './ReadOnlyField';
import renderNavField from './renderNavField';

const renderNavInput = renderNavField(NavInput);

const composeValidators = (validators) => (value) =>
	validators.reduce((error, validator) => error || validator(value), undefined);

interface OwnProps {
	name: string;
	type?: string;
	label?: LabelType;
	validate?:
		| ((text: any) => ({ id: string; text?: string } | { text: any; id?: string })[])[]
		| { length: any; id?: string };
	readOnly?: boolean;
	isEdited?: boolean;
	className?: string;
	placeholder?: string;
	onBlurValidation?: boolean;
	bredde?: string;
	parse?: (value: string) => string;
	autoFocus?: boolean;
}

const InputField: FunctionComponent<OwnProps> = ({
	name,
	type = 'text',
	label = '',
	validate = [],
	readOnly = false,
	isEdited = false,
	...otherProps
}) => (
	<Field
		name={name}
		validate={composeValidators(validate)}
		// @ts-ignore
		component={readOnly ? ReadOnlyField : renderNavInput}
		type={type}
		label={label}
		{...otherProps}
		readOnly={readOnly}
		readOnlyHideEmpty
		isEdited={isEdited}
		autoComplete="off"
	/>
);

export default InputField;

import React, { FunctionComponent, ReactNode } from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import EtikettFokus from 'nav-frontend-etiketter';
import { Textarea as NavTextarea } from 'nav-frontend-skjema';
import { LabelType } from './Label';
import ReadOnlyField from './ReadOnlyField';
import renderNavField from './renderNavField';
import * as styles from './textAreaField.css';

const composeValidators = (validators) => (value) =>
	validators ? validators.reduce((error, validator) => error || validator(value), undefined) : [];

interface TextAreaWithBadgeProps {
	badges?: {
		textId: string;
		type: 'suksess' | 'info' | 'advarsel' | 'fokus';
		title: string;
	}[];
	label: ReactNode;
	value: string;
	onChange: (...args: any[]) => any;
}

const TextAreaWithBadge: FunctionComponent<TextAreaWithBadgeProps & WrappedComponentProps> = ({
	badges,
	intl,
	label,
	value,
	onChange,
	...otherProps
}) => (
	<div className={badges ? styles.textAreaFieldWithBadges : null}>
		{badges && (
			<div className={styles.etikettWrapper}>
				{badges.map(({ textId, type, title }) => (
					<EtikettFokus key={textId} type={type} title={intl.formatMessage({ id: title })}>
						<FormattedMessage id={textId} />
					</EtikettFokus>
				))}
			</div>
		)}
		<NavTextarea label={label} value={value} onChange={onChange} {...otherProps} />
	</div>
);


const renderNavTextArea = renderNavField(injectIntl(TextAreaWithBadge));

interface OwnProps {
	name: string;
	label: LabelType;
	validate?: (
		| ((text: any) => ({ id: string; length?: number } | { length: any; id?: string })[])
		| ((value: any) => { id: string }[])
		| ((text: any) => ({ id: string; text?: string } | { text: any; id?: string })[])
	)[];
	readOnly?: boolean;
	maxLength?: number;
}

const TextAreaField: FunctionComponent<OwnProps> = ({ name, label, validate, readOnly, ...otherProps }) => (
	<Field
		name={name}
		validate={composeValidators(validate)}
		// @ts-ignore
		component={readOnly ? ReadOnlyField : renderNavTextArea}
		label={label}
		{...otherProps}
		readOnly={readOnly}
		readOnlyHideEmpty
		autoComplete="off"
		type="textarea"
	/>
);

TextAreaField.defaultProps = {
	readOnly: false,
};

export default TextAreaField;

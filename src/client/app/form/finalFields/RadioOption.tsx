/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { CSSProperties, FunctionComponent, ReactNode } from 'react';
import { Radio as NavRadio } from 'nav-frontend-skjema';
import { BodyShort } from '@navikt/ds-react';
import Label, { LabelType } from './Label';

interface OwnProps {
	name?: string;
	label: LabelType;
	value: any;
	actualValue?: any;
	className?: string;
	disabled?: boolean;
	groupDisabled?: boolean;
	onChange?: (any) => void;
	children?: ReactNode | ReactNode[];
	style?: CSSProperties;
	manualHideChildren?: boolean;
}

/**
 * @deprecated
 */

export const RadioOption: FunctionComponent<OwnProps> = ({
	name = '',
	className = '',
	label,
	value,
	actualValue,
	disabled,
	groupDisabled,
	onChange = () => undefined,
	children,
	style,
	manualHideChildren,
}) => {
	const stringifiedValue = JSON.stringify(value);
	const actualStringifiedValue = JSON.stringify(actualValue);
	const checked = stringifiedValue === actualStringifiedValue;
	return (
		<div style={style}>
			<NavRadio
				name={name}
				className={className}
				label={<Label input={label} typographyElement={BodyShort} />}
				value={value}
				checked={checked}
				disabled={disabled || groupDisabled}
				onChange={() => onChange(value)}
			/>
			{(checked || manualHideChildren) && children}
		</div>
	);
};

RadioOption.displayName = 'RadioOption';

export default RadioOption;

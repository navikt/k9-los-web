import React, { FunctionComponent } from 'react';
import { PersonPencilIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';
import Label, { LabelType } from './Label';
import * as styles from './readOnlyField.css';

const hasValue = (value) => value !== undefined && value !== null && value !== '';

interface OwnProps {
	label?: LabelType;
	input: {
		value?: string | number;
	};
	isEdited?: boolean;
}

/**
 * @deprecated
 */
export const ReadOnlyField: FunctionComponent<OwnProps> = ({ label, input, isEdited }) => {
	if (!hasValue(input.value)) {
		return null;
	}
	return (
		<div className={styles.readOnlyContainer}>
			<Label input={label} readOnly />
			<BodyShort size="small" className={styles.readOnlyContent}>
				{input.value}
				{isEdited && <PersonPencilIcon />}
			</BodyShort>
		</div>
	);
};


export default ReadOnlyField;

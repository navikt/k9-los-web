import React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';

interface DateTimeLabelProps {
	dateTimeString: string;
}

/**
 * DateTimeLabel
 *
 * Presentasjonskomponent. Formaterer dato til formatet dd.mm.yyyy - hh:mm.
 *
 * Eksempel:
 * ```html
 * <DateTimeLabel dateTimeString="2017-08-02T00:54:25.455" />
 * ```
 */
const DateTimeLabel = ({ dateTimeString }: DateTimeLabelProps) => (
	<div>
		<FormattedDate day="2-digit" month="2-digit" year="numeric" value={new Date(dateTimeString)} />
		{' - '}
		<FormattedTime value={new Date(dateTimeString)} />
	</div>
);

export default DateTimeLabel;

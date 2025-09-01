import { FunctionComponent, useMemo } from 'react';
import { IntlShape, WrappedComponentProps, injectIntl } from 'react-intl';
import { XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Button } from '@navikt/ds-react';
import EventType from 'api/rest-api/src/requestApi/eventType';
import decodeHtmlEntity from 'utils/decodeHtmlEntityUtils';
import * as styles from './errorMessagePanel.module.css';

export const getErrorMessageList = (
	intl: IntlShape,
	queryStrings: { errorcode?: string; errormessage?: string },
	allErrorMessages = [],
): string[] => {
	const errorMessages = [];
	if (queryStrings.errorcode) {
		errorMessages.push(intl.formatMessage({ id: queryStrings.errorcode }));
	}
	if (queryStrings.errormessage) {
		errorMessages.push(queryStrings.errormessage);
	}
	allErrorMessages.forEach((message) =>
		errorMessages.push(message.code ? intl.formatMessage({ id: message.code }, message.params) : message.text),
	);
	return errorMessages;
};

interface OwnProps {
	errorMessages?: {
		type: EventType;
		code?: string;
		params?: {
			errorDetails?: string;
			location?: string;
		};
		text?: string;
	}[];
	queryStrings: {
		errormessage?: string;
		errorcode?: string;
	};
	removeErrorMessages: () => void;
}

/**
 * ErrorMessagePanel
 *
 * Presentasjonskomponent. Definerer hvordan feilmeldinger vises.
 */
const ErrorMessagePanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
	intl,
	errorMessages,
	queryStrings,
	removeErrorMessages,
}) => {
	const feilmeldinger = useMemo(
		() => getErrorMessageList(intl, queryStrings, errorMessages),
		[queryStrings, errorMessages],
	);

	if (feilmeldinger.length === 0) {
		return null;
	}

	return (
		<div className={styles.container}>
			{feilmeldinger.length !== 0 &&
				feilmeldinger.map((message) => <BodyShort key={message}>{`${decodeHtmlEntity(message)} `}</BodyShort>)}

			<div className={styles.lukkContainer}>
				<Button
					size="small"
					variant="tertiary-neutral"
					className="text-white hover:bg-gray-200 hover:text-black hover:shadow-md"
					icon={<XMarkIcon />}
					onClick={removeErrorMessages}
				>
					{intl.formatMessage({ id: 'ErrorMessagePanel.Close' })}
				</Button>
			</div>
		</div>
	);
};

export default injectIntl(ErrorMessagePanel);

import { FormattedMessage } from 'react-intl';
import { BodyShort } from '@navikt/ds-react';
import DateLabel from 'sharedComponents/DateLabel';
import * as styles from './aldervisning.module.css';

interface AlderVisningProps {
	doedsdato?: string;
}

/**
 * AlderVisning
 *
 * Presentasjonskomponent. Definerer visning av personens alder. (Søker)
 */
const AlderVisning = ({ doedsdato }: AlderVisningProps) => (
	<BodyShort size="small" className={styles.displayInline}>
		{doedsdato ? <DateLabel dateString={doedsdato} /> : <FormattedMessage id="Person.ManglerDodsdato" />}
	</BodyShort>
);

AlderVisning.defaultProps = {
	doedsdato: '',
};

export default AlderVisning;

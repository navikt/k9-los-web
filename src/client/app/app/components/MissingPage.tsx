import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Panel from 'nav-frontend-paneler';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import styles from './missingPage.css';

/**
 * MissingPage
 *
 * Presentasjonskomponent. Denne komponenten vises når den NAV-ansatte prøver å aksessere en url som ikke finnes.
 * Det blir presentert en generell feilmelding og en lenke som tar NAV-ansatt tilbake til hovedsiden.
 */
const MissingPage: FunctionComponent = () => (
	<Panel className={styles.container}>
		<Undertittel>
			<FormattedMessage id="MissingPage.PageIsMissing" />
		</Undertittel>
		<Normaltekst>
			<Link to="/">
				<FormattedMessage id="MissingPage.Home" />
			</Link>
		</Normaltekst>
	</Panel>
);

export default MissingPage;

import { FormattedMessage } from 'react-intl';
import Panel from 'nav-frontend-paneler';
import { Heading } from '@navikt/ds-react';
import * as styles from './ikkeTilgangTilAvdelingslederPanel.module.css';

/**
 * IkkeTilgangTilAvdelingslederPanel
 */
const IkkeTilgangTilAvdelingslederPanel = () => (
	<Panel className={styles.container}>
		<Heading size="small">
			<FormattedMessage id="IkkeTilgangTilAvdelingslederPanel.HarIkkeTilgang" />
		</Heading>
	</Panel>
);

export default IkkeTilgangTilAvdelingslederPanel;

import React from 'react';
import Panel from 'nav-frontend-paneler';
import { Heading } from '@navikt/ds-react';
import * as styles from './ikkeTilgang.css';

const IkkeTilgang = () => (
	<Panel className={styles.container}>
		<Heading size="small">Du har ikke tilgang til å bruke dette programmet</Heading>
	</Panel>
);

export default IkkeTilgang;

import { Box, Heading } from '@navikt/ds-react';
import styles from './ikkeTilgang.module.css';

const IkkeTilgang = () => (
	<Box background="raised" borderRadius="4" padding="space-16" className={styles.container}>
		<Heading size="small">Du har ikke tilgang til å bruke dette programmet</Heading>
	</Box>
);

export default IkkeTilgang;

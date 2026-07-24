import React from 'react';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import styles from './HastesakIkon.module.css';

export function HastesakIkon() {
	return (
		<ExclamationmarkTriangleFillIcon title="Hastesak" height="1.5rem" width="1.5rem" className={styles.hastesakIkon} />
	);
}

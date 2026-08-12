import { CopyButton } from '@navikt/ds-react';
import type { FunctionComponent, ReactNode } from 'react';
import styles from './kopierbarVerdi.module.css';

/**
 * Rendrer en verdi der en kopiknapp vises ved hover/fokus. Knappen er
 * alltid i DOM-en (bare usynlig), slik at rad- og kolonnehøyde ikke
 * endrer seg når den dukker opp.
 */
interface Props {
	copyText: string;
	title: string;
	children: ReactNode;
}

const KopierbarVerdi: FunctionComponent<Props> = ({ copyText, title, children }) => (
	<span className={styles.wrapper}>
		<span className={styles.innhold}>{children}</span>
		<span className={styles.knapp}>
			<CopyButton copyText={copyText} title={title} size="xsmall" />
		</span>
	</span>
);

export default KopierbarVerdi;

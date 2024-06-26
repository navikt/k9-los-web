import React, { FunctionComponent, ReactNode } from 'react';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import * as styles from './labelWithHeader.css';

interface OwnProps {
	header: string | ReactNode;
	texts: string[];
}

/**
 * LabelWithHeader
 *
 * Presentasjonskomponent. Presenterer tekst med en overskrift. (På samme måte som input-felter med overskrifter)
 */
const LabelWithHeader: FunctionComponent<OwnProps> = ({ header, texts }) => (
	<div className={styles.container}>
		<Undertekst>{header}</Undertekst>
		<div className={styles.text}>
			{texts.map((text) => (
				<Normaltekst key={text}>{text}</Normaltekst>
			))}
		</div>
	</div>
);

export default LabelWithHeader;

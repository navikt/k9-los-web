import React, { FunctionComponent, ReactNode } from 'react';
import { BodyShort, Detail } from '@navikt/ds-react';
import * as styles from './labelWithHeader.css';

interface OwnProps {
	header: string | ReactNode;
	texts: string[];
}

/**
 * LabelWithHeader
 * @deprecated
 * Presentasjonskomponent. Presenterer tekst med en overskrift. (På samme måte som input-felter med overskrifter)
 */
const LabelWithHeader: FunctionComponent<OwnProps> = ({ header, texts }) => (
	<div className={styles.container}>
		<Detail>{header}</Detail>
		<div className={styles.text}>
			{texts.map((text) => (
				<BodyShort size="small" key={text}>
					{text}
				</BodyShort>
			))}
		</div>
	</div>
);

export default LabelWithHeader;

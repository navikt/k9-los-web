import React, { FunctionComponent } from 'react';
import * as styles from './enkelTeller.css';

interface OwnProps {
	antall: number;
	tekst: string | React.ReactNode;
}
const EnkelTeller: FunctionComponent<OwnProps> = ({ antall, tekst }) => (
	<div className={styles.frame}>
		<div>
			<div>
				<p className={styles.number}>{antall}</p>
			</div>
			<hr className={styles.line} />
		</div>
		<div className={styles.beskrivelse}>
			<p>{tekst}</p>
		</div>
	</div>
);

export default EnkelTeller;

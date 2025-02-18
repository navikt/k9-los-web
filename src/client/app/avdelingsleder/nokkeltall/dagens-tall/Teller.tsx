import React, { FunctionComponent } from 'react';
import * as styles from './teller.css';

interface OwnProps {
	forklaring: string;
	venstreTall: number;
	hoyreTall: number;
}
const Teller: FunctionComponent<OwnProps> = ({ forklaring, venstreTall, hoyreTall }) => (
	<div className={styles.frame}>
		<div className={styles.container}>
			<div>
				<p className={styles.beskrivelse}>Inngang</p>
				<div className={styles.field}>
					<p className={styles.number}>{venstreTall}</p>
				</div>
			</div>
			<div className={styles.vl}> </div>
			<div>
				<p className={styles.beskrivelse}>Ferdigstilt</p>
				<div className={styles.coloredField}>
					<p className={styles.number}>{hoyreTall}</p>
				</div>
			</div>
		</div>
		<div className={styles.forklaring}>
			<p>{forklaring}</p>
		</div>
	</div>
);

export default Teller;

import React, { FunctionComponent } from 'react';
import * as styles from './teller3.css';

interface OwnProps {
	forklaring: string;
	inngang: number;
	manuelleFerdigstilt: number;
	automatiskeFerdigstilt: number;
}

const Teller: FunctionComponent<OwnProps> = ({ forklaring, inngang, manuelleFerdigstilt, automatiskeFerdigstilt }) => {
	const totaltFerdigstilt = manuelleFerdigstilt + automatiskeFerdigstilt;

	return (
		<div className={styles.ramme}>
			<div className={styles.forklaring}>
				<p>{forklaring}</p>
			</div>
			<div className={styles.container}>
				<div className={styles.tallramme}>
					<p className={styles.beskrivelse}>Inngang</p>
					<div className={styles.felt}>
						<p className={styles.tall}>{inngang}</p>
					</div>
				</div>
				<div className={styles.bredTallramme}>
					<p className={styles.beskrivelse}>Ferdigstilt</p>
					<div className={styles.fargetFelt}>
						<p className={styles.tall}>{totaltFerdigstilt}</p>
					</div>
					<div className={styles.nedbrytning}>
						<span className={styles.nedbrytningsElement}>{`${manuelleFerdigstilt} manuelt`}</span>
						<span className={styles.nedbrytningsElement}>{`${automatiskeFerdigstilt} automatisk`}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Teller;

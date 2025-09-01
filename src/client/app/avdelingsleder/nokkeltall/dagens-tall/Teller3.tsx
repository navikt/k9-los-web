import React, { FunctionComponent } from 'react';
import * as styles from './teller3.module.css';

interface OwnProps {
	forklaring: string;
	inngang: number;
	manuelleFerdigstilt: number;
	automatiskeFerdigstilt: number;
}

const Teller: FunctionComponent<OwnProps> = ({ forklaring, inngang, manuelleFerdigstilt, automatiskeFerdigstilt }) => {
	const totaltFerdigstilt = manuelleFerdigstilt + automatiskeFerdigstilt;

	const nedbrytningsDeler = (() => {
		const deler = [];
		// Kan eventuelt sjekke antallet, og kun vise de som er > 0
		deler.push(<>{manuelleFerdigstilt} manuelt</>);
		deler.push(<>{automatiskeFerdigstilt} automatisk</>);
		return deler;
	})();

	return (
		<div className={styles.ramme}>
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
					{nedbrytningsDeler.length > 0 && (
						<div className={styles.nedbrytning}>
							{nedbrytningsDeler.map((del) => (
								<span key={del} className={styles.nedbrytningsElement}>
									{del}
								</span>
							))}
						</div>
					)}
				</div>
			</div>
			<div className={styles.forklaring}>
				<p>{forklaring}</p>
			</div>
		</div>
	);
};

export default Teller;

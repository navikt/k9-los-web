import React, { FunctionComponent } from 'react';
import { RobotSmileIcon } from '@navikt/aksel-icons';
import { FigureIcon } from '@navikt/aksel-icons';
import * as styles from './teller3.css';

interface OwnProps {
	forklaring: string;
	inngang: number;
	manuelleFerdigstilt: number;
	automatiskeFerdigstilt: number;
}

const Teller: FunctionComponent<OwnProps> = ({ forklaring, inngang, manuelleFerdigstilt, automatiskeFerdigstilt }) => {
	const totaltFerdigstilt = manuelleFerdigstilt + automatiskeFerdigstilt;

	// Generer nedbrytning tekst basert på hvilke verdier som finnes
	const lagNedbrytning = () => {
		const deler = [];
		if (manuelleFerdigstilt > 0) {
			deler.push(<>{manuelleFerdigstilt} manuelt</>);
		}
		if (automatiskeFerdigstilt > 0) {
			deler.push(<>{automatiskeFerdigstilt} automatisk</>);
		}
		return deler;
	};

	const nedbrytningsDeler = lagNedbrytning();

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

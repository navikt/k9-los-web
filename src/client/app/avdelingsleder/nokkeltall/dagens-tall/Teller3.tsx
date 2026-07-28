import { FunctionComponent } from 'react';
import { DagensTallSerie } from 'api/queries/avdelingslederQueries';
import styles from './teller3.module.css';

interface OwnProps {
	forklaring: string;
	tall: DagensTallSerie;
}

const Teller: FunctionComponent<OwnProps> = ({ forklaring, tall }) => {
	const { first: inngang, second: ferdigstilt } = tall;
	return (
		<div className={styles.ramme}>
			<div className={styles.forklaring}>
				<p>{forklaring}</p>
			</div>
			<div className={styles.container}>
				<div className={styles.tallramme}>
					<p className={styles.beskrivelse}>{inngang.hovedtall.visningsnavn}</p>
					<div className={styles.felt}>
						<p className={styles.tall}>{inngang.hovedtall.verdi}</p>
					</div>
				</div>
				<div className={styles.bredTallramme}>
					<p className={styles.beskrivelse}>{ferdigstilt.hovedtall.visningsnavn}</p>
					<div className={styles.fargetFelt}>
						<p className={styles.tall}>{ferdigstilt.hovedtall.verdi}</p>
					</div>
					<div className={styles.nedbrytning}>
						{ferdigstilt.linjer.map((linje) => {
							return (
								<span
									className={styles.nedbrytningTekst}
									key={linje.visningsnavn}
								>{`${linje.verdi} ${linje.visningsnavn}`}</span>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Teller;

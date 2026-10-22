import type { InngangOgFerdigstilteDto } from 'api/generated/los.schemas';
import styles from 'avdelingsleder/nokkeltall/dagens-tall/teller3.module.css';

export default function Teller({
	forklaring,
	tall,
}: {
	forklaring: string;
	tall: InngangOgFerdigstilteDto['serier'][string];
}) {
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
						{ferdigstilt.linjer.map((linje) => (
							<span className={styles.nedbrytningTekst} key={linje.visningsnavn}>
								{`${linje.verdi} ${linje.visningsnavn}`}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

import React, { FunctionComponent } from 'react';
import * as styles from './teller3.css';

interface OwnProps {
	forklaring: string;
	venstreTall: number;
	hoyreTall: number;
	hoyreAndreTall: number;
}
const Teller: FunctionComponent<OwnProps> = ({ forklaring, venstreTall, hoyreTall, hoyreAndreTall }) => (
	<div className={styles.frame}>
		<div className={styles.container}>
			<div className={styles.tallramme}>
				<p className={styles.beskrivelse}>Inngang</p>
				<div className={styles.field}>
					<p className={styles.number}>{venstreTall}</p>
				</div>
			</div>
			{/* {hoyreTall > 0 && ( */}
			<div className={styles.tallramme}>
				<p className={styles.beskrivelse}>Ferdigstilt manuelt</p>
				<div className={styles.coloredField}>
					<p className={styles.number}>{hoyreTall}</p>
				</div>
			</div>
			{/* )} */}
			{/* {hoyreAndreTall > 0 && ( */}
			<div className={styles.tallramme}>
				<p className={styles.beskrivelse}>Ferdigstilt automatisk</p>
				<div className={styles.coloredField}>
					<p className={styles.number}>{hoyreAndreTall}</p>
				</div>
			</div>
			{/* )} */}
			{/* {hoyreTall === 0 && hoyreAndreTall === 0 && ( */}
			{/* 	<div className={styles.tallramme}> */}
			{/* 		<p className={styles.beskrivelse}>Ferdigstilt</p> */}
			{/* 		<div className={styles.coloredField}> */}
			{/* 			<p className={styles.number}>0</p> */}
			{/* 		</div> */}
			{/* 	</div> */}
			{/* )} */}
		</div>
		<div className={styles.forklaring}>
			<p>{forklaring}</p>
		</div>
	</div>
);

export default Teller;

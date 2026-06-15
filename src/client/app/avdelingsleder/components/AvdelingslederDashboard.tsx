import React, { FunctionComponent, ReactNode } from 'react';
import * as styles from './avdelingslederDashboard.css';

type OwnProps = Readonly<{
	children: ReactNode;
}>;

/**
 * AvdelingslederDashboard
 */
const AvdelingslederDashboard: FunctionComponent<OwnProps> = ({ children }) => (
	<div>
		<div className={styles.oppgaveContainer}>
			<div className={styles.gridContainer}>
				<div className={styles.leftColumn}>
					<div className={styles.avdelingslederContent}>{children}</div>
				</div>
			</div>
		</div>
	</div>
);

export default AvdelingslederDashboard;

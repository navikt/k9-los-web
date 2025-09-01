import { FunctionComponent } from 'react';
import * as styles from './avdelingslederDashboard.module.css';

type OwnProps = Readonly<{
	children: any;
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

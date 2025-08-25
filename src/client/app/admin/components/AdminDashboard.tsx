import React from 'react';
import * as styles from './adminDashboard.module.css';

interface AdminDashboardProps {
	children: React.ReactNode;
}

/**
 * AvdelingslederDashboard
 */
const AdminDashboard = ({ children }: AdminDashboardProps) => (
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

export default AdminDashboard;

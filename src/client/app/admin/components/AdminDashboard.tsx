import React from 'react';
import PropTypes from 'prop-types';
import * as styles from './adminDashboard.css';

type TsProps = Readonly<{
	children: React.ReactNode;
}>;

/**
 * AvdelingslederDashboard
 */
const AdminDashboard = ({ children }: TsProps) => (
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

AdminDashboard.propTypes = {
	children: PropTypes.node.isRequired,
};

export default AdminDashboard;

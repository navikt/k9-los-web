import React, { FunctionComponent } from 'react';

import Panel from 'nav-frontend-paneler';
import BemanningIndex from 'avdelingsleder/bemanning/BemanningIndex';
import styles from './avdelingslederDashboard.less';

type OwnProps = Readonly<{
  children: any;
  visSaksbehandlere: boolean;
}>;

/**
 * AvdelingslederDashboard
 */
const AvdelingslederDashboard: FunctionComponent<OwnProps> = ({
  children, visSaksbehandlere,
}) => (
  <div>
    <div className={styles.oppgaveContainer}>
      <div className={styles.gridContainer}>
        <div className={styles.leftColumn}>
          <div className={styles.avdelingslederContent}>
            {children}
          </div>
        </div>
        <div className={styles.rightColumn}>
          {visSaksbehandlere && (
          <>
            <BemanningIndex />
          </>
          )}

        </div>
      </div>
    </div>
  </div>
);

export default AvdelingslederDashboard;

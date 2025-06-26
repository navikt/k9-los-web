import { FunctionComponent, ReactNode } from 'react';
import * as styles from './merkelapp.module.css';

type Props = {
	children: ReactNode;
};

const Merkelapper: FunctionComponent<Props> = ({ children }) => <div className={styles.merkelapper}>{children}</div>;

export default Merkelapper;

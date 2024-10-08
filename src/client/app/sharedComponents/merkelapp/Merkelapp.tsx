import React, { FunctionComponent, ReactNode, useRef } from 'react';
import { XMarkIcon } from '@navikt/aksel-icons';
import * as styles from './merkelapp.css';

type Props = {
	onClick: () => void;
	children: ReactNode;
};

const Merkelapp: FunctionComponent<Props> = ({ onClick, children }) => {
	const buttonRef = useRef<HTMLButtonElement>(null);

	return (
		<button
			ref={buttonRef}
			onClick={onClick}
			type="button"
			className={styles.merkelapp}
			title={typeof children === 'string' ? children : undefined}
		>
			<span className={styles.tekst}>{children}</span>
			<XMarkIcon />
		</button>
	);
};

export default Merkelapp;

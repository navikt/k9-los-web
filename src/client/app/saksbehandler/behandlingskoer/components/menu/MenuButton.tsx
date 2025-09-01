import React from 'react';
import { Detail } from '@navikt/ds-react';
import * as styles from './menuButton.module.css';

interface MenuButtonProps {
	onClick(...args: unknown[]): unknown;
	children: React.ReactElement;
}

/**
 * MenuButton
 *
 * Presentasjonskomponent. Lager lenker i behandlingsmeny
 */
const MenuButton = React.forwardRef<HTMLElement, MenuButtonProps>(({ onClick, children }: MenuButtonProps, ref) => (
	<button ref={ref} className={styles.button} onClick={onClick} type="button">
		<Detail>{children}</Detail>
	</button>
));

export default MenuButton;

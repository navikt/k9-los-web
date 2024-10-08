import React, { FunctionComponent, ReactNode } from 'react';
import classnames from 'classnames/bind';
import * as styles from './tooltip.css';

const classNames = classnames.bind(styles);

interface OwnProps {
	children: ReactNode | string;
	content: ReactNode | string;
	alignLeft?: boolean;
	alignRight?: boolean;
	alignTop?: boolean;
	alignBottom?: boolean;
}

/**
 * @deprecated
 * Tooltip
 */
const Tooltip: FunctionComponent<OwnProps> = ({
	children,
	content,
	alignRight = false,
	alignLeft = false,
	alignTop = false,
	alignBottom = false,
}) => (
	<div className={styles.tooltip}>
		<span
			className={classNames(styles.tooltiptext, {
				right: alignRight || (!alignLeft && !alignTop && !alignBottom),
				left: alignLeft,
				top: alignTop,
				bottom: alignBottom,
			})}
		>
			{content}
		</span>
		{children}
	</div>
);

export default Tooltip;

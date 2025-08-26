import React from 'react';
import classnames from 'classnames/bind';
import * as styles from './flexRow.module.css';

const classNames = classnames.bind(styles);

interface FlexRowProps {
	children?: React.ReactNode | React.ReactNode[];
	/**
	 * spaceBetween: aktiverer { justify-content: space-between } på raden. Default er false.
	 */
	spaceBetween?: boolean;
	alignItemsToBaseline?: boolean;
	alignItemsToFlexEnd?: boolean;
	wrap?: boolean;
}

const FlexRow = ({ children, spaceBetween, alignItemsToBaseline, alignItemsToFlexEnd, wrap }: FlexRowProps) => (
	<div className={classNames('flexRow', { spaceBetween }, { alignItemsToBaseline }, { alignItemsToFlexEnd }, { wrap })}>
		{children}
	</div>
);

export default FlexRow;

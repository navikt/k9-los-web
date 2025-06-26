import React from 'react';
import classnames from 'classnames/bind';
import * as styles from './flexContainer.module.css';

const classNames = classnames.bind(styles);

interface FlexContainerProps {
	children?: React.ReactNode | React.ReactNode[];
	wrap?: boolean;
}

const FlexContainer = ({ children, wrap }: FlexContainerProps) => (
	<div className={classNames('flexContainer', 'fluid', { flexWrap: wrap })}>{children}</div>
);

export default FlexContainer;

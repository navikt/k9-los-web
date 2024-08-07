import React from 'react';
import classnames from 'classnames/bind';
import PropTypes from 'prop-types';
import * as styles from './flexRow.css';

const classNames = classnames.bind(styles);

const FlexRow = ({ children, spaceBetween, alignItemsToBaseline, alignItemsToFlexEnd, wrap }) => (
	<div className={classNames('flexRow', { spaceBetween }, { alignItemsToBaseline }, { alignItemsToFlexEnd }, { wrap })}>
		{children}
	</div>
);

FlexRow.propTypes = {
	children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
	/**
	 * spaceBetween: aktiverer { justify-content: space-between } på raden. Default er false.
	 */
	spaceBetween: PropTypes.bool,
	alignItemsToBaseline: PropTypes.bool,
	alignItemsToFlexEnd: PropTypes.bool,
	wrap: PropTypes.bool,
};

export default FlexRow;

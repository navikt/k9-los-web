import React from 'react';
import classnames from 'classnames/bind';
import PropTypes from 'prop-types';
import * as styles from './flexContainer.css';

const classNames = classnames.bind(styles);

const FlexContainer = ({ children, wrap }) => (
	<div className={classNames('flexContainer', 'fluid', { flexWrap: wrap })}>{children}</div>
);

FlexContainer.propTypes = {
	children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
	wrap: PropTypes.bool,
};

export default FlexContainer;

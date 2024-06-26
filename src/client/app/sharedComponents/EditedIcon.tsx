import React from 'react';
import classnames from 'classnames/bind';
import endretFelt from 'images/sharedComponents/endret_felt.svg';
import PropTypes from 'prop-types';
import Image from 'sharedComponents/Image';
import * as styles from './editedIcon.css';

const classNames = classnames.bind(styles);

/*
 * EditedIcon
 *
 * Komponent/Ikon som viser om noe i GUI er endret.
 */

const EditedIcon = ({ className }) => (
	<span className={classNames('editedIcon', className)}>
		<Image src={endretFelt} titleCode="Behandling.EditedField" altCode="Behandling.EditedField" />
	</span>
);

EditedIcon.propTypes = {
	className: PropTypes.string,
};

EditedIcon.defaultProps = {
	className: '',
};

export default EditedIcon;

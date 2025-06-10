import PropTypes from 'prop-types';

const saksbehandlerPropType = PropTypes.shape({
	brukerIdent: PropTypes.string,
	navn: PropTypes.string,
	epost: PropTypes.string.isRequired,
});

export default saksbehandlerPropType;

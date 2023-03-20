import PropTypes from 'prop-types';

const driftsmeldingPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    melding: PropTypes.string.isRequired,
    dato: PropTypes.string.isRequired,
    aktiv: PropTypes.bool.isRequired,
    aktivert: PropTypes.string,
});

export default driftsmeldingPropType;

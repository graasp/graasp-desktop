import React from 'react';
import PropTypes from 'prop-types';

const PhaseDescription = ({ description }) => (
  <div dangerouslySetInnerHTML={{ __html: description }} />
);

PhaseDescription.propTypes = {
  description: PropTypes.string,
};

PhaseDescription.defaultProps = {
  description: '',
};

export default PhaseDescription;

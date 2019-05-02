import React from 'react';
import PropTypes from 'prop-types';

const PhaseDescription = ({ description }) => {
  if (description && description !== '') {
    return <div dangerouslySetInnerHTML={{ __html: description }} />;
  }
  return null;
};

PhaseDescription.propTypes = {
  description: PropTypes.string,
};

PhaseDescription.defaultProps = {
  description: '',
};

export default PhaseDescription;

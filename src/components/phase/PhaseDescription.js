import React from 'react';
import PropTypes from 'prop-types';
import Text from '../common/Text';
import './PhaseDescription.css';

const style = {
  marginBottom: '2rem',
};

const PhaseDescription = ({ description }) => {
  if (description && description !== '') {
    return (
      <Text
        content={description}
        style={style}
        className="PhaseDescriptionText"
      />
    );
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

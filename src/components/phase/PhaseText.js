import React from 'react';
import PropTypes from 'prop-types';

const PhaseText = ({ content }) => (
  <div dangerouslySetInnerHTML={{ __html: content }} />
);

PhaseText.propTypes = {
  content: PropTypes.string,
};

PhaseText.defaultProps = {
  content: '',
};

export default PhaseText;

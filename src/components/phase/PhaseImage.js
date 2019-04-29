import React from 'react';
import PropTypes from 'prop-types';
import './PhaseImage.css';

const PhaseImage = ({ uri }) => (
  <div className="ImageDiv">
    <img src={uri} alt="No alt" className="Image" />
  </div>
);

PhaseImage.propTypes = {
  uri: PropTypes.string.isRequired,
};

export default PhaseImage;

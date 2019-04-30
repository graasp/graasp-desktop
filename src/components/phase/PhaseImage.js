import React from 'react';
import PropTypes from 'prop-types';
import './PhaseImage.css';

const PhaseImage = ({ url, asset, name }) => {
  let uri = url;
  if (asset) {
    uri = `file://${asset}`;
  }
  return (
    <div className="ImageDiv">
      <img src={uri} alt={name} className="Image" />
    </div>
  );
};

PhaseImage.propTypes = {
  url: PropTypes.string,
  asset: PropTypes.string,
  name: PropTypes.string,
};

PhaseImage.defaultProps = {
  url: null,
  asset: null,
  name: 'Image',
};

export default PhaseImage;

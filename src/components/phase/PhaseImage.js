import React from 'react';
import './PhaseImage.css';

const PhaseImage = ({ uri }) => (
  <div className="ImageDiv">
    <img src={uri} alt="No alt" className="Image" />
  </div>
);

export default PhaseImage;

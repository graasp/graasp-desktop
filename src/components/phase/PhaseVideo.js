import React from 'react';
import './PhaseVideo.css';

const PhaseVideo = ({ uri }) => (
  <div className="VideoDiv">
    <video className="Video" controls>
      <source src={uri} type="video/mp4" />
    </video>
  </div>
);

export default PhaseVideo;

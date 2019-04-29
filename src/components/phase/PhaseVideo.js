/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import PropTypes from 'prop-types';
import './PhaseVideo.css';

const PhaseVideo = ({ uri }) => (
  <div className="VideoDiv">
    <video className="Video" controls>
      <source src={uri} type="video/mp4" />
    </video>
  </div>
);

PhaseVideo.propTypes = {
  uri: PropTypes.string.isRequired,
};

export default PhaseVideo;

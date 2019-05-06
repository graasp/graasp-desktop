/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import PropTypes from 'prop-types';
import './PhaseVideo.css';

const PhaseVideo = ({ url, asset, name, mimeType }) => {
  let uri = url;
  if (asset) {
    uri = `file://${asset}`;
  }
  return (
    <video title={name} className="Video" controls>
      <source src={uri} type={mimeType} />
    </video>
  );
};

PhaseVideo.propTypes = {
  url: PropTypes.string,
  asset: PropTypes.string,
  name: PropTypes.string,
  mimeType: PropTypes.string,
};

PhaseVideo.defaultProps = {
  url: null,
  asset: null,
  name: 'Video',
  mimeType: 'video/mp4',
};

export default PhaseVideo;

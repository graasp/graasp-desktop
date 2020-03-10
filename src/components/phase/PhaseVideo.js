/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './PhaseVideo.css';

const PhaseVideo = ({ url, asset, name, mimeType, folder }) => {
  let uri = url;
  if (asset) {
    // assets with absolute paths are usually for testing
    if (asset.startsWith('/')) {
      uri = `file://${asset}`;
    } else {
      uri = `file://${folder}/${asset}`;
    }
  }

  // assign quicktime videos to mp4
  if (mimeType === 'video/quicktime') {
    // eslint-disable-next-line no-param-reassign
    mimeType = 'video/mp4';
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
  folder: PropTypes.string.isRequired,
};

PhaseVideo.defaultProps = {
  url: null,
  asset: null,
  name: 'Video',
  mimeType: 'video/mp4',
};

const mapStateToProps = ({ Authentication }) => ({
  folder: Authentication.getIn(['current', 'folder']),
});

const ConnectedComponent = connect(mapStateToProps)(PhaseVideo);

export default ConnectedComponent;

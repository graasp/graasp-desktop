import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  TEXT,
  IMAGE,
  VIDEO,
  RESOURCE,
  APPLICATION,
  IFRAME,
  DEFAULT_PROTOCOL,
} from '../../config/constants';
import PhaseText from './PhaseText';
import PhaseImage from './PhaseImage';
import PhaseVideo from './PhaseVideo';
import PhaseApp from './PhaseApp';

// prop types gets confused when dealing with helper renderers
// eslint-disable-next-line react/prop-types
const renderResource = ({ id, mimeType, content, asset, url, name }) => {
  if (mimeType === TEXT) {
    return <PhaseText key={id} id={id} content={content} />;
  }

  if (IMAGE.test(mimeType)) {
    return <PhaseImage key={id} id={id} url={url} asset={asset} name={name} />;
  }

  if (VIDEO.test(mimeType)) {
    return (
      <PhaseVideo
        key={id}
        id={id}
        url={url}
        asset={asset}
        name={name}
        mimeType={mimeType}
      />
    );
  }

  if (mimeType === IFRAME) {
    return null;
  }

  return <div key={id} id={id} />;
};

const PhaseItem = ({ item, spaceId, phaseId }) => {
  const { id, category, asset, name, appInstance, mimeType, content } = item;

  // we might need to fiddle with the url's protocol
  let { url } = item;

  // default to https urls for items to avoid electron using file:// by default
  if (_.isString(url) && url.startsWith('//')) {
    url = `${DEFAULT_PROTOCOL}:${url}`;
  }

  switch (category) {
    case RESOURCE:
      return renderResource({ id, mimeType, content, asset, url, name });

    case APPLICATION:
      return (
        <PhaseApp
          key={id}
          id={id}
          url={url}
          asset={asset}
          name={name}
          spaceId={spaceId}
          phaseId={phaseId}
          appInstance={appInstance}
        />
      );

    default:
      return <div key={id} id={id} />;
  }
};

PhaseItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    category: PropTypes.string,
    asset: PropTypes.string,
    url: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  phaseId: PropTypes.string.isRequired,
  spaceId: PropTypes.string.isRequired,
  appInstance: PropTypes.shape({
    id: PropTypes.string,
  }),
};

PhaseItem.defaultProps = {
  appInstance: null,
};

export default PhaseItem;

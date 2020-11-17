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
} from '../../../config/constants';
import PhaseText from '../../phase/PhaseText';
import PhaseApp from '../../phase/PhaseApp';
import PhaseImage from '../../phase/PhaseImage';
import PhaseVideo from '../../phase/PhaseVideo';

// prop types gets confused when dealing with helper renderers
// eslint-disable-next-line react/prop-types
const renderResource = (item) => {
  const { id, idx, mimeType, content, asset, url, name, classNames } = item;
  if (mimeType === TEXT) {
    return (
      <PhaseText key={idx} id={id} content={content} className={classNames} />
    );
  }

  if (IMAGE.test(mimeType)) {
    return (
      <PhaseImage
        key={id}
        id={id}
        url={url}
        asset={asset}
        name={name}
        className={classNames}
      />
    );
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

const SyncPhaseItem = ({ item, phaseId, spaceId }) => {
  const {
    id,
    category,
    asset,
    name,
    mimeType,
    content,
    classNames,
    appInstance,
  } = item;

  // we might need to fiddle with the url's protocol
  let { url } = item;

  // default to https urls for items to avoid electron using file:// by default
  if (_.isString(url) && url.startsWith('//')) {
    url = `${DEFAULT_PROTOCOL}:${url}`;
  }

  switch (category) {
    case RESOURCE:
      return renderResource({
        id,
        mimeType,
        content,
        asset,
        url,
        name,
        appInstance,
        classNames,
      });

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

SyncPhaseItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    category: PropTypes.string,
    asset: PropTypes.string,
    url: PropTypes.string,
    name: PropTypes.string,
    mimeType: PropTypes.string,
    content: PropTypes.string,
    classNames: PropTypes.string,
    appInstance: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
  spaceId: PropTypes.string.isRequired,
  phaseId: PropTypes.string.isRequired,
};

export default SyncPhaseItem;

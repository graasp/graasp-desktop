import React from 'react';
import PropTypes from 'prop-types';
import {
  TEXT,
  IMAGE,
  VIDEO,
  RESOURCE,
  APPLICATION,
  IFRAME,
} from '../../config/constants';
import PhaseText from './PhaseText';
import PhaseImage from './PhaseImage';
import PhaseVideo from './PhaseVideo';
import PhaseApp from './PhaseApp';

const renderResource = item => {
  const { id, mimeType, content, asset, url, name } = item;

  if (mimeType === TEXT) {
    if (!content) {
      fetch(item.url).then(response => {
        response.text().then(text => {
          console.log('html content', text);
        });
      });
    }
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
  const { id, category, asset, url, name, appInstance } = item;
  switch (category) {
    case RESOURCE:
      return renderResource(item);

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

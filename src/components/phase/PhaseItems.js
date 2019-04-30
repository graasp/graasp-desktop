import React from 'react';
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
    return <PhaseText key={id} id={id} content={content} />;
  }

  if (IMAGE.test(mimeType)) {
    return <PhaseImage key={id} id={id} url={url} asset={asset} name={name} />;
  }

  if (VIDEO.test(mimeType)) {
    return <PhaseVideo key={id} id={id} uri={`file://${asset}`} />;
  }

  if (mimeType === IFRAME) {
    return null;
  }

  return <div key={id} id={id} />;
};

const renderPhaseItem = item => {
  const { id, category, asset } = item;
  switch (category) {
    case RESOURCE:
      return renderResource(item);

    case APPLICATION:
      return <PhaseApp key={id} id={id} uri={`file://${asset}`} />;

    default:
      return <div key={id} id={id} />;
  }
};

const PhaseItems = ({ items }) => {
  if (!items) {
    return <div />;
  }
  return items.map(item => renderPhaseItem(item));
};

export default PhaseItems;

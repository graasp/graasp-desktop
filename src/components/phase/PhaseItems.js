import React from 'react';
import {
  TEXT,
  IMAGE,
  VIDEO,
  LAB,
  APP,
} from '../../config/constants';
import PhaseText from './PhaseText';
import PhaseImage from './PhaseImage';
import PhaseVideo from './PhaseVideo';
import PhaseLab from './PhaseLab';
import PhaseApp from './PhaseApp';

const renderPhaseItem = (item) => {
  const { id, type, content } = item;
  switch (type) {
    case TEXT:
      return (
        <PhaseText
          key={id}
          id={id}
          content={content}
        />
      );
    case IMAGE:
      return (
        <PhaseImage
          key={id}
          id={id}
          uri={`file://${item.asset}`}
        />
      );
    case LAB:
      return (
        <PhaseLab
          key={id}
          id={id}
          uri={`file://${item.asset}`}
        />
      );
    case APP:
      return (
        <PhaseApp
          key={id}
          id={id}
          uri={`file://${item.asset}`}
        />
      );
    case VIDEO:
      return (
        <PhaseVideo
          key={id}
          id={id}
          uri={`file://${item.asset}`}
        />
      );

    default:
      return (
        <div
          key={id}
          id={id}
        />
      );
  }
};

const PhaseItems = ({ items }) => {
  if (!items) {
    return <div />;
  }
  return items.map(item => renderPhaseItem(item));
};

export default PhaseItems;

import React from 'react';
import PropTypes from 'prop-types';
import PhaseItem from './PhaseItem';

const PhaseItems = ({ items, phaseId, spaceId }) => {
  if (!items) {
    return null;
  }
  return items.map(item => (
    <PhaseItem key={item.id} phaseId={phaseId} spaceId={spaceId} item={item} />
  ));
};

PhaseItems.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      category: PropTypes.string,
      asset: PropTypes.string,
      url: PropTypes.string,
      name: PropTypes.string,
    })
  ),
  phaseId: PropTypes.string.isRequired,
  spaceId: PropTypes.string.isRequired,
};

export default PhaseItems;

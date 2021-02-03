import React from 'react';
import PropTypes from 'prop-types';
import PhaseItem from './PhaseItem';
import PhaseItemDescription from './PhaseItemDescription';

const PhaseItems = ({ items, phaseId, spaceId }) => {
  if (!items) {
    return null;
  }
  return items.map((item) => {
    const { description, id } = item;
    return (
      <div key={id} data-id={id}>
        <PhaseItemDescription id={id} description={description} />
        <PhaseItem phaseId={phaseId} spaceId={spaceId} item={item} />
      </div>
    );
  });
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

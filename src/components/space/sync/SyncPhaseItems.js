import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import SyncPhaseItem from './SyncPhaseItem';
import PhaseItemDescription from '../../phase/PhaseItemDescription';
import { SYNC_ITEM_CLASS } from '../../../config/selectors';

const PhaseItem = ({ item, spaceId, phaseId }) => {
  const { description, id, className } = item;
  return (
    <Grid xs={6} item className={clsx(SYNC_ITEM_CLASS, className)} data-id={id}>
      <PhaseItemDescription id={id} description={description} />
      <SyncPhaseItem idx={id} item={item} spaceId={spaceId} phaseId={phaseId} />
    </Grid>
  );
};

PhaseItem.propTypes = {
  item: PropTypes.shape({
    description: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
  }).isRequired,
  phaseId: PropTypes.string,
  spaceId: PropTypes.string,
};

PhaseItem.defaultProps = {
  phaseId: null,
  spaceId: null,
};

const SyncPhaseItems = ({ items, spaceId, phaseId, t }) => {
  // happens for empty phase in both local and remote phases
  // happens especially for tools
  if (!items || items.length === 0) {
    return <Typography variant="h6">{t('No Item to Display')}</Typography>;
  }
  return items.map(([localItem, remoteItem]) => (
    <>
      <PhaseItem item={localItem} spaceId={spaceId} phaseId={phaseId} />
      <PhaseItem item={remoteItem} spaceId={spaceId} phaseId={phaseId} />
    </>
  ));
};

SyncPhaseItems.propTypes = {
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
};

export default withTranslation()(SyncPhaseItems);

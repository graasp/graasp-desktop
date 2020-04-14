import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router';
import SyncPhaseItems from './SyncPhaseItems';
import PhaseDescription from '../../phase/PhaseDescription';
import { createDiffElements, diffString } from '../../../utils/syncSpace';
import {
  DIFF_STYLES,
  SYNC_UPDATED,
  SYNC_REMOVED,
  SYNC_ADDED,
  SYNC_ITEM_PROPERTIES,
} from '../../../config/constants';
import { SYNC_ITEM_CLASS } from '../../../config/selectors';

class SyncPhases extends Component {
  static propTypes = {
    localPhase: PropTypes.instanceOf(Map),
    remotePhase: PropTypes.instanceOf(Map),
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
      appBar: PropTypes.string.isRequired,
      appBarShift: PropTypes.string.isRequired,
      drawer: PropTypes.string.isRequired,
      drawerPaper: PropTypes.string.isRequired,
      drawerHeader: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      menuButton: PropTypes.string.isRequired,
      contentShift: PropTypes.string.isRequired,
      hide: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    localPhase: [],
    remotePhase: [],
  };

  renderPhaseDescriptionDiff = (localDescription, remoteDescription) => {
    const { classes } = this.props;

    // display nothing if both elements are undefined
    if (!localDescription && !remoteDescription) {
      return null;
    }

    const change = diffString(localDescription, remoteDescription);
    return (
      <>
        <Grid
          item
          className={clsx(SYNC_ITEM_CLASS, {
            [classes[SYNC_REMOVED]]: change[SYNC_REMOVED],
          })}
          xs={6}
        >
          <PhaseDescription description={localDescription} />
        </Grid>
        <Grid
          item
          className={clsx(SYNC_ITEM_CLASS, {
            [classes[SYNC_ADDED]]: change[SYNC_ADDED],
            [classes[SYNC_UPDATED]]: change[SYNC_UPDATED],
          })}
          xs={6}
        >
          <PhaseDescription description={remoteDescription} />
        </Grid>
      </>
    );
  };

  renderDiffPhases(localPhase, remotePhase) {
    const { classes } = this.props;
    const {
      items: localItems = [],
      description: localDescription = null,
    } = localPhase;
    const {
      items: remoteItems = [],
      description: remoteDescription = null,
    } = remotePhase;

    const finalItems = createDiffElements(
      localItems,
      remoteItems,
      classes,
      SYNC_ITEM_PROPERTIES
    );
    return (
      <>
        {this.renderPhaseDescriptionDiff(localDescription, remoteDescription)}
        <SyncPhaseItems items={finalItems} />
      </>
    );
  }

  render() {
    const { localPhase, remotePhase } = this.props;

    return this.renderDiffPhases(localPhase.toJS(), remotePhase.toJS());
  }
}

const StyledComponent = withStyles(DIFF_STYLES, { withTheme: true })(
  SyncPhases
);

export default withRouter(StyledComponent);

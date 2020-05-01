import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router';
import SyncPhaseItems from './SyncPhaseItems';
import PhaseDescription from '../../phase/PhaseDescription';
import { DIFF_STYLES, SYNC_CHANGES } from '../../../config/constants';
import { SYNC_ITEM_CLASS } from '../../../config/selectors';

const { ADDED, REMOVED, UPDATED } = SYNC_CHANGES;

class SyncPhases extends Component {
  static propTypes = {
    localPhase: PropTypes.instanceOf(Map),
    remotePhase: PropTypes.instanceOf(Map),
    diff: PropTypes.instanceOf(Map),
    spaceId: PropTypes.string.isRequired,
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
    diff: {
      items: [],
      description: {},
      name: {},
    },
  };

  renderPhaseDescriptionDiff = (
    localDescription,
    remoteDescription,
    diffDescription
  ) => {
    const { classes } = this.props;

    // display nothing if both elements are undefined
    if (!localDescription && !remoteDescription) {
      return null;
    }

    return (
      <>
        <Grid
          item
          className={clsx(SYNC_ITEM_CLASS, {
            [classes[REMOVED]]: diffDescription[REMOVED],
          })}
          xs={6}
        >
          <PhaseDescription description={localDescription} />
        </Grid>
        <Grid
          item
          className={clsx(SYNC_ITEM_CLASS, {
            [classes[ADDED]]: diffDescription[ADDED],
            [classes[UPDATED]]: diffDescription[UPDATED],
          })}
          xs={6}
        >
          <PhaseDescription description={remoteDescription} />
        </Grid>
      </>
    );
  };

  renderDiffPhases() {
    const { localPhase, remotePhase, diff, spaceId } = this.props;

    const {
      description: localDescription = null,
      id: localPhaseId,
    } = localPhase.toJS();
    const {
      description: remoteDescription = null,
      id: remotePhaseId,
    } = remotePhase.toJS();
    const { items: diffItems, description: diffDescription } = diff.toJS();
    const phaseId = localPhaseId || remotePhaseId;

    return (
      <>
        {this.renderPhaseDescriptionDiff(
          localDescription,
          remoteDescription,
          diffDescription
        )}
        <SyncPhaseItems items={diffItems} spaceId={spaceId} phaseId={phaseId} />
      </>
    );
  }

  render() {
    return this.renderDiffPhases();
  }
}

const StyledComponent = withStyles(DIFF_STYLES, { withTheme: true })(
  SyncPhases
);

export default withRouter(StyledComponent);

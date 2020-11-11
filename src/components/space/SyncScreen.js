import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Qs from 'qs';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import Button from '@material-ui/core//Button';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import {
  getSyncMode,
  getLocalSpaceForSync,
  getRemoteSpaceForSync,
} from '../../actions';
import SyncVisualScreen from './SyncVisualScreen';
import SyncAdvancedScreen from './SyncAdvancedScreen';
import { isSpaceUpToDate } from '../../utils/syncSpace';
import SpaceNotFound from './SpaceNotFound';
import Main from '../common/Main';
import { HOME_PATH, VISIT_PATH } from '../../config/paths';
import Styles from '../../Styles';
import Loader from '../common/Loader';
import { DEFAULT_SYNC_MODE, SYNC_MODES } from '../../config/constants';

const styles = (theme) => ({
  ...Styles(theme),
  centerText: {
    textAlign: 'center',
  },
});

class SyncScreen extends Component {
  static propTypes = {
    dispatchGetSyncMode: PropTypes.func.isRequired,
    activity: PropTypes.bool,
    mode: PropTypes.oneOf(Object.values(SYNC_MODES)),
    dispatchGetLocalSpace: PropTypes.func.isRequired,
    dispatchGetRemoteSpace: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    localSpace: ImmutablePropTypes.contains({
      id: PropTypes.string,
      description: PropTypes.string,
      name: PropTypes.string,
    }),
    remoteSpace: ImmutablePropTypes.contains({
      id: PropTypes.string,
      description: PropTypes.string,
      name: PropTypes.string,
    }),
    t: PropTypes.func.isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
    }).isRequired,
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
      centerText: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    mode: DEFAULT_SYNC_MODE,
    activity: false,
    localSpace: Map(),
    remoteSpace: Map(),
  };

  componentDidMount() {
    const {
      dispatchGetSyncMode,
      dispatchGetLocalSpace,
      dispatchGetRemoteSpace,
      match: {
        params: { id },
      },
      location: { search },
    } = this.props;

    // tell action creator if this space has already been saved
    const { saved } = Qs.parse(search, { ignoreQueryPrefix: true });
    dispatchGetLocalSpace({ id, saved: saved === 'true' });

    // get remote space
    dispatchGetRemoteSpace({ id });

    dispatchGetSyncMode();
  }

  render() {
    const {
      mode,
      activity,
      localSpace,
      remoteSpace,
      t,
      classes,
      history: { replace },
    } = this.props;

    if (activity) {
      return (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed">
            <Toolbar />
          </AppBar>
          <main className="Main">
            <Loader />
          </main>
        </div>
      );
    }

    if (localSpace.isEmpty() || remoteSpace.isEmpty()) {
      return <SpaceNotFound />;
    }

    const mutableLocalSpace = localSpace.toJS();
    const mutableRemoteSpace = remoteSpace.toJS();

    // if the space contains no change
    if (isSpaceUpToDate(mutableLocalSpace, mutableRemoteSpace)) {
      return (
        <Main fullScreen>
          <div className={classes.centerText}>
            <Typography align="center" variant="h5">
              {t('This Space is already up to date')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => replace(HOME_PATH)}
            >
              {t('Home')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => replace(VISIT_PATH)}
            >
              {t('Visit Another Space')}
            </Button>
          </div>
        </Main>
      );
    }

    switch (mode) {
      case SYNC_MODES.ADVANCED:
        return (
          <SyncAdvancedScreen
            localSpace={mutableLocalSpace}
            remoteSpace={mutableRemoteSpace}
          />
        );
      case SYNC_MODES.VISUAL:
      default:
        return (
          <SyncVisualScreen
            localSpace={mutableLocalSpace}
            remoteSpace={mutableRemoteSpace}
          />
        );
    }
  }
}

const mapStateToProps = ({ authentication, syncSpace: syncSpaceReducer }) => ({
  mode: authentication.getIn(['user', 'settings', 'syncMode']),
  activity: Boolean(syncSpaceReducer.getIn(['activity']).size),
  localSpace: syncSpaceReducer.get('localSpace'),
  remoteSpace: syncSpaceReducer.get('remoteSpace'),
});

const mapDispatchToProps = {
  dispatchGetSyncMode: getSyncMode,
  dispatchGetLocalSpace: getLocalSpaceForSync,
  dispatchGetRemoteSpace: getRemoteSpaceForSync,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SyncScreen);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);

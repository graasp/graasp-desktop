import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import _ from 'lodash';
import Qs from 'qs';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import Button from '@material-ui/core//Button';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import {
  getSyncAdvancedMode,
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

const styles = theme => ({
  ...Styles(theme),
  centerText: {
    textAlign: 'center',
  },
});

class SyncScreen extends Component {
  static propTypes = {
    dispatchGetSyncAdvancedMode: PropTypes.string.isRequired,
    activity: PropTypes.bool,
    advancedMode: PropTypes.bool,
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
      id: PropTypes.string.isRequired,
      description: PropTypes.string,
      name: PropTypes.string.isRequired,
      deleted: PropTypes.bool.isRequired,
    }).isRequired,
    remoteSpace: ImmutablePropTypes.contains({
      id: PropTypes.string,
      description: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
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
    advancedMode: false,
    activity: false,
  };

  componentDidMount() {
    const {
      dispatchGetSyncAdvancedMode,
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

    dispatchGetSyncAdvancedMode();
  }

  render() {
    const {
      advancedMode,
      activity,
      localSpace,
      remoteSpace,
      t,
      classes,
      history: { replace },
    } = this.props;

    if (activity) {
      return <Loader />;
    }

    if (
      !localSpace ||
      _.isEmpty(localSpace) ||
      !remoteSpace ||
      _.isEmpty(remoteSpace)
    ) {
      return <SpaceNotFound />;
    }

    // if the space contains no change
    if (isSpaceUpToDate(localSpace, remoteSpace)) {
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

    return advancedMode ? (
      <SyncAdvancedScreen localSpace={localSpace} remoteSpace={remoteSpace} />
    ) : (
      <SyncVisualScreen localSpace={localSpace} remoteSpace={remoteSpace} />
    );
  }
}

const mapStateToProps = ({ authentication, syncSpace: syncSpaceReducer }) => ({
  advancedMode: authentication.getIn(['user', 'settings', 'syncAdvancedMode']),
  activity: Boolean(authentication.getIn(['current', 'activity']).size),
  localSpace: syncSpaceReducer.get('localSpace').toJS(),
  remoteSpace: syncSpaceReducer.get('remoteSpace').toJS(),
});

const mapDispatchToProps = {
  dispatchGetSyncAdvancedMode: getSyncAdvancedMode,
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

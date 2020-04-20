import React, { Component } from 'react';
import Qs from 'qs';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import IconButton from '@material-ui/core/IconButton/IconButton';
import SyncIcon from '@material-ui/icons/Sync';
import Tooltip from '@material-ui/core/Tooltip';
import ClearIcon from '@material-ui/icons/Clear';
import DoneIcon from '@material-ui/icons/Done';
import clsx from 'clsx';
import { withTranslation } from 'react-i18next';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import AppBar from '@material-ui/core/AppBar/AppBar';
import classNames from 'classnames';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import ReactDiffViewer from 'react-diff-viewer';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router';
import Banner from '../common/Banner';
import Loader from '../common/Loader';
import {
  clearSpacesForSync,
  getLocalSpaceForSync,
  getRemoteSpaceForSync,
  syncSpace,
} from '../../actions';
import './SpaceScreen.css';
import Styles from '../../Styles';
import { HOME_PATH } from '../../config/paths';
import SpaceNotFound from './SpaceNotFound';

const SELECTED_SPACE_PROPERTIES = ['name', 'image', 'description', 'phases'];

const diffEditorStyles = {
  variables: {
    highlightBackground: '#fefed5',
    highlightGutterBackground: '#ffcd3c',
  },
  line: {
    padding: '10px 2px',
    wordBreak: 'break-word',
    '&:hover': {
      background: '#a26ea1',
    },
  },
  titleBlock: {
    pre: {
      fontSize: '16px',
      fontWeight: 'bold',
      fontFamily: 'arial',
    },
  },
};

class SyncAdvancedScreen extends Component {
  state = {
    openDrawer: false,
  };

  static propTypes = {
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
    dispatchGetLocalSpace: PropTypes.func.isRequired,
    dispatchGetRemoteSpace: PropTypes.func.isRequired,
    dispatchClearSpaces: PropTypes.func.isRequired,
    dispatchSync: PropTypes.func.isRequired,
    activity: PropTypes.bool.isRequired,
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
    theme: PropTypes.shape({ direction: PropTypes.string.isRequired })
      .isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    const {
      match: {
        params: { id },
      },
      location: { search },
      dispatchGetLocalSpace,
      dispatchGetRemoteSpace,
    } = this.props;

    // tell action creator if this space has already been saved
    const { saved } = Qs.parse(search, { ignoreQueryPrefix: true });
    dispatchGetLocalSpace({ id, saved: saved === 'true' });

    // get remote space
    dispatchGetRemoteSpace({ id });
  }

  componentDidUpdate() {
    const {
      localSpace: { deleted },
      history: { replace },
    } = this.props;
    // redirect to home if space is deleted
    if (deleted) {
      replace(HOME_PATH);
    }
  }

  componentWillUnmount() {
    const { dispatchClearSpaces } = this.props;
    dispatchClearSpaces();
  }

  handleCancel = () => {
    const {
      history: { goBack },
    } = this.props;

    // return to previous screen
    goBack();
  };

  handleSync = () => {
    const {
      localSpace: { id },
      dispatchSync,
      history: { push },
    } = this.props;
    dispatchSync({ id });

    // redirect to space
    push(`/space/${id}`);
  };

  renderCancelButton = () => {
    const { t, classes } = this.props;
    return (
      <Tooltip title={t('Cancel Synchronization')}>
        <IconButton
          color="inherit"
          className={clsx(classes.button)}
          onClick={this.handleCancel}
        >
          <ClearIcon />
        </IconButton>
      </Tooltip>
    );
  };

  renderDoneButton = () => {
    const { t, classes } = this.props;
    return (
      <Tooltip title={t('Accept Synchronization')}>
        <IconButton
          color="inherit"
          className={clsx(classes.button)}
          onClick={this.handleSync}
        >
          <DoneIcon />
        </IconButton>
      </Tooltip>
    );
  };

  render() {
    const { localSpace, remoteSpace, activity, classes, t } = this.props;
    const { name } = localSpace;
    const { openDrawer } = this.state;

    const filteredSpace = _.pick(localSpace, SELECTED_SPACE_PROPERTIES);
    const filteredRemoteSpace = _.pick(remoteSpace, SELECTED_SPACE_PROPERTIES);

    if (activity) {
      return (
        <div className={classNames(classes.root, 'SpaceScreen')}>
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

    if (
      !localSpace ||
      _.isEmpty(localSpace) ||
      !remoteSpace ||
      _.isEmpty(remoteSpace)
    ) {
      return <SpaceNotFound />;
    }

    return (
      <>
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: openDrawer,
          })}
        >
          <Toolbar disableGutters={!openDrawer}>
            <div
              color="inherit"
              className={classNames(
                classes.menuButton,
                openDrawer && classes.hide
              )}
            >
              <SyncIcon />
            </div>
            {`${t('Synchronization')}: ${name}`}
            <span style={{ position: 'absolute', right: 20 }}>
              {this.renderDoneButton()}
              {this.renderCancelButton()}
            </span>
          </Toolbar>
        </AppBar>

        <div className={classes.drawerHeader} />

        <br />

        <Banner
          text={t(
            'You are currently synchronizing a space. Either accept or cancel the synchronization. The synchronization is definitive and all user input will be deleted.'
          )}
          type="error"
        />

        <ReactDiffViewer
          styles={diffEditorStyles}
          oldValue={JSON.stringify(filteredSpace, null, '  ')}
          newValue={JSON.stringify(filteredRemoteSpace, null, '  ')}
          splitView
          leftTitle={t('Current Version')}
          rightTitle={t('Most Recent Online Version')}
        />
      </>
    );
  }
}

const mapStateToProps = ({ syncSpace: syncSpaceReducer }) => ({
  localSpace: syncSpaceReducer.get('localSpace').toJS(),
  remoteSpace: syncSpaceReducer.get('remoteSpace').toJS(),
  activity: Boolean(syncSpaceReducer.getIn(['activity']).size),
});

const mapDispatchToProps = {
  dispatchGetLocalSpace: getLocalSpaceForSync,
  dispatchGetRemoteSpace: getRemoteSpaceForSync,
  dispatchClearSpaces: clearSpacesForSync,
  dispatchSync: syncSpace,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SyncAdvancedScreen);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);

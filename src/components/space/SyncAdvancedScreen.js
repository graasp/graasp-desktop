import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import SyncIcon from '@material-ui/icons/Sync';
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
import { clearSpacesForSync } from '../../actions';
import './SpaceScreen.css';
import Styles from '../../Styles';
import { HOME_PATH } from '../../config/paths';
import SpaceNotFound from './SpaceNotFound';
import { SYNC_SPACE_PROPERTIES } from '../../config/constants';
import SyncCancelButton from './sync/SyncCancelButton';
import SyncAcceptButton from './sync/SyncAcceptButton';
import { SYNC_ADVANCED_MAIN_ID } from '../../config/selectors';

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
    dispatchClearSpaces: PropTypes.func.isRequired,
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
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
  };

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

  render() {
    const { localSpace, remoteSpace, activity, classes, t } = this.props;
    const { name } = localSpace;
    const { openDrawer } = this.state;

    const filteredSpace = _.pick(localSpace, SYNC_SPACE_PROPERTIES);
    const filteredRemoteSpace = _.pick(remoteSpace, SYNC_SPACE_PROPERTIES);

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
              <SyncAcceptButton spaceId={localSpace.id} />
              <SyncCancelButton />
            </span>
          </Toolbar>
        </AppBar>

        <main id={SYNC_ADVANCED_MAIN_ID} style={{ height: '100%' }}>
          <div className={classes.drawerHeader} />

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
        </main>
      </>
    );
  }
}

const mapStateToProps = ({ syncSpace: syncSpaceReducer }) => ({
  activity: Boolean(syncSpaceReducer.getIn(['activity']).size),
});

const mapDispatchToProps = {
  dispatchClearSpaces: clearSpacesForSync,
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

import React, { Component } from 'react';
import Qs from 'qs';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Tooltip from '@material-ui/core/Tooltip';
import ClearIcon from '@material-ui/icons/Clear';
import DoneIcon from '@material-ui/icons/Done';
import clsx from 'clsx';
import { withTranslation } from 'react-i18next';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import HomeIcon from '@material-ui/icons/Home';
import Drawer from '@material-ui/core/Drawer/Drawer';
import Divider from '@material-ui/core/Divider/Divider';
import List from '@material-ui/core/List/List';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import {
  PHASE_MENU_LIST_ID,
  PHASE_MENU_ITEM,
  SYNC_ITEM_CLASS,
  SPACE_DESCRIPTION_TEXT_CLASS,
} from '../../config/selectors';
import Banner from '../common/Banner';
import Loader from '../common/Loader';
import {
  clearSpacesForSync,
  getLocalSpaceForSync,
  getRemoteSpaceForSync,
  syncSpace,
  clearPhasesForSync,
  selectPhaseForSync,
} from '../../actions';
import Styles from '../../Styles';
import { HOME_PATH } from '../../config/paths';
import SpaceNotFound from './SpaceNotFound';
import Text from '../common/Text';
import SyncPhases from './sync/SyncPhases';
import {
  SYNC_ADDED,
  SYNC_REMOVED,
  SYNC_UPDATED,
  DIFF_STYLES,
  SYNC_PHASE_PROPERTIES,
} from '../../config/constants';
import {
  diffString,
  createDiffElements,
  createToolsPhase,
} from '../../utils/syncSpace';

const styles = theme => ({
  ...Styles(theme),
  syncWrapper: {
    padding: '0 20px',

    [`& .${SYNC_ITEM_CLASS}:nth-child(2n)`]: {
      borderLeft: '1px solid black',
    },
  },
  spaceImage: {
    maxWidth: '100%',
  },
  removedText: { textDecoration: 'line-through' },
  ...DIFF_STYLES,
});

class SyncScreen extends Component {
  state = {
    openDrawer: true,
    selected: -1,
    syncPhases: [],
  };

  static propTypes = {
    localSpace: PropTypes.instanceOf(Map).isRequired,
    remoteSpace: PropTypes.instanceOf(Map).isRequired,
    remotePhase: PropTypes.instanceOf(Map).isRequired,
    localPhase: PropTypes.instanceOf(Map).isRequired,
    dispatchGetLocalSpace: PropTypes.func.isRequired,
    dispatchGetRemoteSpace: PropTypes.func.isRequired,
    dispatchClearSpaces: PropTypes.func.isRequired,
    dispatchClearPhases: PropTypes.func.isRequired,
    dispatchSelectPhase: PropTypes.func.isRequired,
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
      syncWrapper: PropTypes.string.isRequired,
      spaceImage: PropTypes.string.isRequired,
      removedText: PropTypes.string.isRequired,
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
    deleted: PropTypes.bool.isRequired,
    folder: PropTypes.string.isRequired,
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
      deleted,
      localSpace,
      remoteSpace,
      classes,
      history: { replace },
    } = this.props;
    const { syncPhases: currentSyncPhases } = this.state;
    // redirect to home if space is deleted
    if (deleted) {
      replace(HOME_PATH);
    }

    // compute syncPhases once, when localSpace and remoteSpace are fetched
    if (
      !_.isEmpty(localSpace) &&
      !_.isEmpty(remoteSpace) &&
      _.isEmpty(currentSyncPhases)
    ) {
      // detect diff and return sync phases to display
      // detect moved phases, but for simplicity it will be
      // rendered as added / moved phases
      const syncPhases = createDiffElements(
        [createToolsPhase(localSpace.items), ...localSpace.phases],
        [createToolsPhase(remoteSpace.items), ...remoteSpace.phases],
        classes,
        SYNC_PHASE_PROPERTIES
      );
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ syncPhases });
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

  handleDrawerOpen = () => {
    this.setState({ openDrawer: true });
  };

  handleDrawerClose = () => {
    this.setState({ openDrawer: false });
  };

  handlePhaseClicked = i => {
    const { dispatchSelectPhase } = this.props;
    const { syncPhases } = this.state;

    dispatchSelectPhase(syncPhases[i]);
    this.setState({
      selected: i,
    });
  };

  handleClearPhase = () => {
    this.setState({
      selected: -1,
    });
    const { dispatchClearPhases } = this.props;
    dispatchClearPhases();
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

  renderDiffImage = (localImage, remoteImage) => {
    const { classes, folder, t } = this.props;

    // display nothing if both elements are undefined
    if (!localImage && !remoteImage) {
      return null;
    }

    const { thumbnailUrl: localThumbnailUrl = '', thumbnailAsset } = localImage;
    const { thumbnailUrl: remoteThumbnailUrl = '' } = remoteImage;

    // compare images using thumbnail url
    const change = diffString(localThumbnailUrl, remoteThumbnailUrl);
    return (
      <>
        <Grid
          item
          className={clsx(SYNC_ITEM_CLASS, {
            [classes[SYNC_REMOVED]]: change[SYNC_REMOVED],
          })}
          xs={6}
        >
          {thumbnailAsset && (
            <img
              alt={t('Local Space Image')}
              className={classes.spaceImage}
              src={`file://${folder}/${thumbnailAsset}`}
            />
          )}
        </Grid>
        <Grid
          item
          className={clsx(SYNC_ITEM_CLASS, {
            [classes[SYNC_ADDED]]: change[SYNC_ADDED],
            [classes[SYNC_UPDATED]]: change[SYNC_UPDATED],
          })}
          xs={6}
        >
          <img
            alt={t('Remote Space Image')}
            className={classes.spaceImage}
            src={remoteThumbnailUrl}
          />
        </Grid>
      </>
    );
  };

  renderDiffDescription = () => {
    const { classes, localSpace, remoteSpace } = this.props;
    const { description: localDescription } = localSpace;
    const { description: remoteDescription } = remoteSpace;

    // display nothing if both elements are undefined
    if (!localDescription && !remoteDescription) {
      return null;
    }

    // compare images using thumbnail url
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
          <Text
            content={localDescription}
            className={SPACE_DESCRIPTION_TEXT_CLASS}
          />
        </Grid>
        <Grid
          item
          className={clsx(SYNC_ITEM_CLASS, {
            [classes[SYNC_ADDED]]: change[SYNC_ADDED],
            [classes[SYNC_UPDATED]]: change[SYNC_UPDATED],
          })}
          xs={6}
        >
          <Text
            content={remoteDescription}
            className={SPACE_DESCRIPTION_TEXT_CLASS}
          />
        </Grid>
      </>
    );
  };

  generatePhaseMenuItem(localPhase, remotePhase, index) {
    const { name: localName, id: localId } = localPhase;
    const { name: remoteName, id: remoteId } = remotePhase;
    const { classes } = this.props;
    const { selected } = this.state;

    const diff = diffString(localName, remoteName);

    return (
      <MenuItem
        className={clsx({
          [classes[SYNC_REMOVED]]: diff[SYNC_REMOVED],
          [classes[SYNC_UPDATED]]: diff[SYNC_UPDATED],
          [classes[SYNC_ADDED]]: diff[SYNC_ADDED],
        })}
        onClick={() => this.handlePhaseClicked(index)}
        key={localId || remoteId}
        selected={selected === index}
        id={`${PHASE_MENU_ITEM}-${index}`}
      >
        <ListItemIcon>
          <ChevronRightIcon />
        </ListItemIcon>

        <ListItemText>
          {(diff[SYNC_REMOVED] || diff[SYNC_UPDATED]) && (
            <Typography className={classes.removedText}>{localName}</Typography>
          )}
          <Typography>{remoteName}</Typography>
        </ListItemText>
      </MenuItem>
    );
  }

  render() {
    const {
      localSpace,
      remoteSpace,
      activity,
      classes,
      t,
      remotePhase,
      localPhase,
      theme,
    } = this.props;
    const { name } = localSpace;
    const { openDrawer, syncPhases, selected } = this.state;

    if (activity) {
      return (
        <div className={clsx(classes.root)}>
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
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: openDrawer,
          })}
        >
          <Toolbar disableGutters={!openDrawer}>
            <IconButton
              color="inherit"
              aria-label="Open Drawer"
              onClick={this.handleDrawerOpen}
              className={clsx(classes.menuButton, openDrawer && classes.hide)}
            >
              <MenuIcon />
            </IconButton>

            {`${t('Synchronization')}: ${name}`}
            <span style={{ position: 'absolute', right: 20 }}>
              {this.renderDoneButton()}
              {this.renderCancelButton()}
            </span>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={openDrawer}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'ltr' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List id={PHASE_MENU_LIST_ID}>
            <MenuItem
              onClick={this.handleClearPhase}
              button
              selected={selected === -1}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </MenuItem>
            {syncPhases.map(([lPhase, rPhase], i) =>
              this.generatePhaseMenuItem(lPhase, rPhase, i)
            )}
          </List>
        </Drawer>
        <main
          className={clsx(classes.content, classes.syncWrapper, {
            [classes.contentShift]: openDrawer,
          })}
          style={{ height: '100%' }}
        >
          <div className={classes.drawerHeader} />

          <Banner
            text={t(
              'You are currently synchronizing a space. Either accept or cancel the synchronization. The synchronization is definitive and all user input will be deleted.'
            )}
            type="error"
          />

          <Grid container justify="center" spacing={4}>
            <Grid item xs={6}>
              <Typography align="center" variant="h4">
                {t('Current Version')}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="center" variant="h4">
                {t('Most Recent Online Version')}
              </Typography>
            </Grid>

            {!localPhase.isEmpty() || !remotePhase.isEmpty() ? (
              <SyncPhases localPhase={localPhase} remotePhase={remotePhase} />
            ) : (
              <>
                {this.renderDiffImage(localSpace.image, remoteSpace.image)}
                {this.renderDiffDescription(localSpace, remoteSpace)}
              </>
            )}
          </Grid>
        </main>
      </div>
    );
  }
}

const mapStateToProps = ({ syncSpace: syncSpaceReducer, authentication }) => ({
  localSpace: syncSpaceReducer.get('localSpace').toJS(),
  remoteSpace: syncSpaceReducer.get('remoteSpace').toJS(),
  activity: Boolean(syncSpaceReducer.getIn(['activity']).size),
  folder: authentication.getIn(['current', 'folder']),
  localPhase: syncSpaceReducer.getIn(['current', 'localPhase']),
  remotePhase: syncSpaceReducer.getIn(['current', 'remotePhase']),
});

const mapDispatchToProps = {
  dispatchGetLocalSpace: getLocalSpaceForSync,
  dispatchGetRemoteSpace: getRemoteSpaceForSync,
  dispatchClearSpaces: clearSpacesForSync,
  dispatchSync: syncSpace,
  dispatchSelectPhase: selectPhaseForSync,
  dispatchClearPhases: clearPhasesForSync,
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

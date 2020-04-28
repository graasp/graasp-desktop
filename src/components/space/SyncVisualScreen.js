import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import { withTranslation } from 'react-i18next';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NewReleaseIcon from '@material-ui/icons/NewReleases';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import HomeIcon from '@material-ui/icons/Home';
import Drawer from '@material-ui/core/Drawer/Drawer';
import Divider from '@material-ui/core/Divider/Divider';
import List from '@material-ui/core/List/List';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import SyncCancelButton from './sync/SyncCancelButton';
import SyncAcceptButton from './sync/SyncAcceptButton';
import {
  PHASE_MENU_LIST_ID,
  PHASE_MENU_ITEM_HOME_ID,
  SYNC_ITEM_CLASS,
  buildPhaseMenuItemId,
  SPACE_DESCRIPTION_TEXT_CLASS,
  SPACE_THUMBNAIL_IMAGE_CLASS,
  SYNC_VISUAL_MAIN_ID,
} from '../../config/selectors';
import Banner from '../common/Banner';
import Loader from '../common/Loader';
import {
  clearSpacesForSync,
  clearPhasesForSync,
  selectPhaseForSync,
} from '../../actions';
import Styles from '../../Styles';
import { HOME_PATH } from '../../config/paths';
import SpaceNotFound from './SpaceNotFound';
import Text from '../common/Text';
import SyncPhases from './sync/SyncPhases';
import {
  SYNC_CHANGES,
  DIFF_STYLES,
  SYNC_PHASE_PROPERTIES,
  SYNC_ITEM_PROPERTIES,
} from '../../config/constants';
import {
  diffString,
  createDiffElements,
  createToolsPhase,
} from '../../utils/syncSpace';
import {
  ERROR_SYNCING_MESSAGE,
  ERROR_MESSAGE_HEADER,
} from '../../config/messages';

const { ADDED, REMOVED, UPDATED } = SYNC_CHANGES;

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
    diff: PropTypes.instanceOf(Map).isRequired,
    dispatchClearSpaces: PropTypes.func.isRequired,
    dispatchClearPhases: PropTypes.func.isRequired,
    dispatchSelectPhase: PropTypes.func.isRequired,
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
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    deleted: PropTypes.bool.isRequired,
    folder: PropTypes.string.isRequired,
  };

  componentDidMount() {
    const { localSpace, remoteSpace, classes } = this.props;

    if (!_.isEmpty(localSpace) && !_.isEmpty(remoteSpace)) {
      // detect diff and return sync phases to display
      // detect moved phases, but for simplicity it will be
      // rendered as added / moved phases
      try {
        const syncPhases = createDiffElements(
          [createToolsPhase(localSpace.items), ...localSpace.phases],
          [createToolsPhase(remoteSpace.items), ...remoteSpace.phases],
          classes,
          SYNC_PHASE_PROPERTIES
        )
          // compute differences here
          // to have detect updates when rendering phase menu items
          .map(([lPhase, rPhase]) => {
            const { items: localItems = [] } = lPhase;
            const { items: remoteItems = [] } = rPhase;

            // items diff
            const diffItems = createDiffElements(
              localItems,
              remoteItems,
              classes,
              SYNC_ITEM_PROPERTIES
            );

            // description diff
            const diffDescription = diffString(
              lPhase.description,
              rPhase.description
            );

            // name diff
            const diffName = diffString(lPhase.name, rPhase.name);

            return {
              localPhase: lPhase,
              remotePhase: rPhase,
              diff: {
                items: diffItems,
                description: diffDescription,
                name: diffName,
              },
            };
          });
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ syncPhases });
      } catch (e) {
        toastr.error(ERROR_MESSAGE_HEADER, ERROR_SYNCING_MESSAGE);
        this.handleCancel();
      }
    }
  }

  componentDidUpdate() {
    const {
      deleted,
      history: { replace },
    } = this.props;
    // redirect to home if space is deleted
    if (deleted) {
      replace(HOME_PATH);
    }
  }

  componentWillUnmount() {
    const { dispatchClearSpaces, dispatchClearPhases } = this.props;
    dispatchClearSpaces();
    dispatchClearPhases();
  }

  handleCancel = () => {
    const {
      history: { goBack },
    } = this.props;
    goBack();
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

  renderDiffImage = () => {
    const { classes, folder, t, localSpace, remoteSpace } = this.props;
    const { image: localImage = {} } = localSpace;
    const { image: remoteImage = {} } = remoteSpace;

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
            [classes[REMOVED]]: change[REMOVED],
            [SPACE_THUMBNAIL_IMAGE_CLASS]: thumbnailAsset,
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
            [classes[ADDED]]: change[ADDED],
            [classes[UPDATED]]: change[UPDATED],
            [SPACE_THUMBNAIL_IMAGE_CLASS]: remoteThumbnailUrl.length,
          })}
          xs={6}
        >
          {remoteThumbnailUrl.length ? (
            <img
              alt={t('Remote Space Image')}
              className={classes.spaceImage}
              src={remoteThumbnailUrl}
            />
          ) : null}
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
            [classes[REMOVED]]: change[REMOVED],
            [SPACE_DESCRIPTION_TEXT_CLASS]: localDescription.length,
          })}
          xs={6}
        >
          {localDescription.length ? <Text content={localDescription} /> : null}
        </Grid>
        <Grid
          item
          className={clsx(SYNC_ITEM_CLASS, {
            [classes[ADDED]]: change[ADDED],
            [classes[UPDATED]]: change[UPDATED],
            [SPACE_DESCRIPTION_TEXT_CLASS]: remoteDescription.length,
          })}
          xs={6}
        >
          {remoteDescription.length ? (
            <Text content={remoteDescription} />
          ) : null}
        </Grid>
      </>
    );
  };

  renderPhaseMenuItem(
    {
      localPhase,
      remotePhase,
      diff: { items: diffItems, description: diffDescription, name: diffName },
    },
    index
  ) {
    const { name: localName, id: localId } = localPhase;
    const { name: remoteName, id: remoteId } = remotePhase;
    const { classes } = this.props;
    const { selected } = this.state;

    const hasUpdate =
      Object.values(diffDescription).includes(true) ||
      diffItems
        .map(
          ([{ changes: lChanges = [] }, { changes: rChanges = [] }]) =>
            lChanges.length + rChanges.length
        )
        .some(nbChange => nbChange > 0);

    return (
      <MenuItem
        className={clsx({
          [classes[REMOVED]]: diffName[REMOVED],
          [classes[UPDATED]]: hasUpdate,
          [classes[ADDED]]: diffName[ADDED],
        })}
        onClick={() => this.handlePhaseClicked(index)}
        key={localId || remoteId}
        selected={selected === index}
        id={buildPhaseMenuItemId(index)}
      >
        <ListItemIcon>
          {hasUpdate ? <NewReleaseIcon /> : <ChevronRightIcon />}
        </ListItemIcon>

        <ListItemText>
          {(diffName[REMOVED] || diffName[UPDATED]) && (
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
      diff,
    } = this.props;
    const { name } = localSpace;
    const { openDrawer, syncPhases, selected } = this.state;
    const spaceId = localSpace.id || remoteSpace.id;

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
              <SyncAcceptButton spaceId={localSpace.id} />
              <SyncCancelButton />
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
              id={PHASE_MENU_ITEM_HOME_ID}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </MenuItem>
            {syncPhases.map((syncPhase, i) =>
              this.renderPhaseMenuItem(syncPhase, i)
            )}
          </List>
        </Drawer>
        <main
          id={SYNC_VISUAL_MAIN_ID}
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
              <SyncPhases
                spaceId={spaceId}
                localPhase={localPhase}
                remotePhase={remotePhase}
                diff={diff}
              />
            ) : (
              <>
                {this.renderDiffImage()}
                {this.renderDiffDescription()}
              </>
            )}
          </Grid>
        </main>
      </div>
    );
  }
}

const mapStateToProps = ({ syncSpace: syncSpaceReducer, authentication }) => ({
  activity: Boolean(syncSpaceReducer.getIn(['activity']).size),
  folder: authentication.getIn(['current', 'folder']),
  localPhase: syncSpaceReducer.getIn(['current', 'localPhase']),
  remotePhase: syncSpaceReducer.getIn(['current', 'remotePhase']),
  diff: syncSpaceReducer.getIn(['current', 'diff']),
});

const mapDispatchToProps = {
  dispatchClearSpaces: clearSpacesForSync,
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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import AppBar from '@material-ui/core/AppBar/AppBar';
import classNames from 'classnames';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import DeleteIcon from '@material-ui/icons/Delete';
import Drawer from '@material-ui/core/Drawer/Drawer';
import Divider from '@material-ui/core/Divider/Divider';
import List from '@material-ui/core/List/List';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import SaveIcon from '@material-ui/icons/Save';
import SearchIcon from '@material-ui/icons/Search';
import Language from '@material-ui/icons/Language';
import Publish from '@material-ui/icons/Publish';
import SettingsIcon from '@material-ui/icons/Settings';
import { withStyles } from '@material-ui/core';
import Loader from '../common/Loader';
import PhaseComponent from '../phase/Phase';
import {
  selectPhase,
  getSpace,
  clearPhase,
  exportSpace,
  deleteSpace,
  clearSpace,
} from '../../actions';
import './SpaceScreen.css';
import Styles from '../../Styles';
import {
  HOME_PATH,
  LOAD_SPACE_PATH,
  SEARCH_SPACE_PATH,
  SETTINGS_PATH,
  VISIT_PATH,
} from '../../config/paths';

class SpaceScreen extends Component {
  state = {
    openDrawer: true,
    selected: -1,
  };

  static propTypes = {
    spaces: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
    })).isRequired,
    space: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
    phase: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
    })).isRequired,
    dispatchSelectPhase: PropTypes.func.isRequired,
    dispatchClearPhase: PropTypes.func.isRequired,
    activity: PropTypes.bool.isRequired,
    deleted: PropTypes.bool.isRequired,
    classes: PropTypes.shape({ appBar: PropTypes.string.isRequired }).isRequired,
    theme: PropTypes.shape({ direction: PropTypes.string.isRequired }).isRequired,
    match: PropTypes.shape({ params: { id: PropTypes.string.isRequired } }).isRequired,
    dispatchGetSpace: PropTypes.func.isRequired,
    history: PropTypes.shape({ length: PropTypes.number.isRequired }).isRequired,
    dispatchExportSpace: PropTypes.func.isRequired,
    dispatchDeleteSpace: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match: { params: { id } }, dispatchGetSpace, spaces } = this.props;
    dispatchGetSpace({ id, spaces });
  }

  componentDidUpdate() {
    const { deleted, history: { replace } } = this.props;
    if (deleted) {
      replace(HOME_PATH);
    }
  }

  handleDrawerOpen = () => {
    this.setState({ openDrawer: true });
  };

  handleDrawerClose = () => {
    this.setState({ openDrawer: false });
  };

  handlePhaseClicked = (i) => {
    const { dispatchSelectPhase, space } = this.props;
    const phases = space.get('phases');
    dispatchSelectPhase(phases[i]);
    this.setState({
      selected: i,
    });
  };

  handleClearPhase = () => {
    this.setState({
      selected: -1,
    });
    const { dispatchClearPhase } = this.props;
    dispatchClearPhase();
  };

  handleExport = () => {
    const { space, spaces } = this.props;
    const id = space.get('id');
    const title = space.get('title');
    const { dispatchExportSpace } = this.props;
    dispatchExportSpace(id, spaces, title);
  };

  handleDelete = () => {
    const { space } = this.props;
    const id = space.get('id');
    const { dispatchDeleteSpace } = this.props;
    dispatchDeleteSpace({ id });
  };

  handleItemClicked = (id) => {
    const { history: { replace }, dispatchClearPhase } = this.props;
    dispatchClearPhase();
    switch (id) {
      case 0:
        replace(HOME_PATH);
        break;
      case 1:
        replace(SEARCH_SPACE_PATH);
        break;
      case 2:
        replace(VISIT_PATH);
        break;
      case 3:
        replace(LOAD_SPACE_PATH);
        break;
      case 4:
        replace(SETTINGS_PATH);
        break;
      default:
    }
  };

  render() {
    const {
      space,
      phase,
      activity,
      classes,
      theme,
    } = this.props;
    const { openDrawer, selected } = this.state;
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
    if (!space || space.isEmpty()) {
      return <p>Space not found.</p>;
    }
    const title = space.get('title');
    const phases = space.get('phases');
    //  const description = space.get('description');
    return (
      <div className={classes.root} style={{ height: '100%' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: openDrawer,
          })}
        >
          <Toolbar disableGutters={!openDrawer}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, openDrawer && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            {title}
            <span style={{ position: 'absolute', right: 20 }}>
              <Button color="inherit" onClick={this.handleDelete} className={classes.button}>
                Delete
                <DeleteIcon className={classes.rightIcon}>delete</DeleteIcon>
              </Button>
              <Button color="inherit" onClick={this.handleExport} className={classes.button}>
                Export
                <UnarchiveIcon className={classes.rightIcon}>export</UnarchiveIcon>
              </Button>
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
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            <MenuItem onClick={this.handleClearPhase} button selected={selected === -1}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Home" />
            </MenuItem>
            {
              phases.map((item, i) => (
                <MenuItem
                  onClick={() => this.handlePhaseClicked(i)}
                  key={item.id}
                  selected={selected === i}
                >
                  <ListItemIcon><ChevronRightIcon /></ListItemIcon>
                  <ListItemText primary={item.title} />
                </MenuItem>
              ))
            }
          </List>
          <Divider />
          <List>
            <MenuItem onClick={() => this.handleItemClicked(0)} button>
              <ListItemIcon><SaveIcon /></ListItemIcon>
              <ListItemText primary="Saved spaces" />
            </MenuItem>
            <MenuItem onClick={() => this.handleItemClicked(1)} button>
              <ListItemIcon><SearchIcon /></ListItemIcon>
              <ListItemText primary="Search Space" />
            </MenuItem>
            <MenuItem onClick={() => this.handleItemClicked(2)} button>
              <ListItemIcon><Language /></ListItemIcon>
              <ListItemText primary="Visit a space" />
            </MenuItem>
            <MenuItem onClick={() => this.handleItemClicked(3)} button>
              <ListItemIcon><Publish /></ListItemIcon>
              <ListItemText primary="Load" />
            </MenuItem>
            <MenuItem onClick={() => this.handleItemClicked(4)} button>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>
          </List>
        </Drawer>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: openDrawer,
          })}
          style={{ height: '100%' }}
        >
          <div className={classes.drawerHeader} />
          <PhaseComponent phase={phase} start={() => this.handlePhaseClicked(0)} />
        </main>
      </div>
    );
  }
}

const mapStateToProps = ({ Space, Phase }) => ({
  space: Space.get('current').get('content'),
  open: Space.get('current').get('menu').get('open'),
  phase: Phase.get('current').get('content'),
  activity: Space.get('current').get('activity'),
  deleted: Space.get('current').get('deleted'),
  spaces: Space.get('saved'),
});

const mapDispatchToProps = {
  dispatchSelectPhase: selectPhase,
  dispatchGetSpace: getSpace,
  dispatchClearPhase: clearPhase,
  dispatchExportSpace: exportSpace,
  dispatchDeleteSpace: deleteSpace,
  dispatchClearSpace: clearSpace,
};

export default (
  withStyles(Styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(SpaceScreen))
);

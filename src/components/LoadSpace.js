import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography/Typography';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import FormControl from '@material-ui/core/FormControl';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SaveIcon from '@material-ui/icons/Save';
import SearchSpace from '@material-ui/icons/Search';
import Language from '@material-ui/icons/Language';
import Publish from '@material-ui/icons/Publish';
import Input from '@material-ui/core/Input';
import SettingsIcon from '@material-ui/icons/Settings';
import { loadSpace } from '../actions/space';
import './LoadSpace.css';
import Styles from '../Styles';
import {
  HOME_PATH,
  SEARCH_SPACE_PATH,
  SETTINGS_PATH,
  VISIT_PATH,
} from '../config/paths';
import Loader from './common/Loader';
import {
  RESPOND_LOAD_SPACE_PROMPT_CHANNEL,
  SHOW_LOAD_SPACE_PROMPT_CHANNEL,
} from '../config/channels';

class LoadSpace extends Component {
  state = {
    open: false,
    fileLocation: '',
  };

  static propTypes = {
    dispatchLoadSpace: PropTypes.func.isRequired,
    theme: PropTypes.shape({ direction: PropTypes.string.isRequired })
      .isRequired,
    activity: PropTypes.bool.isRequired,
    history: PropTypes.shape({ length: PropTypes.number.isRequired })
      .isRequired,
    classes: PropTypes.shape({ appBar: PropTypes.string.isRequired })
      .isRequired,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleFileLocation = selectedPath => {
    this.setState({ fileLocation: selectedPath });
  };

  handleLoad = () => {
    const { fileLocation } = this.state;
    const { dispatchLoadSpace } = this.props;
    dispatchLoadSpace({ fileLocation });
    this.handleFileLocation('');
  };

  handleBrowse = () => {
    const options = {
      filters: [{ name: 'zip', extensions: ['zip'] }],
    };
    window.ipcRenderer.send(SHOW_LOAD_SPACE_PROMPT_CHANNEL, options);
    window.ipcRenderer.once(
      RESPOND_LOAD_SPACE_PROMPT_CHANNEL,
      (event, filePaths) => {
        if (filePaths && filePaths.length) {
          this.handleFileLocation(filePaths[0]);
        }
      }
    );
  };

  handleItemClicked = id => {
    const {
      history: { replace },
    } = this.props;
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
      case 4:
        replace(SETTINGS_PATH);
        break;
      default:
    }
  };

  render() {
    const { classes, theme, activity } = this.props;
    const { open, fileLocation } = this.state;
    if (activity) {
      return (
        <div className={classNames(classes.root, 'LoadSpace')}>
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
    return (
      <div className={classNames(classes.root, 'LoadSpace')}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classNames(classes.appBsar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar disableGutters={!open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
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
          <List>
            <MenuItem onClick={() => this.handleItemClicked(0)} button>
              <ListItemIcon>
                <SaveIcon />
              </ListItemIcon>
              <ListItemText primary="Saved spaces" />
            </MenuItem>
            <MenuItem onClick={() => this.handleItemClicked(1)} button>
              <ListItemIcon>
                <SearchSpace />
              </ListItemIcon>
              <ListItemText primary="Search Space" />
            </MenuItem>
            <MenuItem onClick={() => this.handleItemClicked(2)} button>
              <ListItemIcon>
                <Language />
              </ListItemIcon>
              <ListItemText primary="Visit a space" />
            </MenuItem>
            <MenuItem onClick={() => this.handleItemClicked(3)} button selected>
              <ListItemIcon>
                <Publish />
              </ListItemIcon>
              <ListItemText primary="Load" />
            </MenuItem>
            <MenuItem onClick={() => this.handleItemClicked(4)} button>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>
          </List>
        </Drawer>
        <main
          className={classNames('Main', classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <FormControl className={classes.formControl}>
            <Typography variant="h4" color="inherit" style={{ margin: '2rem' }}>
              Load a Space from a File
            </Typography>
            <Button
              variant="contained"
              onClick={this.handleBrowse}
              color="primary"
              className={classes.button}
            >
              Browse
            </Button>
            <Input
              required
              onChange={this.handleFileLocation}
              className={classes.input}
              inputProps={{
                'aria-label': 'Description',
              }}
              autoFocus
              value={fileLocation}
              type="text"
            />
            <Button
              variant="contained"
              onClick={this.handleLoad}
              color="primary"
              className={classes.button}
              disabled={!fileLocation.endsWith('.zip')}
            >
              Load
            </Button>
          </FormControl>
        </main>
      </div>
    );
  }
}

const mapDispatchToProps = {
  dispatchLoadSpace: loadSpace,
};

const mapStateToProps = ({ Space }) => ({
  activity: Space.get('current').get('activity'),
});

export default withRouter(
  withStyles(Styles, { withTheme: true })(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(LoadSpace)
  )
);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SaveIcon from '@material-ui/icons/Save';
import SearchIcon from '@material-ui/icons/Search';
import Language from '@material-ui/icons/Language';
import Publish from '@material-ui/icons/Publish';
import SettingsIcon from '@material-ui/icons/Settings';
import Styles from '../Styles';
import { HOME_PATH, LOAD_SPACE_PATH, SEARCH_SPACE_PATH, SETTINGS_PATH } from '../config/paths';

class VisitSpace extends Component {
  state = {
    open: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleItemClicked = (id) => {
    const { history: { replace } } = this.props;
    switch (id) {
      case 0:
        replace(HOME_PATH);
        break;
      case 1:
        replace(SEARCH_SPACE_PATH);
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
    const { classes, theme } = this.props;
    const { open } = this.state;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
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
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            <MenuItem onClick={() => this.handleItemClicked(0)} button>
              <ListItemIcon><SaveIcon /></ListItemIcon>
              <ListItemText primary="Saved spaces" />
            </MenuItem>
            <MenuItem onClick={() => this.handleItemClicked(1)} button>
              <ListItemIcon><SearchIcon /></ListItemIcon>
              <ListItemText primary="Search space" />
            </MenuItem>
            <MenuItem onClick={() => this.handleItemClicked(2)} button selected>
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
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <Typography variant="h5" color="inherit" align="center">
            VisitSpace
          </Typography>
        </main>
      </div>
    );
  }
}

export default withRouter(withStyles(Styles, { withTheme: true })(VisitSpace));

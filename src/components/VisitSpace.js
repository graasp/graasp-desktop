import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
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
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Styles from '../Styles';
import {
  HOME_PATH,
  LOAD_SPACE_PATH,
  SEARCH_SPACE_PATH,
  SETTINGS_PATH,
} from '../config/paths';
import Loader from './LoadSpace';
import {
  ERROR_MESSAGE_HEADER,
  OFFLINE_ERROR_MESSAGE,
} from '../config/messages';

class VisitSpace extends Component {
  state = {
    open: false,
    spaceId: '',
  };

  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
    theme: PropTypes.shape({}).isRequired,
    activity: PropTypes.bool,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    activity: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
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
      case 3:
        replace(LOAD_SPACE_PATH);
        break;
      case 4:
        replace(SETTINGS_PATH);
        break;
      default:
    }
  };

  handleChangeSpaceId = event => {
    const spaceId = event.target.value;
    this.setState({ spaceId });
  };

  handleClick = () => {
    const { history } = this.props;
    const { spaceId: id } = this.state;
    if (!window.navigator.onLine) {
      return toastr.error(ERROR_MESSAGE_HEADER, OFFLINE_ERROR_MESSAGE);
    }
    if (id && id !== '') {
      const { replace } = history;
      return replace(`/space/${id}`);
    }
    return false;
  };

  render() {
    const { classes, theme, activity } = this.props;
    const { open, spaceId } = this.state;

    if (activity) {
      return (
        <div className={classNames(classes.root, 'VisitSpace')}>
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
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="Search space" />
            </MenuItem>
            <MenuItem onClick={() => this.handleItemClicked(2)} button selected>
              <ListItemIcon>
                <Language />
              </ListItemIcon>
              <ListItemText primary="Visit a space" />
            </MenuItem>
            <MenuItem onClick={() => this.handleItemClicked(3)} button>
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
          className={classNames(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <FormControl className={classes.formControl}>
            <Typography
              variant="h4"
              color="inherit"
              align="center"
              style={{ margin: '2rem' }}
            >
              Visit a Space
            </Typography>
            <Input
              className={classes.input}
              required
              onChange={this.handleChangeSpaceId}
              inputProps={{
                'aria-label': 'Space ID',
              }}
              autoFocus
              value={spaceId}
              type="text"
            />
            <Button
              variant="contained"
              onClick={this.handleClick}
              color="primary"
              className={classes.button}
              disabled={!window.navigator.onLine || !spaceId || spaceId === ''}
            >
              Visit
            </Button>
          </FormControl>
        </main>
      </div>
    );
  }
}

const mapStateToProps = ({ Space }) => ({
  activity: Space.get('current').get('activity'),
});

const ConnectedComponent = connect(mapStateToProps)(VisitSpace);
const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);
export default withRouter(StyledComponent);

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
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import FormControl from '@material-ui/core/FormControl';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Input from '@material-ui/core/Input';
import { loadSpace } from '../actions/space';
import './LoadSpace.css';
import Styles from '../Styles';
import Loader from './common/Loader';
import {
  RESPOND_LOAD_SPACE_PROMPT_CHANNEL,
  SHOW_LOAD_SPACE_PROMPT_CHANNEL,
} from '../config/channels';
import MainMenu from './common/MainMenu';

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

  handleFileLocation = event => {
    const fileLocation = event.target.value;
    this.setState({ fileLocation });
  };

  handleLoad = () => {
    const { fileLocation } = this.state;
    const { dispatchLoadSpace } = this.props;
    dispatchLoadSpace({ fileLocation });
    this.setState({ fileLocation });
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
          <MainMenu />
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

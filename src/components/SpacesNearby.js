import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Map, Set } from 'immutable';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Styles from '../Styles';
import MainMenu from './common/MainMenu';
import { getSpacesNearby } from '../actions';
import SpaceGrid from './space/SpaceGrid';
import Loader from './common/Loader';
import GeolocationControl from './common/GeolocationControl';
import { CONTROL_TYPES } from '../config/constants';

class SpacesNearby extends Component {
  state = {
    open: false,
  };

  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
    theme: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    dispatchGetSpacesNearby: PropTypes.func.isRequired,
    geolocation: PropTypes.instanceOf(Map),
    spaces: PropTypes.instanceOf(Set).isRequired,
    activity: PropTypes.bool,
    geolocationEnabled: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    geolocation: Map(),
    activity: false,
  };

  constructor(props) {
    super(props);
    this.getSpacesNearby();
  }

  componentDidUpdate({ geolocation: prevGeolocation }) {
    const { geolocation } = this.props;
    if (!geolocation.equals(prevGeolocation)) {
      this.getSpacesNearby();
    }
  }

  getSpacesNearby = () => {
    const { dispatchGetSpacesNearby, geolocation } = this.props;
    if (!geolocation.isEmpty()) {
      const {
        coords: { latitude, longitude },
      } = geolocation.toJS();
      dispatchGetSpacesNearby({
        latitude,
        longitude,
      });
    }
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, theme, spaces, activity, geolocationEnabled } = this.props;
    const { open } = this.state;

    if (activity) {
      return (
        <div className={classNames(classes.root)} style={{ height: '100%' }}>
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

    const geolocationContent = geolocationEnabled ? (
      <SpaceGrid spaces={spaces} />
    ) : (
      <div className="Main">
        <GeolocationControl controlType={CONTROL_TYPES.BUTTON} />
      </div>
    );

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
              aria-label="Open Drawer"
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
          className={classNames(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          {geolocationContent}
        </main>
      </div>
    );
  }
}

const mapStateToProps = ({ User, Space }) => ({
  geolocation: User.getIn(['current', 'geolocation']),
  spaces: Space.getIn(['nearby', 'content']),
  activity: Boolean(Space.getIn(['nearby', 'activity']).size),
  geolocationEnabled: User.getIn(['current', 'geolocationEnabled']),
});

const mapDispatchToProps = {
  dispatchGetSpacesNearby: getSpacesNearby,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SpacesNearby);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

export default withRouter(StyledComponent);

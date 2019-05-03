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
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Styles from '../Styles';
import MainMenu from './common/MainMenu';
import { getSpacesNearby } from '../actions';
import SpaceGrid from './space/SpaceGrid';

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
  };

  static defaultProps = {
    geolocation: Map(),
  };

  constructor(props) {
    super(props);
    this.getSpacesNearby();
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
    const { classes, theme, spaces } = this.props;
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
          <Typography variant="h5" color="inherit">
            Spaces Nearby
          </Typography>
          <SpaceGrid spaces={spaces} />
        </main>
      </div>
    );
  }
}

const mapStateToProps = ({ User, Space }) => ({
  spaces: Space.get('nearby'),
  geolocation: User.getIn(['current', 'geolocation']),
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

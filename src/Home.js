import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { getSpaces } from './actions';
import SpaceGrid from './components/space/SpaceGrid';
import Styles from './Styles';
import Loader from './components/common/Loader';
import MainMenu from './components/common/MainMenu';

class Home extends Component {
  state = {
    open: false,
  };

  static propTypes = {
    classes: PropTypes.shape({ appBar: PropTypes.string.isRequired })
      .isRequired,
    theme: PropTypes.shape({ direction: PropTypes.string }).isRequired,
    dispatchGetSpaces: PropTypes.func.isRequired,
    spaces: ImmutablePropTypes.setOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      })
    ).isRequired,
    activity: PropTypes.bool.isRequired,
    history: PropTypes.shape({ length: PropTypes.number.isRequired })
      .isRequired,
  };

  componentDidMount() {
    const { dispatchGetSpaces } = this.props;
    dispatchGetSpaces();
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, theme, spaces, activity } = this.props;
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
          <MainMenu />
        </Drawer>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <SpaceGrid spaces={spaces} />
        </main>
      </div>
    );
  }
}

const mapStateToProps = ({ Space }) => ({
  spaces: Space.get('saved'),
  activity: Space.get('current').get('activity'),
});

const mapDispatchToProps = {
  dispatchGetSpaces: getSpaces,
};

export default withRouter(
  withStyles(Styles, { withTheme: true })(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Home)
  )
);

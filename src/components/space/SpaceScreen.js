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
import HomeIcon from '@material-ui/icons/Home';
import Drawer from '@material-ui/core/Drawer/Drawer';
import Divider from '@material-ui/core/Divider/Divider';
import List from '@material-ui/core/List/List';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router';
import Loader from '../common/Loader';
import PhaseComponent from '../phase/Phase';
import { selectPhase, clearPhase, clearSpace, getSpace } from '../../actions';
import './SpaceScreen.css';
import Styles from '../../Styles';
import { HOME_PATH } from '../../config/paths';
import SpaceHeader from './SpaceHeader';
import SpaceNotFound from './SpaceNotFound';
import MainMenu from '../common/MainMenu';

class SpaceScreen extends Component {
  state = {
    openDrawer: true,
    selected: -1,
  };

  static propTypes = {
    spaces: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      })
    ).isRequired,
    space: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
    phase: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      })
    ).isRequired,
    dispatchSelectPhase: PropTypes.func.isRequired,
    dispatchClearPhase: PropTypes.func.isRequired,
    activity: PropTypes.bool.isRequired,
    deleted: PropTypes.bool.isRequired,
    classes: PropTypes.shape({ appBar: PropTypes.string.isRequired })
      .isRequired,
    theme: PropTypes.shape({ direction: PropTypes.string.isRequired })
      .isRequired,
    match: PropTypes.shape({ params: { id: PropTypes.string.isRequired } })
      .isRequired,
    dispatchGetSpace: PropTypes.func.isRequired,
    dispatchClearSpace: PropTypes.func.isRequired,
    history: PropTypes.shape({ length: PropTypes.number.isRequired })
      .isRequired,
  };

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      dispatchGetSpace,
      spaces,
    } = this.props;
    dispatchGetSpace({ id, spaces });
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
    const { dispatchClearSpace } = this.props;
    dispatchClearSpace();
  }

  handleDrawerOpen = () => {
    this.setState({ openDrawer: true });
  };

  handleDrawerClose = () => {
    this.setState({ openDrawer: false });
  };

  handlePhaseClicked = i => {
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

  render() {
    const { space, phase, activity, classes, theme } = this.props;
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
      return <SpaceNotFound />;
    }
    const phases = space.get('phases');
    //  const description = space.get('description');
    return (
      <div className={classes.root} style={{ height: '100%' }}>
        <CssBaseline />
        <SpaceHeader
          handleDrawerOpen={this.handleDrawerOpen}
          openDrawer={openDrawer}
        />
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
          <List>
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
            {phases.map((item, i) => (
              <MenuItem
                onClick={() => this.handlePhaseClicked(i)}
                key={item.id}
                selected={selected === i}
              >
                <ListItemIcon>
                  <ChevronRightIcon />
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </MenuItem>
            ))}
          </List>
          <Divider />
          <MainMenu />
        </Drawer>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: openDrawer,
          })}
          style={{ height: '100%' }}
        >
          <div className={classes.drawerHeader} />
          <PhaseComponent
            phase={phase}
            start={() => this.handlePhaseClicked(0)}
          />
        </main>
      </div>
    );
  }
}

const mapStateToProps = ({ Space, Phase }) => ({
  space: Space.get('current').get('content'),
  open: Space.get('current')
    .get('menu')
    .get('open'),
  phase: Phase.get('current').get('content'),
  activity: Space.get('current').get('activity'),
  deleted: Space.get('current').get('deleted'),
  spaces: Space.get('saved'),
});

const mapDispatchToProps = {
  dispatchSelectPhase: selectPhase,
  dispatchGetSpace: getSpace,
  dispatchClearPhase: clearPhase,
  dispatchClearSpace: clearSpace,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SpaceScreen);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

export default withRouter(StyledComponent);

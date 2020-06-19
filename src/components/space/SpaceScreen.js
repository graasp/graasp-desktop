import React, { Component } from 'react';
import Qs from 'qs';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { List as ImmList } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import AppBar from '@material-ui/core/AppBar/AppBar';
import classNames from 'classnames';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
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
import {
  selectPhase,
  clearPhase,
  clearSpace,
  getSpace,
  setSpaceAsRecent,
} from '../../actions';
import './SpaceScreen.css';
import Styles from '../../Styles';
import { HOME_PATH } from '../../config/paths';
import SpaceHeader from './SpaceHeader';
import SpaceNotFound from './SpaceNotFound';
import MainMenu from '../common/MainMenu';
import {
  PHASE_MENU_LIST_ID,
  buildPhaseMenuItemId,
} from '../../config/selectors';
import DrawerHeader from '../common/DrawerHeader';

class SpaceScreen extends Component {
  state = {
    openDrawer: true,
    selected: -1,
  };

  static propTypes = {
    space: ImmutablePropTypes.contains({
      id: PropTypes.string,
      description: PropTypes.string,
    }).isRequired,
    phase: ImmutablePropTypes.contains({
      id: PropTypes.string,
    }).isRequired,
    dispatchSelectPhase: PropTypes.func.isRequired,
    dispatchClearPhase: PropTypes.func.isRequired,
    dispatchGetSpace: PropTypes.func.isRequired,
    dispatchClearSpace: PropTypes.func.isRequired,
    activity: PropTypes.bool.isRequired,
    deleted: PropTypes.bool.isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
      appBar: PropTypes.string.isRequired,
      drawer: PropTypes.string.isRequired,
      drawerPaper: PropTypes.string.isRequired,
      drawerHeader: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      contentShift: PropTypes.string.isRequired,
    }).isRequired,
    theme: PropTypes.shape({ direction: PropTypes.string.isRequired })
      .isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      length: PropTypes.number.isRequired,
      replace: PropTypes.func.isRequired,
    }).isRequired,
    recentSpaces: PropTypes.instanceOf(ImmList).isRequired,
    dispatchSetSpaceAsRecent: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      location: { search },
      dispatchGetSpace,
    } = this.props;

    // tell action creator if this space has already been saved
    const { saved } = Qs.parse(search, { ignoreQueryPrefix: true });
    dispatchGetSpace({ id, saved: saved === 'true' });
  }

  componentDidUpdate() {
    const { selected } = this.state;
    const {
      deleted,
      phase,
      history: { replace },
      space,
      recentSpaces,
      dispatchSetSpaceAsRecent,
    } = this.props;
    // redirect to home if space is deleted
    if (deleted) {
      replace(HOME_PATH);
    } else if (selected !== -1 && (!phase || phase.isEmpty())) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ selected: -1 });
    }

    if (space && !space.isEmpty()) {
      const spaceId = space.get('id');
      const recentIndex = recentSpaces.indexOf(spaceId);

      // update recent spaces if space is not recent
      // or space is not most recent space
      if (recentIndex < 0 || recentIndex !== recentSpaces.size - 1) {
        dispatchSetSpaceAsRecent({ spaceId, recent: true });
      }
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
    const { space, phase, activity, classes } = this.props;
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

    // fall back on empty array if no phases
    const phases = space.get('phases') || [];
    //  const description = space.get('description');
    return (
      <div className={classes.root}>
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
          <DrawerHeader handleDrawerClose={this.handleDrawerClose} />
          <List id={PHASE_MENU_LIST_ID}>
            <MenuItem
              onClick={this.handleClearPhase}
              button
              selected={selected === -1}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={space.get('name')} />
            </MenuItem>
            {phases.map((item, i) => (
              <MenuItem
                onClick={() => this.handlePhaseClicked(i)}
                key={item.id}
                selected={selected === i}
                id={buildPhaseMenuItemId(i)}
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

const mapStateToProps = ({ Space, Phase, authentication }) => ({
  space: Space.get('current').get('content'),
  open: Space.get('current')
    .get('menu')
    .get('open'),
  phase: Phase.get('current').get('content'),
  activity: Boolean(Space.getIn(['current', 'activity']).size),
  deleted: Space.get('current').get('deleted'),
  recentSpaces: authentication.getIn(['user', 'recentSpaces']),
});

const mapDispatchToProps = {
  dispatchSelectPhase: selectPhase,
  dispatchGetSpace: getSpace,
  dispatchClearPhase: clearPhase,
  dispatchClearSpace: clearSpace,
  dispatchSetSpaceAsRecent: setSpaceAsRecent,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SpaceScreen);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

export default withRouter(StyledComponent);

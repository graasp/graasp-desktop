import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';
import SearchIcon from '@material-ui/icons/Search';
import Language from '@material-ui/icons/Language';
import CodeIcon from '@material-ui/icons/Code';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircle from '@material-ui/icons/AccountCircle';
import List from '@material-ui/core/List';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import HomeIcon from '@material-ui/icons/Home';
import PublishIcon from '@material-ui/icons/Publish';
import SettingsIcon from '@material-ui/icons/Settings';
import { Online, Offline } from 'react-detect-offline';
import { withTranslation } from 'react-i18next';
import {
  HOME_PATH,
  LOAD_SPACE_PATH,
  SETTINGS_PATH,
  SPACES_NEARBY_PATH,
  VISIT_PATH,
  DEVELOPER_PATH,
  DASHBOARD_PATH,
  SIGN_IN_PATH,
  SAVED_SPACES_PATH,
  CLASSROOMS_PATH,
} from '../../config/paths';
import {
  SETTINGS_MENU_ITEM_ID,
  LOAD_MENU_ITEM_ID,
  HOME_MENU_ITEM_ID,
  VISIT_MENU_ITEM_ID,
  SPACES_NEARBY_MENU_ITEM_ID,
  DASHBOARD_MENU_ITEM_ID,
  DEVELOPER_MENU_ITEM_ID,
  SIGN_OUT_MENU_ITEM_ID,
  SAVED_SPACES_MENU_ITEM_ID,
} from '../../config/selectors';
import { signOut } from '../../actions/authentication';
import { AUTHENTICATED, USER_MODES } from '../../config/constants';

export class MainMenu extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    developerMode: PropTypes.bool.isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
    dispatchSignOut: PropTypes.func.isRequired,
    authenticated: PropTypes.bool.isRequired,
    location: PropTypes.shape({ pathname: PropTypes.string.isRequired })
      .isRequired,
    userMode: PropTypes.oneOf(Object.values(USER_MODES)).isRequired,
  };

  handleClick = path => {
    const {
      history: { push },
    } = this.props;
    if (path) {
      push(path);
    } else {
      // default to home
      push(HOME_PATH);
    }
  };

  handleSignOut() {
    // pathname inside location matches the path in url
    const { location: { pathname } = {}, dispatchSignOut } = this.props;
    if (pathname) {
      sessionStorage.setItem('redirect', pathname);
    }

    dispatchSignOut();
  }

  renderSignOut() {
    const {
      authenticated,
      t,
      match: { path },
    } = this.props;

    if (authenticated) {
      return (
        <MenuItem
          id={SIGN_OUT_MENU_ITEM_ID}
          onClick={() => {
            this.handleSignOut();
          }}
          selected={path === SIGN_IN_PATH}
          button
        >
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary={t('Sign Out')} />
        </MenuItem>
      );
    }
    return null;
  }

  renderDeveloperMode() {
    const {
      developerMode,
      t,
      match: { path },
    } = this.props;

    if (developerMode) {
      return (
        <MenuItem
          id={DEVELOPER_MENU_ITEM_ID}
          onClick={() => this.handleClick(DEVELOPER_PATH)}
          selected={path === DEVELOPER_PATH}
          button
        >
          <ListItemIcon>
            <CodeIcon />
          </ListItemIcon>
          <ListItemText primary={t('Developer')} />
        </MenuItem>
      );
    }
    return null;
  }

  renderOfflineMenuItem = child => {
    const { t } = this.props;

    return (
      <>
        <Offline>
          <Tooltip
            placement="right"
            title={t('You need an internet connection.')}
          >
            <div>{React.cloneElement(child, { disabled: true })}</div>
          </Tooltip>
        </Offline>
        <Online>{child}</Online>
      </>
    );
  };

  renderDashboard = () => {
    const {
      authenticated,
      match: { path },
      t,
    } = this.props;
    if (authenticated) {
      return (
        <MenuItem
          id={DASHBOARD_MENU_ITEM_ID}
          onClick={() => this.handleClick(DASHBOARD_PATH)}
          button
          selected={path === DASHBOARD_PATH}
        >
          <ListItemIcon>
            <ShowChartIcon />
          </ListItemIcon>
          <ListItemText primary={t('Dashboard')} />
        </MenuItem>
      );
    }
    return null;
  };

  renderClassrooms = () => {
    const {
      authenticated,
      userMode,
      match: { path },
      t,
    } = this.props;

    if (authenticated && userMode === USER_MODES.TEACHER) {
      return (
        <MenuItem
          onClick={() => this.handleClick(CLASSROOMS_PATH)}
          button
          selected={path === CLASSROOMS_PATH}
        >
          <ListItemIcon>
            <ShowChartIcon />
          </ListItemIcon>
          <ListItemText primary={t('Classrooms')} />
        </MenuItem>
      );
    }
    return null;
  };

  renderAuthenticatedMenu() {
    const {
      authenticated,
      t,
      match: { path },
    } = this.props;

    if (authenticated) {
      return (
        <>
          <MenuItem
            id={HOME_MENU_ITEM_ID}
            onClick={() => this.handleClick(HOME_PATH)}
            button
            selected={path === HOME_PATH}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={t('Home')} />
          </MenuItem>
          <MenuItem
            id={SAVED_SPACES_MENU_ITEM_ID}
            onClick={() => this.handleClick(SAVED_SPACES_PATH)}
            button
            selected={path === SAVED_SPACES_PATH}
          >
            <ListItemIcon>
              <SaveIcon />
            </ListItemIcon>
            <ListItemText primary={t('Saved Spaces')} />
          </MenuItem>
          {this.renderOfflineMenuItem(
            <MenuItem
              id={SPACES_NEARBY_MENU_ITEM_ID}
              onClick={() => this.handleClick(SPACES_NEARBY_PATH)}
              button
              selected={path === SPACES_NEARBY_PATH}
            >
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary={t('Spaces Nearby')} />
            </MenuItem>
          )}
          {this.renderOfflineMenuItem(
            <MenuItem
              id={VISIT_MENU_ITEM_ID}
              onClick={() => this.handleClick(VISIT_PATH)}
              button
              selected={path === VISIT_PATH}
            >
              <ListItemIcon>
                <Language />
              </ListItemIcon>
              <ListItemText primary={t('Visit a Space')} />
            </MenuItem>
          )}
          <MenuItem
            id={LOAD_MENU_ITEM_ID}
            onClick={() => this.handleClick(LOAD_SPACE_PATH)}
            button
            selected={path === LOAD_SPACE_PATH}
          >
            <ListItemIcon>
              <PublishIcon />
            </ListItemIcon>
            <ListItemText primary={t('Load')} />
          </MenuItem>
        </>
      );
    }
    return (
      <MenuItem
        onClick={() => {
          this.handleClick(SIGN_IN_PATH);
        }}
        selected={path === SIGN_IN_PATH}
        button
      >
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
        <ListItemText primary={t('Sign In')} />
      </MenuItem>
    );
  }

  render() {
    const {
      match: { path },
      t,
    } = this.props;
    return (
      <List>
        {this.renderAuthenticatedMenu()}
        <MenuItem
          id={SETTINGS_MENU_ITEM_ID}
          onClick={() => this.handleClick(SETTINGS_PATH)}
          button
          selected={path === SETTINGS_PATH}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={t('Settings')} />
        </MenuItem>
        {this.renderDashboard()}
        {this.renderClassrooms()}
        {this.renderDeveloperMode()}
        {this.renderSignOut()}
      </List>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  authenticated: authentication.getIn(['authenticated']) === AUTHENTICATED,
  developerMode: authentication.getIn(['user', 'settings', 'developerMode']),
  userMode: authentication.getIn(['user', 'settings', 'userMode']),
  activity: Boolean(authentication.getIn(['current', 'activity']).size),
});
const mapDispatchToProps = {
  dispatchSignOut: signOut,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainMenu);

const TranslatedComponent = withTranslation()(ConnectedComponent);

export default withRouter(TranslatedComponent);

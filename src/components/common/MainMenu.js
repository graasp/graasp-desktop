import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SaveIcon from '@material-ui/icons/Save';
import CodeIcon from '@material-ui/icons/Code';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import SearchIcon from '@material-ui/icons/Search';
import Language from '@material-ui/icons/Language';
import PublishIcon from '@material-ui/icons/Publish';
import SettingsIcon from '@material-ui/icons/Settings';
import { Online } from 'react-detect-offline';
import { withTranslation } from 'react-i18next';
import { signOutUser } from '../../actions/authentication';
import {
  HOME_PATH,
  LOAD_SPACE_PATH,
  SETTINGS_PATH,
  SPACES_NEARBY_PATH,
  VISIT_PATH,
  DEVELOPER_PATH,
  LOGIN_PATH,
} from '../../config/paths';
import { AUTHENTICATED } from '../../config/constants';

class MainMenu extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    developerMode: PropTypes.bool.isRequired,
    history: PropTypes.shape({ replace: PropTypes.func.isRequired }).isRequired,
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
    dispatchSignOut: PropTypes.func.isRequired,
    authenticated: PropTypes.bool.isRequired,
    location: PropTypes.shape({ pathname: PropTypes.string.isRequired })
      .isRequired,
  };

  handleClick = path => {
    const {
      history: { replace },
    } = this.props;
    if (path) {
      replace(path);
    } else {
      // default to home
      replace(HOME_PATH);
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

  renderLogOut() {
    const {
      authenticated,
      t,
      match: { path },
    } = this.props;

    if (authenticated) {
      return (
        <MenuItem
          onClick={() => {
            this.handleSignOut();
          }}
          selected={path === LOGIN_PATH}
          button
        >
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary={t('Log Out')} />
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
            onClick={() => this.handleClick(HOME_PATH)}
            button
            selected={path === HOME_PATH}
          >
            <ListItemIcon>
              <SaveIcon />
            </ListItemIcon>
            <ListItemText primary={t('Saved Spaces')} />
          </MenuItem>
          <Online>
            <MenuItem
              onClick={() => this.handleClick(SPACES_NEARBY_PATH)}
              button
              selected={path === SPACES_NEARBY_PATH}
            >
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary={t('Spaces Nearby')} />
            </MenuItem>
            <MenuItem
              onClick={() => this.handleClick(VISIT_PATH)}
              button
              selected={path === VISIT_PATH}
            >
              <ListItemIcon>
                <Language />
              </ListItemIcon>
              <ListItemText primary={t('Visit a Space')} />
            </MenuItem>
          </Online>
          <MenuItem
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
          this.handleClick(LOGIN_PATH);
        }}
        selected={path === LOGIN_PATH}
        button
      >
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
        <ListItemText primary={t('Login')} />
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
          onClick={() => this.handleClick(SETTINGS_PATH)}
          button
          selected={path === SETTINGS_PATH}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={t('Settings')} />
        </MenuItem>
        {this.renderDeveloperMode()}
        {this.renderLogOut()}
      </List>
    );
  }
}

const mapStateToProps = ({ User, Authentication }) => ({
  authenticated: Authentication.getIn(['authenticated']) === AUTHENTICATED,
  developerMode: User.getIn(['current', 'developerMode']),
  activity: Boolean(User.getIn(['current', 'activity']).size),
});

const mapDispatchToProps = {
  dispatchSignOut: signOutUser,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainMenu);

const TranslatedComponent = withTranslation()(ConnectedComponent);

export default withRouter(TranslatedComponent);

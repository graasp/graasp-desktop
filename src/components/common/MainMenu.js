import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';
import CodeIcon from '@material-ui/icons/Code';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import SearchIcon from '@material-ui/icons/Search';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import Language from '@material-ui/icons/Language';
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
} from '../../config/paths';
import {
  SETTINGS_MENU_ITEM_ID,
  LOAD_MENU_ITEM_ID,
  HOME_MENU_ITEM_ID,
  VISIT_MENU_ITEM_ID,
  SPACES_NEARBY_MENU_ITEM_ID,
  DASHBOARD_MENU_ITEM_ID,
} from '../../config/selectors';

export class MainMenu extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    developerMode: PropTypes.bool.isRequired,
    history: PropTypes.shape({ replace: PropTypes.func.isRequired }).isRequired,
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
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

  render() {
    const {
      match: { path },
      t,
    } = this.props;
    return (
      <List>
        <MenuItem
          id={HOME_MENU_ITEM_ID}
          onClick={() => this.handleClick(HOME_PATH)}
          button
          selected={path === HOME_PATH}
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
        {this.renderDeveloperMode()}
      </List>
    );
  }
}

const mapStateToProps = ({ User }) => ({
  developerMode: User.getIn(['current', 'developerMode']),
  activity: Boolean(User.getIn(['current', 'activity']).size),
});

const ConnectedComponent = connect(mapStateToProps)(MainMenu);

const TranslatedComponent = withTranslation()(ConnectedComponent);

export default withRouter(TranslatedComponent);

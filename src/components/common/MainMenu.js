import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SaveIcon from '@material-ui/icons/Save';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import SearchIcon from '@material-ui/icons/Search';
import Language from '@material-ui/icons/Language';
import PublishIcon from '@material-ui/icons/Publish';
import SettingsIcon from '@material-ui/icons/Settings';
import { Online } from 'react-detect-offline';
import { withTranslation } from 'react-i18next';
import {
  HOME_PATH,
  LOAD_SPACE_PATH,
  SETTINGS_PATH,
  SPACES_NEARBY_PATH,
  VISIT_PATH,
} from '../../config/paths';

class MainMenu extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    history: PropTypes.shape({ replace: PropTypes.func.isRequired }).isRequired,
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
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
        replace(SPACES_NEARBY_PATH);
        break;
      case 2:
        replace(VISIT_PATH);
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

  render() {
    const {
      match: { path },
      t,
    } = this.props;
    return (
      <List>
        <MenuItem
          onClick={() => this.handleItemClicked(0)}
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
            onClick={() => this.handleItemClicked(1)}
            button
            selected={path === SPACES_NEARBY_PATH}
          >
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary={t('Spaces Nearby')} />
          </MenuItem>
          <MenuItem
            onClick={() => this.handleItemClicked(2)}
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
          onClick={() => this.handleItemClicked(3)}
          button
          selected={path === LOAD_SPACE_PATH}
        >
          <ListItemIcon>
            <PublishIcon />
          </ListItemIcon>
          <ListItemText primary={t('Load')} />
        </MenuItem>
        <MenuItem
          onClick={() => this.handleItemClicked(4)}
          button
          selected={path === SETTINGS_PATH}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={t('Settings')} />
        </MenuItem>
      </List>
    );
  }
}

const TranslatedComponent = withTranslation()(MainMenu);
export default withRouter(TranslatedComponent);

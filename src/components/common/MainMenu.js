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
import Publish from '@material-ui/icons/Publish';
import { Online } from 'react-detect-offline';
import {
  HOME_PATH,
  LOAD_SPACE_PATH,
  SPACES_NEARBY_PATH,
  VISIT_PATH,
} from '../../config/paths';

class MainMenu extends Component {
  static propTypes = {
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
      default:
    }
  };

  render() {
    const {
      match: { path },
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
          <ListItemText primary="Saved Spaces" />
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
            <ListItemText primary="Spaces Nearby" />
          </MenuItem>
          <MenuItem
            onClick={() => this.handleItemClicked(2)}
            button
            selected={path === VISIT_PATH}
          >
            <ListItemIcon>
              <Language />
            </ListItemIcon>
            <ListItemText primary="Visit a Space" />
          </MenuItem>
        </Online>
        <MenuItem
          onClick={() => this.handleItemClicked(3)}
          button
          selected={path === LOAD_SPACE_PATH}
        >
          <ListItemIcon>
            <Publish />
          </ListItemIcon>
          <ListItemText primary="Load" />
        </MenuItem>
      </List>
    );
  }
}

export default withRouter(MainMenu);

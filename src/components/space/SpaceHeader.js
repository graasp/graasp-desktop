import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuIcon from '@material-ui/icons/Menu';
import AppBar from '@material-ui/core/AppBar/AppBar';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import WarningIcon from '@material-ui/icons/Warning';
import WifiIcon from '@material-ui/icons/Wifi';
import SyncIcon from '@material-ui/icons/Sync';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import { Online } from 'react-detect-offline';
import { withTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core';
import Styles from '../../Styles';
import {
  deleteSpace,
  exportSpace,
  saveSpace,
  syncSpace,
} from '../../actions/space';

class SpaceHeader extends Component {
  static propTypes = {
    space: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    classes: PropTypes.shape({ appBar: PropTypes.string.isRequired })
      .isRequired,
    openDrawer: PropTypes.bool.isRequired,
    handleDrawerOpen: PropTypes.func.isRequired,
    dispatchExportSpace: PropTypes.func.isRequired,
    dispatchDeleteSpace: PropTypes.func.isRequired,
    dispatchSaveSpace: PropTypes.func.isRequired,
    dispatchSyncSpace: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  handleExport = () => {
    const { space, dispatchExportSpace } = this.props;
    const { id, name } = space;
    dispatchExportSpace(id, name);
  };

  handleDelete = () => {
    const {
      space: { id },
      dispatchDeleteSpace,
    } = this.props;
    dispatchDeleteSpace({ id });
  };

  handleSave = () => {
    const { space, dispatchSaveSpace } = this.props;
    dispatchSaveSpace({ space });
  };

  handleSync = () => {
    const {
      space: { id },
      dispatchSyncSpace,
    } = this.props;
    dispatchSyncSpace({ id });
  };

  renderSaveButton() {
    const { space, classes, t } = this.props;
    const { saved, offlineSupport } = space;
    if (!saved) {
      if (offlineSupport) {
        return (
          <Tooltip title={t('Save this space for offline use.')}>
            <IconButton
              className={classes.button}
              color="inherit"
              onClick={this.handleSave}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
        );
      }
      return (
        <Tooltip title={t('This space requires an internet connection.')}>
          <IconButton className={classes.button} color="inherit">
            <WifiIcon />
          </IconButton>
        </Tooltip>
      );
    }
    return null;
  }

  renderExportButton() {
    const { space, classes, t } = this.props;
    const { saved } = space;
    if (saved) {
      return (
        <Tooltip title={t('Export this space to share with others.')}>
          <IconButton
            color="inherit"
            onClick={this.handleExport}
            className={classes.button}
          >
            <UnarchiveIcon className={classes.rightIcon} />
          </IconButton>
        </Tooltip>
      );
    }
    return null;
  }

  renderDeleteButton() {
    const { space, classes, t } = this.props;
    const { saved } = space;
    if (saved) {
      return (
        <Tooltip title={t('Delete this space.')}>
          <IconButton
            color="inherit"
            onClick={this.handleDelete}
            className={classes.button}
          >
            <DeleteIcon className={classes.rightIcon} />
          </IconButton>
        </Tooltip>
      );
    }
    return null;
  }

  renderPreviewIcon() {
    const { space, classes, t } = this.props;
    const { saved } = space;
    if (!saved) {
      return (
        <Tooltip
          title={t(
            'You are previewing this space. Any input or changes will not be saved.'
          )}
        >
          <IconButton color="inherit" className={classes.button}>
            <WarningIcon className={classes.rightIcon} />
          </IconButton>
        </Tooltip>
      );
    }
    return null;
  }

  renderSyncButton() {
    const { space, classes, t } = this.props;
    const { saved } = space;
    if (saved) {
      return (
        <Online>
          <Tooltip
            title={t(
              'Synchronize this space with its online version. All user input will be deleted.'
            )}
          >
            <IconButton color="inherit" className={classes.button}>
              <SyncIcon
                className={classes.rightIcon}
                onClick={this.handleSync}
              />
            </IconButton>
          </Tooltip>
        </Online>
      );
    }
    return null;
  }

  render() {
    const {
      openDrawer,
      classes,
      space: { name },
      handleDrawerOpen,
    } = this.props;
    return (
      <AppBar
        position="fixed"
        className={classNames(classes.appBar, {
          [classes.appBarShift]: openDrawer,
        })}
      >
        <Toolbar disableGutters={!openDrawer}>
          <IconButton
            color="inherit"
            aria-label="Open Drawer"
            onClick={handleDrawerOpen}
            className={classNames(
              classes.menuButton,
              openDrawer && classes.hide
            )}
          >
            <MenuIcon />
          </IconButton>
          {name}
          <span style={{ position: 'absolute', right: 20 }}>
            {this.renderSyncButton()}
            {this.renderPreviewIcon()}
            {this.renderDeleteButton()}
            {this.renderExportButton()}
            {this.renderSaveButton()}
          </span>
        </Toolbar>
      </AppBar>
    );
  }
}

const mapStateToProps = ({ Space }) => ({
  space: Space.get('current')
    .get('content')
    .toJS(),
});

const mapDispatchToProps = {
  dispatchExportSpace: exportSpace,
  dispatchDeleteSpace: deleteSpace,
  dispatchSaveSpace: saveSpace,
  dispatchSyncSpace: syncSpace,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SpaceHeader);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

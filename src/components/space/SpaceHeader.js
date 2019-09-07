import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuIcon from '@material-ui/icons/Menu';
import AppBar from '@material-ui/core/AppBar/AppBar';
import SaveIcon from '@material-ui/icons/Save';
import WarningIcon from '@material-ui/icons/Warning';
import WifiIcon from '@material-ui/icons/Wifi';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import { withTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core';
import Styles from '../../Styles';
import { saveSpace } from '../../actions/space';
import DeleteButton from './DeleteButton';
import ExportButton from './ExportButton';
import SyncButton from './SyncButton';
import ClearButton from './ClearButton';

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
    dispatchSaveSpace: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  handleSave = () => {
    const { space, dispatchSaveSpace } = this.props;
    dispatchSaveSpace({ space });
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
    const { space } = this.props;
    const { saved } = space;
    if (saved) {
      return <ExportButton space={space} />;
    }
    return null;
  }

  renderDeleteButton() {
    const { space } = this.props;
    const { saved, id } = space;
    if (saved) {
      return <DeleteButton id={id} />;
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
            <WarningIcon />
          </IconButton>
        </Tooltip>
      );
    }
    return null;
  }

  renderSyncButton() {
    const { space } = this.props;
    const { saved, id } = space;
    if (saved) {
      return <SyncButton id={id} />;
    }
    return null;
  }

  renderClearButton() {
    const { space } = this.props;
    const { saved, id } = space;
    if (saved) {
      return <ClearButton id={id} />;
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
            {this.renderClearButton()}
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
  dispatchSaveSpace: saveSpace,
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

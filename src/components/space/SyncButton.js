import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton/IconButton';
import SyncIcon from '@material-ui/icons/Sync';
import { Online, Offline } from 'react-detect-offline';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core';
import Styles from '../../Styles';
import { syncSpace } from '../../actions/space';

class SyncButton extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    classes: PropTypes.shape({
      appBar: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
    }).isRequired,
    dispatchSyncSpace: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  handleSync = () => {
    const { id, dispatchSyncSpace } = this.props;
    dispatchSyncSpace({ id });
  };

  render() {
    const { classes, t } = this.props;
    return (
      <>
        <Online>
          <Tooltip
            title={t(
              'Synchronize this space with its online version. All user input will be deleted.'
            )}
          >
            <IconButton
              color="inherit"
              className={classes.button}
              onClick={this.handleSync}
            >
              <SyncIcon />
            </IconButton>
          </Tooltip>
        </Online>
        <Offline>
          <Tooltip title={t('You need an internet connection')}>
            <div>
              <IconButton color="inherit" className={classes.button} disabled>
                <SyncIcon />
              </IconButton>
            </div>
          </Tooltip>
        </Offline>
      </>
    );
  }
}
const mapDispatchToProps = {
  dispatchSyncSpace: syncSpace,
};

const ConnectedComponent = connect(null, mapDispatchToProps)(SyncButton);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

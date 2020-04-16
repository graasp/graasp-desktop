import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton/IconButton';
import SyncIcon from '@material-ui/icons/Sync';
import { Online, Offline } from 'react-detect-offline';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core';
import Styles from '../../Styles';
import { SPACE_SYNC_BUTTON_CLASS } from '../../config/selectors';

class SyncButton extends Component {
  static propTypes = {
    spaceId: PropTypes.string.isRequired,
    classes: PropTypes.shape({
      appBar: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  handleSync = () => {
    const {
      spaceId,
      history: { push },
    } = this.props;
    return push(`/space/sync/${spaceId}?saved=true`);
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
              className={clsx(classes.button, SPACE_SYNC_BUTTON_CLASS)}
              onClick={this.handleSync}
            >
              <SyncIcon />
            </IconButton>
          </Tooltip>
        </Online>
        <Offline>
          <Tooltip title={t('You need an internet connection.')}>
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

const StyledComponent = withStyles(Styles, { withTheme: true })(SyncButton);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);

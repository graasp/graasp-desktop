import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ClearIcon from '@material-ui/icons/Clear';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core';
import { SYNC_CANCEL_BUTTON_ID } from '../../../config/selectors';
import Styles from '../../../Styles';

class SyncCancelButton extends Component {
  static propTypes = {
    space: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    classes: PropTypes.shape({
      appBar: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
  };

  handleCancel = () => {
    const {
      history: { goBack },
    } = this.props;

    // return to previous screen
    goBack();
  };

  render() {
    const { classes, t } = this.props;
    return (
      <Tooltip title={t('Cancel Synchronization')}>
        <IconButton
          id={SYNC_CANCEL_BUTTON_ID}
          color="inherit"
          className={clsx(classes.button)}
          onClick={this.handleCancel}
        >
          <ClearIcon />
        </IconButton>
      </Tooltip>
    );
  }
}

const StyledComponent = withStyles(Styles, { withTheme: true })(
  SyncCancelButton
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);

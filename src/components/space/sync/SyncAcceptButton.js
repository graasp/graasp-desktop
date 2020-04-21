import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import DoneIcon from '@material-ui/icons/Done';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core';
import Styles from '../../../Styles';
import { syncSpace } from '../../../actions';
import { SYNC_ACCEPT_BUTTON_ID } from '../../../config/selectors';

class SyncCancelButton extends Component {
  static propTypes = {
    spaceId: PropTypes.string.isRequired,
    classes: PropTypes.shape({
      appBar: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
    }).isRequired,
    dispatchSync: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  handleSync = () => {
    const {
      spaceId,
      dispatchSync,
      history: { push },
    } = this.props;
    dispatchSync({ id: spaceId });

    // redirect to space
    push(`/space/${spaceId}`);
  };

  render() {
    const { classes, t } = this.props;
    return (
      <Tooltip title={t('Accept Synchronization')}>
        <IconButton
          id={SYNC_ACCEPT_BUTTON_ID}
          color="inherit"
          className={clsx(classes.button)}
          onClick={this.handleSync}
        >
          <DoneIcon />
        </IconButton>
      </Tooltip>
    );
  }
}

const mapDispatchToProps = {
  dispatchSync: syncSpace,
};

const ConnectedComponent = connect(null, mapDispatchToProps)(SyncCancelButton);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);

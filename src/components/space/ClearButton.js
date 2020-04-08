import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton/IconButton';
import { withStyles } from '@material-ui/core';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import Styles from '../../Styles';
import { clearUserInput } from '../../actions';
import { SPACE_CLEAR_BUTTON_CLASS } from '../../config/selectors';

class ClearButton extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      button: PropTypes.string,
    }).isRequired,
    t: PropTypes.func.isRequired,
    spaceId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    dispatchClearUserInput: PropTypes.func.isRequired,
  };

  handleClearUserInput = () => {
    const { spaceId, userId, dispatchClearUserInput } = this.props;
    dispatchClearUserInput({ spaceId, userId });
  };

  render() {
    const { classes, t } = this.props;
    return (
      <Tooltip title={t('Clear all of the user input in this space.')}>
        <IconButton
          color="inherit"
          className={clsx(classes.button, SPACE_CLEAR_BUTTON_CLASS)}
          onClick={this.handleClearUserInput}
        >
          <ClearAllIcon />
        </IconButton>
      </Tooltip>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  userId: authentication.getIn(['user', 'id']),
});

const mapDispatchToProps = {
  dispatchClearUserInput: clearUserInput,
};

const StyledComponent = withStyles(Styles)(ClearButton);

const TranslatedComponent = withTranslation()(StyledComponent);

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(TranslatedComponent);

export default ConnectedComponent;

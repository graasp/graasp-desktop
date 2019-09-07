import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton/IconButton';
import { withStyles } from '@material-ui/core';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import Styles from '../../Styles';
import { clearUserInput } from '../../actions';

class ClearButton extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      button: PropTypes.string,
    }).isRequired,
    t: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    dispatchClearUserInput: PropTypes.func.isRequired,
  };

  handleClearUserInput = () => {
    const { id, dispatchClearUserInput } = this.props;
    dispatchClearUserInput({ id });
  };

  render() {
    const { classes, t } = this.props;
    return (
      <Tooltip title={t('Clear all of the user input in this space.')}>
        <IconButton
          color="inherit"
          className={classes.button}
          onClick={this.handleClearUserInput}
        >
          <ClearAllIcon />
        </IconButton>
      </Tooltip>
    );
  }
}

const mapDispatchToProps = {
  dispatchClearUserInput: clearUserInput,
};

const StyledComponent = withStyles(Styles)(ClearButton);

const TranslatedComponent = withTranslation()(StyledComponent);

const ConnectedComponent = connect(
  null,
  mapDispatchToProps
)(TranslatedComponent);

export default ConnectedComponent;

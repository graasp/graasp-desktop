import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';
import { withTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core';
import Styles from '../../Styles';
import { deleteSpace } from '../../actions/space';
import { SPACE_DELETE_BUTTON_CLASS } from '../../config/selectors';

class DeleteButton extends Component {
  static propTypes = {
    spaceId: PropTypes.string.isRequired,
    classes: PropTypes.shape({
      appBar: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
    }).isRequired,
    dispatchDeleteSpace: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
  };

  static defaultProps = {
    onSuccess: null,
  };

  handleDelete = () => {
    const { spaceId: id, dispatchDeleteSpace, onSuccess } = this.props;
    dispatchDeleteSpace({ id }, onSuccess);
  };

  render() {
    const { classes, t } = this.props;
    return (
      <Tooltip title={t('Delete this space.')}>
        <IconButton
          color="inherit"
          onClick={this.handleDelete}
          className={clsx(classes.button, SPACE_DELETE_BUTTON_CLASS)}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );
  }
}

const mapDispatchToProps = {
  dispatchDeleteSpace: deleteSpace,
};

const ConnectedComponent = connect(null, mapDispatchToProps)(DeleteButton);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

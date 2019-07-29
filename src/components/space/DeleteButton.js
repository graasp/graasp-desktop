import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import { withTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core';
import Styles from '../../Styles';
import { deleteSpace } from '../../actions/space';

class DeleteButton extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    classes: PropTypes.shape({ appBar: PropTypes.string.isRequired })
      .isRequired,
    dispatchDeleteSpace: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  handleDelete = () => {
    const { id, dispatchDeleteSpace } = this.props;
    dispatchDeleteSpace({ id });
  };

  render() {
    const { classes, t } = this.props;
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
}

const mapStateToProps = ({ Space }) => ({
  space: Space.get('current')
    .get('content')
    .toJS(),
});

const mapDispatchToProps = {
  dispatchDeleteSpace: deleteSpace,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteButton);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

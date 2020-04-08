import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton/IconButton';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core';
import Styles from '../../Styles';
import { exportSpace } from '../../actions/space';
import { SPACE_EXPORT_BUTTON_CLASS } from '../../config/selectors';

class ExportButton extends Component {
  static propTypes = {
    space: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    classes: PropTypes.shape({
      appBar: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
    }).isRequired,
    dispatchExportSpace: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
  };

  handleExport = () => {
    const { space, dispatchExportSpace, userId } = this.props;
    const { id, name } = space;
    dispatchExportSpace(id, name, userId);
  };

  render() {
    const { classes, t } = this.props;
    return (
      <Tooltip title={t('Export this space to share with others.')}>
        <IconButton
          color="inherit"
          onClick={this.handleExport}
          className={clsx(classes.button, SPACE_EXPORT_BUTTON_CLASS)}
        >
          <UnarchiveIcon />
        </IconButton>
      </Tooltip>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  userId: authentication.getIn(['user', 'id']),
});

const mapDispatchToProps = {
  dispatchExportSpace: exportSpace,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportButton);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton/IconButton';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core';
import Styles from '../../Styles';
import { exportSpace } from '../../actions/space';

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
  };

  handleExport = () => {
    const { space, dispatchExportSpace } = this.props;
    const { id, name } = space;
    dispatchExportSpace(id, name);
  };

  render() {
    const { classes, t } = this.props;
    return (
      <Tooltip title={t('Export this space to share with others.')}>
        <IconButton
          color="inherit"
          onClick={this.handleExport}
          className={classes.button}
        >
          <UnarchiveIcon />
        </IconButton>
      </Tooltip>
    );
  }
}
const mapDispatchToProps = {
  dispatchExportSpace: exportSpace,
};

const ConnectedComponent = connect(null, mapDispatchToProps)(ExportButton);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

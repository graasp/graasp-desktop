import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { buildImportDataInClassroomPath } from '../../config/paths';

const styles = () => ({
  center: {
    margin: 'auto',
    display: 'block',
  },
});

class ImportDataButton extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      center: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  handleOnClick = () => {
    const {
      match: {
        params: { id },
      },
      history: { push },
    } = this.props;
    push(buildImportDataInClassroomPath(id));
  };

  render() {
    const { classes, t } = this.props;
    return (
      <Button
        classes={{ root: classes.center }}
        variant="contained"
        color="primary"
        onClick={this.handleOnClick}
      >
        {t('Import Data')}
      </Button>
    );
  }
}

const StylesComponent = withStyles(styles, { withTheme: true })(
  ImportDataButton
);

const TranslatedComponent = withTranslation()(StylesComponent);

export default withRouter(TranslatedComponent);

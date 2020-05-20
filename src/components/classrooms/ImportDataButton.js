import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

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
  };

  handleOnClick = () => {
    // todo: go to student data import page
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

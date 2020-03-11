import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { FormGroup } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import Styles from '../Styles';
import LanguageSelect from './common/LanguageSelect';
import DeveloperSwitch from './common/DeveloperSwitch';
import GeolocationControl from './common/GeolocationControl';
import Main from './common/Main';

// eslint-disable-next-line react/prefer-stateless-function
export class Settings extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
      drawer: PropTypes.string.isRequired,
      drawerHeader: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      contentShift: PropTypes.string.isRequired,
      settings: PropTypes.string.isRequired,
    }).isRequired,
    i18n: PropTypes.shape({
      changeLanguage: PropTypes.func.isRequired,
    }).isRequired,
  };

  render() {
    const { classes, t } = this.props;

    return (
      <Main>
        <div className={classes.settings}>
          <Typography variant="h5" color="inherit">
            {t('Settings')}
          </Typography>
          <FormGroup>
            <LanguageSelect />
            <DeveloperSwitch />
            <GeolocationControl />
          </FormGroup>
        </div>
      </Main>
    );
  }
}

const StyledComponent = withStyles(Styles, { withTheme: true })(Settings);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);

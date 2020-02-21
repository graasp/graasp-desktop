import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import DatabaseEditor from './DatabaseEditor';
import Styles from '../../Styles';
import Main from '../common/Main';
import Banner from '../common/Banner';

export class DeveloperScreen extends Component {
  
  static propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
      appBarShift: PropTypes.string.isRequired,
      menuButton: PropTypes.string.isRequired,
      hide: PropTypes.string.isRequired,
      drawerHeader: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      contentShift: PropTypes.string.isRequired,
      developer: PropTypes.string.isRequired,
      screenTitle: PropTypes.string.isRequired,
    }).isRequired,
    theme: PropTypes.shape({
      direction: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    i18n: PropTypes.shape({
      changeLanguage: PropTypes.func.isRequired,
    }).isRequired,
  };

  render() {
    const { classes, t } = this.props;

    return (
      <Main>
        <div className={classes.developer}>
          <Typography variant="h4" className={classes.screenTitle}>
            {t('Developer')}
          </Typography>
          <br />
          <Banner
            text={t(
              'Danger Zone! Proceed with caution as changes to this section might lead to data loss.'
            )}
            type="error"
          />
          <DatabaseEditor />
        </div>
      </Main>
    );
  }
}

const StyledComponent = withStyles(Styles, { withTheme: true })(
  DeveloperScreen
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);

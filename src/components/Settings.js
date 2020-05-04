import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { FormGroup } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import Styles from '../Styles';
import LanguageSelect from './common/LanguageSelect';
import DeveloperSwitch from './common/DeveloperSwitch';
import GeolocationControl from './common/GeolocationControl';
import Main from './common/Main';
import { SETTINGS_MAIN_ID } from '../config/selectors';
import SyncAdvancedSwitch from './space/sync/SyncAdvancedSwitch';
import StudentModeSwitch from './common/StudentModeSwitch';
import { USER_MODES } from '../config/constants';

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
    userMode: PropTypes.oneOf(Object.values(USER_MODES)).isRequired,
  };

  render() {
    const { classes, t, userMode } = this.props;

    return (
      <Main id={SETTINGS_MAIN_ID}>
        <div className={classes.settings}>
          <Typography variant="h5" color="inherit">
            {t('Settings')}
          </Typography>
          <FormGroup>
            <LanguageSelect />
            <GeolocationControl />
            <SyncAdvancedSwitch />
            <StudentModeSwitch />
            {userMode === USER_MODES.TEACHER ? <DeveloperSwitch /> : null}
          </FormGroup>
        </div>
      </Main>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  userMode: authentication.getIn(['user', 'settings', 'userMode']),
});

const ConnectedComponent = connect(mapStateToProps, null)(Settings);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);

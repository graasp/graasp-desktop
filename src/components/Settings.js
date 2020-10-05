import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { FormGroup } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
import Styles from '../Styles';
import LanguageSelect from './common/LanguageSelect';
import DeveloperSwitch from './common/DeveloperSwitch';
import GeolocationControl from './common/GeolocationControl';
import Main from './common/Main';
import {
  SETTINGS_ACTIONS_CLASS,
  SETTINGS_MAIN_ID,
  SETTINGS_TITLE_ID,
} from '../config/selectors';
import SyncAdvancedSwitch from './space/sync/SyncAdvancedSwitch';
import StudentModeSwitch from './common/StudentModeSwitch';
import ActionEnabledSwitch from './common/ActionEnabledSwitch';
import ActionAccessibilitySwitch from './common/ActionAccessibilitySwitch';
import { USER_MODES, DEFAULT_USER_MODE } from '../config/constants';

const styles = theme => ({
  ...Styles(theme),
  divider: {
    margin: theme.spacing(2, 0),
  },
});

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
      divider: PropTypes.string.isRequired,
    }).isRequired,
    i18n: PropTypes.shape({
      changeLanguage: PropTypes.func.isRequired,
    }).isRequired,
    userMode: PropTypes.oneOf(Object.values(USER_MODES)).isRequired,
    authenticated: PropTypes.bool.isRequired,
  };

  renderDeveloperModeSwitch = () => {
    const { userMode } = this.props;
    return userMode === USER_MODES.TEACHER ? <DeveloperSwitch /> : null;
  };

  renderActionSettings = () => {
    const { t } = this.props;
    return (
      <>
        <Typography variant="h5" color="inherit" className="mt-2">
          {t('Actions')}
        </Typography>
        <FormGroup className={SETTINGS_ACTIONS_CLASS}>
          <ActionEnabledSwitch />
          <ActionAccessibilitySwitch />
        </FormGroup>
      </>
    );
  };

  render() {
    const { classes, t, authenticated } = this.props;

    return (
      <Main id={SETTINGS_MAIN_ID}>
        <div className={classes.settings}>
          <Typography variant="h4" color="inherit" id={SETTINGS_TITLE_ID}>
            {t('Settings')}
          </Typography>
          <FormGroup>
            <LanguageSelect />
            {authenticated && (
              <>
                <GeolocationControl />
                <SyncAdvancedSwitch />
                <StudentModeSwitch />
                {this.renderDeveloperModeSwitch()}
              </>
            )}
          </FormGroup>
          <Divider variant="middle" classes={{ root: classes.divider }} />

          {authenticated && this.renderActionSettings()}
        </div>
      </Main>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  authenticated: authentication.getIn(['authenticated']),
  userMode:
    authentication.getIn(['user', 'settings', 'userMode']) || DEFAULT_USER_MODE,
});

const ConnectedComponent = connect(mapStateToProps, null)(Settings);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);

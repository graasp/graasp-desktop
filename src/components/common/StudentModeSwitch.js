import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { getUserMode, setUserMode } from '../../actions';
import Loader from './Loader';
import { USER_MODES, FORM_CONTROL_MIN_WIDTH } from '../../config/constants';

const styles = theme => ({
  formControl: {
    margin: theme.spacing(),
    minWidth: FORM_CONTROL_MIN_WIDTH,
  },
});

export class StudentModeSwitch extends Component {
  static propTypes = {
    userMode: PropTypes.oneOf(Object.values(USER_MODES)).isRequired,
    activity: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    dispatchGetUserMode: PropTypes.func.isRequired,
    dispatchSetUserMode: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      formControl: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    const { dispatchGetUserMode } = this.props;
    dispatchGetUserMode();
  }

  handleChange = async ({ target }) => {
    const { dispatchSetUserMode } = this.props;
    const { checked } = target;
    const mode = checked ? USER_MODES.STUDENT : USER_MODES.TEACHER;
    dispatchSetUserMode(mode);
  };

  render() {
    const { classes, t, userMode, activity } = this.props;

    const isStudent = userMode === USER_MODES.STUDENT;

    if (activity) {
      return <Loader />;
    }

    const switchControl = (
      <Switch
        checked={isStudent}
        onChange={this.handleChange}
        value={isStudent}
        color="primary"
      />
    );

    return (
      <FormControl className={classes.formControl}>
        <FormControlLabel
          control={switchControl}
          label={t('Student Mode Enabled')}
        />
      </FormControl>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  userMode: authentication.getIn(['user', 'settings', 'userMode']),
  activity: Boolean(authentication.getIn(['current', 'activity']).size),
});

const mapDispatchToProps = {
  dispatchGetUserMode: getUserMode,
  dispatchSetUserMode: setUserMode,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentModeSwitch);

const StyledComponent = withStyles(styles)(ConnectedComponent);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

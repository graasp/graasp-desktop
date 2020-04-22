import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { getStudentMode, setStudentMode } from '../../actions';
import Loader from './Loader';

const styles = theme => ({
  formControl: {
    margin: theme.spacing(),
    minWidth: 120,
  },
});

export class StudentModeSwitch extends Component {
  static propTypes = {
    studentMode: PropTypes.bool.isRequired,
    activity: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    dispatchGetStudentMode: PropTypes.func.isRequired,
    dispatchSetStudentMode: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      formControl: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    const { dispatchGetStudentMode } = this.props;
    dispatchGetStudentMode();
  }

  handleChange = async ({ target }) => {
    const { dispatchSetStudentMode } = this.props;
    const { checked } = target;
    dispatchSetStudentMode(checked);
  };

  render() {
    const { classes, t, studentMode, activity } = this.props;

    if (activity) {
      return <Loader />;
    }

    const switchControl = (
      <Switch
        checked={studentMode}
        onChange={this.handleChange}
        value={studentMode}
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
  studentMode: authentication.getIn(['user', 'settings', 'studentMode']),
  activity: Boolean(authentication.getIn(['current', 'activity']).size),
});

const mapDispatchToProps = {
  dispatchGetStudentMode: getStudentMode,
  dispatchSetStudentMode: setStudentMode,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentModeSwitch);

const StyledComponent = withStyles(styles)(ConnectedComponent);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

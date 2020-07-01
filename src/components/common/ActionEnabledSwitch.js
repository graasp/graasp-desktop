import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { setActionEnabled } from '../../actions';
import Loader from './Loader';
import {
  FORM_CONTROL_MIN_WIDTH,
  DEFAULT_ACTION_ENABLED,
} from '../../config/constants';

const styles = theme => ({
  formControl: {
    margin: theme.spacing(),
    minWidth: FORM_CONTROL_MIN_WIDTH,
  },
});

export class ActionEnabledSwitch extends Component {
  static propTypes = {
    actionEnabled: PropTypes.bool.isRequired,
    activity: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    dispatchSetActionEnabled: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      formControl: PropTypes.string.isRequired,
    }).isRequired,
  };

  handleChange = async ({ target }) => {
    const { dispatchSetActionEnabled } = this.props;
    const { checked } = target;
    dispatchSetActionEnabled(checked);
  };

  render() {
    const { classes, t, actionEnabled, activity } = this.props;

    if (activity) {
      return <Loader />;
    }

    const control = (
      <Switch
        checked={actionEnabled}
        onChange={this.handleChange}
        value={actionEnabled}
        color="primary"
      />
    );

    return (
      <FormControl className={classes.formControl}>
        <FormControlLabel control={control} label={t('Action Enabled')} />
      </FormControl>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  actionEnabled:
    authentication.getIn(['user', 'settings', 'actionEnabled']) ||
    DEFAULT_ACTION_ENABLED,
  activity: Boolean(authentication.getIn(['current', 'activity']).size),
});

const mapDispatchToProps = {
  dispatchSetActionEnabled: setActionEnabled,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionEnabledSwitch);

const StyledComponent = withStyles(styles)(ConnectedComponent);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

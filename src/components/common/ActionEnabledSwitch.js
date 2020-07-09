import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { setActionsAsEnabled } from '../../actions';
import Loader from './Loader';
import { FORM_CONTROL_MIN_WIDTH } from '../../config/constants';

const styles = theme => ({
  formControl: {
    margin: theme.spacing(),
    minWidth: FORM_CONTROL_MIN_WIDTH,
  },
});

export class ActionEnabledSwitch extends Component {
  static propTypes = {
    actionsAsEnabled: PropTypes.bool.isRequired,
    activity: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    dispatchSetActionsAsEnabled: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      formControl: PropTypes.string.isRequired,
    }).isRequired,
  };

  handleChange = async ({ target }) => {
    const { dispatchSetActionsAsEnabled } = this.props;
    const { checked } = target;
    dispatchSetActionsAsEnabled(checked);
  };

  render() {
    const { classes, t, actionsAsEnabled, activity } = this.props;

    if (activity) {
      return <Loader />;
    }

    const control = (
      <Switch
        checked={actionsAsEnabled}
        onChange={this.handleChange}
        value={actionsAsEnabled}
        color="primary"
      />
    );

    return (
      <Grid container alignItems="center">
        <Grid item>
          <FormControl className={classes.formControl}>
            <FormControlLabel control={control} label={t('Track Actions')} />
          </FormControl>
        </Grid>
        <Grid>
          <Tooltip
            title={t(
              'When enabled, your interaction with learning spaces and apps will be stored locally. This can help you get feedback on your learning process.'
            )}
            placement="right"
          >
            <InfoIcon color="primary" />
          </Tooltip>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  actionsAsEnabled: authentication.getIn([
    'user',
    'settings',
    'actionsAsEnabled',
  ]),
  activity: Boolean(authentication.getIn(['current', 'activity']).size),
});

const mapDispatchToProps = {
  dispatchSetActionsAsEnabled: setActionsAsEnabled,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionEnabledSwitch);

const StyledComponent = withStyles(styles)(ConnectedComponent);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

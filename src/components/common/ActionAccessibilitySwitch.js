import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Switch from '@material-ui/core/Switch';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setActionAccessibility } from '../../actions';
import Loader from './Loader';
import {
  DEFAULT_ACTION_ACCESSIBILITY,
  FORM_CONTROL_MIN_WIDTH,
} from '../../config/constants';

const styles = theme => ({
  formControl: {
    margin: theme.spacing(),
    minWidth: FORM_CONTROL_MIN_WIDTH,
  },
});

export class ActionAccessibilitySwitch extends Component {
  static propTypes = {
    activity: PropTypes.bool.isRequired,
    actionAccessibility: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    dispatchSetActionAccessibility: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      formControl: PropTypes.string.isRequired,
    }).isRequired,
  };

  handleChange = async ({ target }) => {
    const { dispatchSetActionAccessibility } = this.props;
    const { checked } = target;
    dispatchSetActionAccessibility(checked);
  };

  render() {
    const { t, activity, actionAccessibility, classes } = this.props;

    if (activity) {
      return <Loader />;
    }

    const control = (
      <Switch
        checked={actionAccessibility}
        onChange={this.handleChange}
        value={actionAccessibility}
        color="primary"
      />
    );

    return (
      <FormControl className={classes.formControl}>
        <FormControlLabel
          control={control}
          label={t('Share Actions with Teachers')}
        />
      </FormControl>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  activity: Boolean(authentication.getIn(['current', 'activity']).size),
  actionAccessibility:
    authentication.getIn(['user', 'settings', 'actionAccessibility']) ||
    DEFAULT_ACTION_ACCESSIBILITY,
});

const mapDispatchToProps = {
  dispatchSetActionAccessibility: setActionAccessibility,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionAccessibilitySwitch);

const StyledComponent = withStyles(styles)(ConnectedComponent);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

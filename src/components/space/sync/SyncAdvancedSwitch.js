import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { setSyncAdvancedMode, getSyncAdvancedMode } from '../../../actions';
import Loader from '../../common/Loader';

const styles = theme => ({
  formControl: {
    margin: theme.spacing(),
    minWidth: 120,
  },
});

export class SyncAdvancedSwitch extends Component {
  static propTypes = {
    advancedMode: PropTypes.bool.isRequired,
    activity: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      formControl: PropTypes.string.isRequired,
    }).isRequired,
    dispatchGetSyncAdvancedMode: PropTypes.func.isRequired,
    dispatchSetSyncAdvancedMode: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { dispatchGetSyncAdvancedMode } = this.props;
    dispatchGetSyncAdvancedMode();
  }

  handleChange = async ({ target }) => {
    const { dispatchSetSyncAdvancedMode } = this.props;
    const { checked } = target;
    dispatchSetSyncAdvancedMode(checked);
  };

  render() {
    const { classes, t, advancedMode, activity } = this.props;

    if (activity) {
      return <Loader />;
    }

    const control = (
      <Switch
        checked={advancedMode}
        onChange={this.handleChange}
        value={advancedMode}
        color="primary"
      />
    );

    return (
      <FormControl className={classes.formControl}>
        <FormControlLabel control={control} label={t('Sync Advanced Mode')} />
      </FormControl>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  advancedMode: authentication.getIn(['user', 'settings', 'syncAdvancedMode']),
  activity: Boolean(authentication.getIn(['current', 'activity']).size),
});

const mapDispatchToProps = {
  dispatchSetSyncAdvancedMode: setSyncAdvancedMode,
  dispatchGetSyncAdvancedMode: getSyncAdvancedMode,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SyncAdvancedSwitch);

const StyledComponent = withStyles(styles)(ConnectedComponent);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

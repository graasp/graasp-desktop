import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { setSyncMode, getSyncMode } from '../../../actions';
import Loader from '../../common/Loader';
import { SYNC_MODE_SWITCH_ID } from '../../../config/selectors';
import { SYNC_MODES, DEFAULT_SYNC_MODE } from '../../../config/constants';

const styles = theme => ({
  formControl: {
    margin: theme.spacing(),
    minWidth: 120,
  },
});

export class SyncAdvancedSwitch extends Component {
  static propTypes = {
    mode: PropTypes.oneOf(Object.values(SYNC_MODES)),
    activity: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      formControl: PropTypes.string.isRequired,
    }).isRequired,
    dispatchgetSyncMode: PropTypes.func.isRequired,
    dispatchsetSyncMode: PropTypes.func.isRequired,
  };

  static defaultProps = {
    mode: DEFAULT_SYNC_MODE,
  };

  constructor(props) {
    super(props);
    const { dispatchgetSyncMode } = this.props;
    dispatchgetSyncMode();
  }

  handleChange = async ({ target }) => {
    const { dispatchsetSyncMode } = this.props;
    const { checked } = target;
    const mode = checked ? SYNC_MODES.ADVANCED : SYNC_MODES.VISUAL;
    dispatchsetSyncMode(mode);
  };

  render() {
    const { classes, t, mode, activity } = this.props;

    if (activity) {
      return <Loader />;
    }

    const control = (
      <Switch
        checked={mode === SYNC_MODES.ADVANCED}
        onChange={this.handleChange}
        value={mode === SYNC_MODES.ADVANCED}
        color="primary"
      />
    );

    return (
      <FormControl id={SYNC_MODE_SWITCH_ID} className={classes.formControl}>
        <FormControlLabel control={control} label={t('Sync Advanced Mode')} />
      </FormControl>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  mode: authentication.getIn(['user', 'settings', 'syncMode']),
  activity: Boolean(authentication.getIn(['current', 'activity']).size),
});

const mapDispatchToProps = {
  dispatchsetSyncMode: setSyncMode,
  dispatchgetSyncMode: getSyncMode,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SyncAdvancedSwitch);

const StyledComponent = withStyles(styles)(ConnectedComponent);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from '../common/Loader';
import { getSyncAdvancedMode } from '../../actions';
import SyncVisualScreen from './SyncVisualScreen';
import SyncAdvancedScreen from './SyncAdvancedScreen';

class SyncScreen extends Component {
  static propTypes = {
    dispatchGetSyncAdvancedMode: PropTypes.string.isRequired,
    activity: PropTypes.bool,
    advancedMode: PropTypes.bool,
  };

  static defaultProps = {
    advancedMode: false,
    activity: false,
  };

  async componentDidMount() {
    const { dispatchGetSyncAdvancedMode } = this.props;

    dispatchGetSyncAdvancedMode();
  }

  render() {
    const { advancedMode, activity } = this.props;

    if (activity) {
      return <Loader />;
    }

    return advancedMode ? <SyncAdvancedScreen /> : <SyncVisualScreen />;
  }
}

const mapStateToProps = ({ authentication }) => ({
  advancedMode: authentication.getIn(['user', 'settings', 'syncAdvancedMode']),
  activity: Boolean(authentication.getIn(['current', 'activity']).size),
});

const mapDispatchToProps = {
  dispatchGetSyncAdvancedMode: getSyncAdvancedMode,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SyncScreen);

export default ConnectedComponent;

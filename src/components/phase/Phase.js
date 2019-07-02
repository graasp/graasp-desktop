import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { clearPhase, selectPhase } from '../../actions';
import SpaceDescription from '../space/SpaceDescription';
import PhaseDescription from './PhaseDescription';
import PhaseItems from './PhaseItems';

const styles = {
  containerStyle: {
    flex: 1,
  },
};

const { containerStyle } = styles;

class Phase extends Component {
  static propTypes = {
    space: ImmutablePropTypes.contains({
      id: PropTypes.string.isRequired,
      description: PropTypes.string,
    }).isRequired,
    phase: ImmutablePropTypes.contains({
      id: PropTypes.string,
    }).isRequired,
    dispatchSelectPhase: PropTypes.func.isRequired,
    dispatchClearPhase: PropTypes.func.isRequired,
    start: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    const { dispatchClearPhase } = this.props;
    dispatchClearPhase();
  }

  render() {
    const { phase, space, dispatchSelectPhase, start } = this.props;
    const phases = space.get('phases');
    const saved = space.get('saved');
    const description = space.get('description');
    if (!phase || phase.isEmpty()) {
      return (
        <SpaceDescription
          phases={phases}
          description={description}
          selectPhase={dispatchSelectPhase}
          start={start}
          saved={saved}
        />
      );
    }
    const phaseDescription = phase.get('description');

    const phaseId = phase.get('id');
    const spaceId = space.get('id');
    const items = phase.get('items');
    return (
      <div style={containerStyle}>
        <PhaseDescription description={phaseDescription} />
        <PhaseItems items={items} spaceId={spaceId} phaseId={phaseId} />
      </div>
    );
  }
}

const mapStateToProps = ({ Space }) => ({
  space: Space.get('current').get('content'),
});

const mapDispatchToProps = {
  dispatchSelectPhase: selectPhase,
  dispatchClearPhase: clearPhase,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Phase);

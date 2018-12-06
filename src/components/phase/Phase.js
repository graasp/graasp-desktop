import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectPhase } from '../../actions';
import SpaceDescription from '../space/SpaceDescription';
import PhaseDescription from './PhaseDescription';
import PhaseItems from './PhaseItems';

const styles = {
  containerStyle: {
    flex: 1,
  },
};

const { containerStyle } = styles;

const Phase = ({
  phase,
  space,
  dispatchSelectPhase,
  start,
}) => {
  const phases = space.get('phases');
  const description = space.get('description');
  if (!phase || phase.isEmpty()) {
    return (
      <SpaceDescription
        phases={phases}
        description={description}
        selectPhase={dispatchSelectPhase}
        start={start}
      />
    );
  }
  const phaseDescription = phase.get('description') || 'missing description';

  const items = phase.get('items');
  return (
    <div style={containerStyle}>
      <PhaseDescription
        description={phaseDescription}
      />
      <PhaseItems items={items} />
    </div>
  );
};

const mapStateToProps = ({ Space }) => ({
  space: Space.get('current').get('content'),
});

const mapDispatchToProps = {
  dispatchSelectPhase: selectPhase,
};

Phase.propTypes = {
  space: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  phase: PropTypes.arrayOf({ id: PropTypes.string.isRequired }).isRequired,
  dispatchSelectPhase: PropTypes.func.isRequired,
  start: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Phase);

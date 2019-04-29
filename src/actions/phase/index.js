import {
  SELECT_PHASE,
  CLEAR_PHASE,
} from '../../types';

const clearPhase = () => dispatch => dispatch({
  type: CLEAR_PHASE,
});

const selectPhase = phase => (dispatch) => {
  dispatch({
    type: SELECT_PHASE,
    payload: phase,
  });
};

export {
  selectPhase,
  clearPhase,
};

import React from 'react';
import PropTypes from 'prop-types';
import Text from '../common/Text';
import { buildPhaseTextId } from '../../config/selectors';

const style = {
  marginTop: '2rem',
  marginBottom: '2rem',
};

const PhaseText = ({ content, id }) => (
  <Text id={buildPhaseTextId(id)} content={content} style={style} />
);

PhaseText.propTypes = {
  content: PropTypes.string,
  id: PropTypes.string,
};

PhaseText.defaultProps = {
  content: '',
  id: null,
};

export default PhaseText;

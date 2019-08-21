import React from 'react';
import PropTypes from 'prop-types';
import Text from '../common/Text';

const style = {
  marginTop: '2rem',
  marginBottom: '2rem',
};

const PhaseText = ({ content }) => <Text content={content} style={style} />;

PhaseText.propTypes = {
  content: PropTypes.string,
};

PhaseText.defaultProps = {
  content: '',
};

export default PhaseText;

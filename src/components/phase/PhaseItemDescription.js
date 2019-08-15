import React from 'react';
import PropTypes from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';
import Text from '../common/Text';
import './PhaseItemDescription.css';

const style = {
  marginTop: '1rem',
  marginBottom: '1rem',
  flexDirection: 'row',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const PhaseItemDescription = ({ description }) => {
  if (description && description !== '') {
    return (
      <div style={style}>
        <InfoIcon color="primary" />
        <Text content={description} className="PhaseItemDescriptionText" />
      </div>
    );
  }
  return null;
};

PhaseItemDescription.propTypes = {
  description: PropTypes.string,
};

PhaseItemDescription.defaultProps = {
  description: '',
};

export default PhaseItemDescription;

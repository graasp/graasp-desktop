import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import InfoIcon from '@material-ui/icons/Info';
import Text from '../common/Text';
import './PhaseItemDescription.css';
import { buildPhaseItemDescriptionId } from '../../config/selectors';

const style = {
  marginTop: '1rem',
  marginBottom: '1rem',
  flexDirection: 'row',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const PhaseItemDescription = ({ description, className, id }) => {
  if (description && description !== '') {
    return (
      <div style={style}>
        <InfoIcon color="primary" />
        <Text
          id={buildPhaseItemDescriptionId(id)}
          content={description}
          className={clsx('PhaseItemDescriptionText', className)}
        />
      </div>
    );
  }
  return null;
};

PhaseItemDescription.propTypes = {
  description: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
};

PhaseItemDescription.defaultProps = {
  description: '',
  className: null,
};

export default PhaseItemDescription;

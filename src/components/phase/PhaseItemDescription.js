import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import InfoIcon from '@material-ui/icons/Info';
import Text from '../common/Text';
import { buildPhaseItemDescriptionId } from '../../config/selectors';

const useStyles = makeStyles(() => ({
  wrapper: {
    marginTop: '1rem',
    marginBottom: '1rem',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    '& p': {
      fontSize: '1em',
      textAlign: 'center',
    },
  },
}));

const PhaseItemDescription = ({ description, className, id }) => {
  const classes = useStyles();
  if (description && description !== '') {
    return (
      <div className={classes.wrapper}>
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

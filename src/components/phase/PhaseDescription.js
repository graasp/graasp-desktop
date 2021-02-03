import React from 'react';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Text from '../common/Text';
import { PHASE_DESCRIPTION_ID } from '../../config/selectors';

const useStyles = makeStyles(() => ({
  text: {
    marginBottom: '2rem',

    '& p': {
      fontSize: '2em',
    },
  },
}));

const PhaseDescription = ({ description }) => {
  const classes = useStyles();
  if (description && description !== '') {
    return (
      <Text
        id={PHASE_DESCRIPTION_ID}
        content={description}
        className={classes.text}
      />
    );
  }
  return null;
};

PhaseDescription.propTypes = {
  description: PropTypes.string,
};

PhaseDescription.defaultProps = {
  description: '',
};

export default PhaseDescription;

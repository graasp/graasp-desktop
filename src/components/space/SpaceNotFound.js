import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import Button from '@material-ui/core//Button';

const SpaceNotFound = ({ history: { replace } }) => {
  return (
    <div>
      Space not found.
      <Button onClick={() => replace('/')}>Home</Button>
    </div>
  );
};

SpaceNotFound.propTypes = {
  history: PropTypes.shape({ length: PropTypes.number.isRequired }).isRequired,
};

export default withRouter(SpaceNotFound);

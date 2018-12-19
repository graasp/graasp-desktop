import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
import Styles from '../../Styles';
import './SpaceDescription.css';

const SpaceDescription = ({
  description,
  classes,
  start,
}) => (
  <div className="SpaceDescription">
    <div>
      <h4 style={{ textAlign: 'center' }}>
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </h4>
      <Button variant="contained" className={classes.button} onClick={start} color="primary" style={{ display: 'block', width: '50%', margin: '0 auto' }}>
        Start
      </Button>
    </div>
  </div>
);

SpaceDescription.propTypes = {
  description: PropTypes.string.isRequired,
  classes: PropTypes.shape({ appBar: PropTypes.string.isRequired }).isRequired,
  start: PropTypes.func.isRequired,
};

export default withStyles(Styles, { withTheme: true })(SpaceDescription);

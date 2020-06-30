import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import ResourceIcon from './ResourceIcon';
import ActionIcon from './ActionIcon';

const styles = theme => ({
  legend: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',

    '& span': {
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(2),
    },
  },
});

const ClassroomLegend = ({ classes }) => {
  return (
    <div className={classes.legend}>
      <ResourceIcon text />
      <ActionIcon text />
    </div>
  );
};

ClassroomLegend.propTypes = {
  classes: PropTypes.shape({
    legend: PropTypes.string.isRequired,
  }).isRequired,
};

const StyledComponent = withStyles(styles, { withTheme: true })(
  ClassroomLegend
);

export default StyledComponent;

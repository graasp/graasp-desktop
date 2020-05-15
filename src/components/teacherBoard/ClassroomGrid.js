import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography/Typography';
import PropTypes from 'prop-types';
import ClassroomCard from './ClassroomCard';
import { NO_CLASSROOM_AVAILABLE_ID } from '../../config/selectors';

const styles = () => ({});

const ClassroomGrid = ({ classrooms, t }) => {
  if (classrooms.isEmpty()) {
    return (
      <div id={NO_CLASSROOM_AVAILABLE_ID} className="Main">
        <Typography variant="h5" color="inherit">
          {t('No Classroom Available')}
        </Typography>
      </div>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {classrooms.map(classroom => (
          <Grid item xs={6} sm={3}>
            <ClassroomCard key={classroom.id} classroom={classroom} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

ClassroomGrid.propTypes = {
  t: PropTypes.func.isRequired,
  classrooms: PropTypes.instanceOf(Set).isRequired,
};

const StyledComponent = withStyles(styles, { withTheme: true })(ClassroomGrid);
const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

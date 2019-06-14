import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import CssBaseline from '@material-ui/core/CssBaseline';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = theme => ({
  banner: {
    marginBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
  },
});

const renderButton = buttonText => (
  <Grid container justify="flex-end" spacing={8}>
    <Grid item>
      <Button color="primary">{buttonText}</Button>
    </Grid>
  </Grid>
);

const renderIcon = type => {
  switch (type) {
    case 'warning':
      return <WarningIcon color="error" fontSize="large" />;
    case 'error':
      return <ErrorIcon color="error" fontSize="large" />;
    case 'info':
    default:
      return <InfoIcon color="primary" fontSize="large" />;
  }
};

const Banner = ({ text, buttonText, classes, type }) => {
  return (
    <div className={classes.banner}>
      <CssBaseline />
      <Paper elevation={0} className={classes.paper}>
        <Box pt={2} pr={1} pb={1} pl={2}>
          <Grid container spacing={6} alignItems="center" wrap="nowrap">
            <Grid item>{renderIcon(type)}</Grid>
            <Grid item>
              <Typography>{text}</Typography>
            </Grid>
          </Grid>
          {buttonText ? renderButton() : null}
        </Box>
      </Paper>
      <Divider />
    </div>
  );
};

Banner.propTypes = {
  type: PropTypes.oneOf(['warning', 'error', 'info']),
  text: PropTypes.string,
  buttonText: PropTypes.string,
  classes: PropTypes.shape({ banner: PropTypes.string.isRequired }).isRequired,
};

Banner.defaultProps = {
  type: 'info',
  text: null,
  buttonText: null,
};

export default withStyles(styles)(Banner);

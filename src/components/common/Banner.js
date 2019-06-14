import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import CssBaseline from '@material-ui/core/CssBaseline';
import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = theme => ({
  banner: {
    marginBottom: theme.spacing(2),
  },
});

const renderButton = buttonText => (
  <Grid container justify="flex-end" spacing={8}>
    <Grid item>
      <Button color="primary">{buttonText}</Button>
    </Grid>
  </Grid>
);

const Banner = ({ text, buttonText, classes }) => {
  return (
    <div className={classes.banner}>
      <CssBaseline />
      <Paper elevation={0}>
        <Box pt={2} pr={1} pb={1} pl={2}>
          <Grid container spacing={6} alignItems="center" wrap="nowrap">
            <Grid item>
              <Box bgcolor="primary.main" clone>
                <Avatar>
                  <WarningIcon />
                </Avatar>
              </Box>
            </Grid>
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
  text: PropTypes.string,
  buttonText: PropTypes.string,
  classes: PropTypes.shape({ banner: PropTypes.string.isRequired }).isRequired,
};

Banner.defaultProps = {
  text: null,
  buttonText: null,
};

export default withStyles(styles)(Banner);

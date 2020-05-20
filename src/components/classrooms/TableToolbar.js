import React from 'react';
import { withStyles } from '@material-ui/core';
import clsx from 'clsx';
import { withTranslation } from 'react-i18next';
import { lighten } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';

const styles = theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.primary.main,
          backgroundColor: lighten(theme.palette.primary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
});

const TableToolbar = ({ numSelected, classes, classroomName, t }) => {
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {`${numSelected} ${t('selected')}`}
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" component="div">
          {classroomName}
        </Typography>
      )}

      {/* // todo: export multiple students' data */}

      {numSelected > 0 && (
        <Tooltip title={t('Delete')}>
          <IconButton aria-label={t('Delete')}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

TableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    highlight: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  classroomName: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

const StyledComponent = withStyles(styles, {
  withTheme: true,
})(TableToolbar);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

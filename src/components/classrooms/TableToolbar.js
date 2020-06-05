import React, { Component } from 'react';
import { Map } from 'immutable';
import { withStyles } from '@material-ui/core';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { lighten } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import PropTypes from 'prop-types';
import { deleteUsersInClassroom } from '../../actions';
import { TABLE_HEAD_CELL_IDS } from '../../config/constants';
import { DELETE_USERS_IN_CLASSROOM_BUTTON_ID } from '../../config/selectors';
import EditClassroomButton from './EditClassroomButton';

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

class TableToolbar extends Component {
  static propTypes = {
    selected: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        [TABLE_HEAD_CELL_IDS.USERNAME]: PropTypes.string.isRequired,
      })
    ).isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
      highlight: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
    classroom: PropTypes.instanceOf(Map).isRequired,
    t: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    dispatchDeleteUsersInClassroom: PropTypes.func.isRequired,
  };

  handleDeleteUsers = () => {
    const {
      dispatchDeleteUsersInClassroom,
      classroom,
      userId: teacherId,
      selected,
    } = this.props;
    dispatchDeleteUsersInClassroom({
      users: selected,
      teacherId,
      classroomId: classroom.get('id'),
    });
  };

  render() {
    const { selected, classes, classroom, t } = this.props;
    const numSelected = selected.length;
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
            {classroom.get('name')}
          </Typography>
        )}

        {numSelected > 0 && (
          <Tooltip title={t('Delete')}>
            <IconButton
              aria-label={t('Delete')}
              onClick={() => this.handleDeleteUsers()}
              id={DELETE_USERS_IN_CLASSROOM_BUTTON_ID}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}

        {numSelected === 0 && (
          <EditClassroomButton classroom={classroom.toJS()} />
        )}
      </Toolbar>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  userId: authentication.getIn(['user', 'id']),
});

const mapDispatchToProps = {
  dispatchDeleteUsersInClassroom: deleteUsersInClassroom,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(TableToolbar);

const StyledComponent = withStyles(styles, {
  withTheme: true,
})(ConnectedComponent);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

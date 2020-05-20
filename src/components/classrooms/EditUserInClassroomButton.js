import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { toastr } from 'react-redux-toastr';
import EditIcon from '@material-ui/icons/Create';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import ResourceIcon from '@material-ui/icons/AssignmentInd';
import ActionIcon from '@material-ui/icons/Assessment';
import CancelIcon from '@material-ui/icons/Cancel';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { editUserInClassroom } from '../../actions';
import {
  EDIT_USER_IN_CLASSROOM_DIALOG_TITLE_ID,
  EDIT_USER_IN_CLASSROOM_BUTTON_CLASS,
  EDIT_USER_IN_CLASSROOM_VALIDATE_BUTTON_ID,
  EDIT_USER_IN_CLASSROOM_USERNAME_INPUT_ID,
} from '../../config/selectors';
import {
  ERROR_MESSAGE_HEADER,
  ERROR_INVALID_USERNAME_MESSAGE,
} from '../../config/messages';
import { isUsernameValid } from '../../utils/user';
import {
  hasUserActionsForSpaceInClassroom,
  hasUserResourcesForSpaceInClassroom,
  hasUserDataInClassroom,
} from '../../utils/classroom';

const styles = theme => ({
  formControl: {
    margin: theme.spacing(3),
  },
  editSpaceRow: {
    marginBottom: theme.spacing(3),
  },
  deleted: {
    color: 'lightgrey',
  },
  dataTitle: {
    fontSize: 'default',
    fontWeight: 'bold',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  dialog: {
    minWidth: '40%',
  },
});

class EditUserInClassroomButton extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      dataTitle: PropTypes.string.isRequired,
      editSpaceRow: PropTypes.string.isRequired,
      deleted: PropTypes.string.isRequired,
      dialog: PropTypes.string.isRequired,
    }).isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
    dispatchEditUserInClassroom: PropTypes.func.isRequired,
    classroom: PropTypes.instanceOf(Map).isRequired,
    t: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
  };

  state = (() => {
    const {
      user: { username, id: userId },
      classroom,
    } = this.props;

    // build delete selection on contained spaces for given user
    const deleteSelection = classroom
      .get('spaces')
      .reduce((selection, { id: spaceId }) => {
        const hasResources = hasUserResourcesForSpaceInClassroom(
          classroom,
          spaceId,
          userId
        );
        const hasActions = hasUserActionsForSpaceInClassroom(
          classroom,
          spaceId,
          userId
        );
        if (hasResources || hasActions) {
          return { ...selection, [spaceId]: false };
        }
        return selection;
      }, {});

    return {
      open: false,
      username,
      deleteSelection,
    };
  })();

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  close = () => {
    const {
      user: { username },
    } = this.props;

    // replace state with original data
    this.setState({ username, open: false });
  };

  handleCancel = () => {
    this.close();
  };

  handleValidate = () => {
    const { username, deleteSelection } = this.state;
    const {
      dispatchEditUserInClassroom,
      user: { id: userId },
      classroom,
      userId: teacherId,
    } = this.props;

    const trimmedUsername = username.trim();

    if (!isUsernameValid(trimmedUsername)) {
      toastr.error(ERROR_MESSAGE_HEADER, ERROR_INVALID_USERNAME_MESSAGE);
    } else {
      dispatchEditUserInClassroom({
        username: trimmedUsername,
        userId,
        teacherId,
        classroomId: classroom.get('id'),
        deleteSelection,
      });
      this.close();
    }
  };

  handleChange = event => {
    const {
      target: { value },
    } = event;
    this.setState({ username: value });
  };

  renderUsernameInput = usernameErrorProps => {
    const { t } = this.props;
    const { username } = this.state;
    return (
      <TextField
        id={EDIT_USER_IN_CLASSROOM_USERNAME_INPUT_ID}
        autoFocus
        margin="dense"
        label={t('Username')}
        type="text"
        fullWidth
        value={username}
        onChange={this.handleChange}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...usernameErrorProps}
      />
    );
  };

  changeDeleteSelection = (event, spaceId, value) => {
    const { deleteSelection: prevDeleteSelection } = this.state;
    const deleteSelection = { ...prevDeleteSelection, [spaceId]: value };
    this.setState({ deleteSelection });
  };

  renderUserData = () => {
    const {
      classroom,
      classes,
      t,
      user: { id: userId },
    } = this.props;
    const { deleteSelection } = this.state;

    return (
      <>
        <Typography className={classes.dataTitle}>
          {t('Actions and Resources')}
        </Typography>

        {hasUserDataInClassroom(classroom, userId) ? (
          <Grid container direction="row" justify="center">
            {classroom.get('spaces').map(({ id: spaceId, name: spaceName }) => {
              const hasResources = hasUserResourcesForSpaceInClassroom(
                classroom,
                spaceId,
                userId
              );
              const hasActions = hasUserActionsForSpaceInClassroom(
                classroom,
                spaceId,
                userId
              );
              if (!hasActions && !hasResources) {
                return null;
              }

              const isSelected = deleteSelection[spaceId];

              const button = isSelected ? (
                <Tooltip title={t(`Cancel delete`)}>
                  <IconButton
                    color="inherit"
                    onClick={e => this.changeDeleteSelection(e, spaceId, false)}
                  >
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title={t(`Delete these data`)}>
                  <IconButton
                    color="inherit"
                    onClick={e => this.changeDeleteSelection(e, spaceId, true)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              );

              return (
                <>
                  <Grid item xs={2} classes={{ root: classes.editSpaceRow }}>
                    {button}
                  </Grid>
                  <Grid
                    item
                    xs={10}
                    classes={{
                      root: clsx(classes.editSpaceRow, {
                        [classes.deleted]: isSelected,
                      }),
                    }}
                  >
                    <Typography>{spaceName}</Typography>
                    {hasResources && <ResourceIcon />}
                    {hasActions && <ActionIcon />}
                  </Grid>
                </>
              );
            })}
          </Grid>
        ) : (
          <Typography>{t('This user has no content')}</Typography>
        )}
      </>
    );
  };

  render() {
    const {
      t,
      user: { username: name },
      classes,
    } = this.props;
    const { username, open } = this.state;

    // check data to display error in form
    const trimmedUsername = username.trim();
    const usernameValidity = isUsernameValid(trimmedUsername);

    let usernameErrorProps = {};
    if (!usernameValidity) {
      usernameErrorProps = {
        ...usernameErrorProps,
        helperText: t('Username is not valid.'),
        error: true,
      };
    }

    const isDataInvalid = !usernameValidity;

    return (
      <>
        <Tooltip title={`${t('Edit')} ${name}`}>
          <IconButton
            className={EDIT_USER_IN_CLASSROOM_BUTTON_CLASS}
            color="inherit"
            onClick={this.handleClickOpen}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Dialog
          maxWidth={false}
          classes={{ paperScrollPaper: classes.dialog }}
          open={open}
          onClose={this.close}
          aria-labelledby={EDIT_USER_IN_CLASSROOM_DIALOG_TITLE_ID}
        >
          <DialogTitle id={EDIT_USER_IN_CLASSROOM_DIALOG_TITLE_ID}>
            {`Edit information of ${name}`}
          </DialogTitle>
          <DialogContent>
            {this.renderUsernameInput(usernameErrorProps)}
            {this.renderUserData()}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary">
              {t('Cancel')}
            </Button>
            <Button
              onClick={this.handleValidate}
              color="primary"
              disabled={isDataInvalid}
              id={EDIT_USER_IN_CLASSROOM_VALIDATE_BUTTON_ID}
            >
              {t('Validate')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  userId: authentication.getIn(['user', 'id']),
});

const mapDispatchToProps = {
  dispatchEditUserInClassroom: editUserInClassroom,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditUserInClassroomButton);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

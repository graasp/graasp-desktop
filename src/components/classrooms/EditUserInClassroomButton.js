import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import EditIcon from '@material-ui/icons/Create';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { withTranslation } from 'react-i18next';
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

class EditUserInClassroomButton extends Component {
  state = (() => {
    const {
      user: { username },
    } = this.props;

    return {
      open: false,
      username,
    };
  })();

  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
    dispatchEditUserInClassroom: PropTypes.func.isRequired,
    classroomId: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
  };

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
    const { username } = this.state;
    const {
      dispatchEditUserInClassroom,
      user: { id: userId },
      classroomId,
      userId: teacherId,
    } = this.props;

    const trimmedUsername = username.trim();

    if (!isUsernameValid(trimmedUsername)) {
      toastr.error(ERROR_MESSAGE_HEADER, ERROR_INVALID_USERNAME_MESSAGE);
    } else {
      dispatchEditUserInClassroom({
        username: trimmedUsername,
        userId,
        classroomId,
        teacherId,
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

  render() {
    const {
      t,
      user: { username: name },
    } = this.props;
    const { username, open } = this.state;

    // check data to display error in form
    const trimmedUsername = username.trim();
    const usernameValidity = isUsernameValid(trimmedUsername);

    let errorProps = {};
    if (!usernameValidity) {
      errorProps = {
        ...errorProps,
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
          open={open}
          onClose={this.close}
          aria-labelledby={EDIT_USER_IN_CLASSROOM_DIALOG_TITLE_ID}
        >
          <DialogTitle id={EDIT_USER_IN_CLASSROOM_DIALOG_TITLE_ID}>
            {`Edit information of ${name}`}
          </DialogTitle>
          <DialogContent>
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
              {...errorProps}
            />
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

const TranslatedComponent = withTranslation()(ConnectedComponent);

export default TranslatedComponent;

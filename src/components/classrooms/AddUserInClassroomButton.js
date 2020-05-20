import React, { Component } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { addUserInClassroom } from '../../actions';
import { ADD_USER_IN_CLASSROOM_DIALOG_TITLE_ID } from '../../config/selectors';
import { isUsernameValid } from '../../utils/user';

const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
  },
});

class AddUserInClassroomButton extends Component {
  static propTypes = {
    dispatchAddUserInClassroom: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      fab: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    classroomId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
  };

  state = (() => {
    const { t } = this.props;
    return { open: false, name: t('Username') };
  })();

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  close = () => {
    this.setState({ name: '', open: false });
  };

  handleCancel = () => {
    this.close();
  };

  handleValidate = () => {
    const { name: username } = this.state;
    const { classroomId, dispatchAddUserInClassroom, userId } = this.props;
    dispatchAddUserInClassroom({ username, classroomId, userId });
    this.close();
  };

  handleChange = event => {
    const { target } = event;
    this.setState({ name: target.value });
  };

  render() {
    const { classes, t } = this.props;
    const { name, open } = this.state;

    const isValid = isUsernameValid(name);
    let errorProps = {};
    if (!isValid) {
      errorProps = {
        ...errorProps,
        helperText: t('Username is not valid.'),
        error: true,
      };
    }

    return (
      <>
        <Fab
          aria-label={t('add classroom')}
          className={classes.fab}
          color="primary"
          onClick={this.handleClickOpen}
        >
          <AddIcon />
        </Fab>

        <Dialog
          open={open}
          onClose={this.close}
          aria-labelledby={ADD_USER_IN_CLASSROOM_DIALOG_TITLE_ID}
        >
          <DialogTitle id={ADD_USER_IN_CLASSROOM_DIALOG_TITLE_ID}>
            {t('Enter a name for a new student')}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={t("Student's name")}
              type="text"
              fullWidth
              value={name}
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
              disabled={!isValid}
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
  dispatchAddUserInClassroom: addUserInClassroom,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddUserInClassroomButton);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent
);
const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

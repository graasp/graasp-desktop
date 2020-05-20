import React, { Component } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { addClassroom } from '../../actions';
import {
  ADD_CLASSROOM_BUTTON_ID,
  ADD_CLASSROOM_VALIDATE_BUTTON_ID,
  ADD_CLASSROOM_CANCEL_BUTTON_ID,
} from '../../config/selectors';
import ClassroomNameTextField from './ClassroomNameTextField';

const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
  },
});

const DIALOG_TITLE_ID = 'form-dialog-title';

class AddClassroomButton extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    dispatchAddClassroom: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      fab: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
  };

  state = (() => {
    const { t } = this.props;
    const defaultName = t('New Classroom');
    return {
      open: false,
      name: defaultName,
    };
  })();

  isClassroomNameValid = () => {
    const { name } = this.state;
    // todo: check for special characters
    return name.trim().length;
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  close = () => {
    this.setState({ open: false });
  };

  handleCancel = () => {
    this.close();
  };

  handleValidate = () => {
    const { name } = this.state;
    const { userId, dispatchAddClassroom } = this.props;
    if (this.isClassroomNameValid()) {
      const trimmedName = name.trim();
      dispatchAddClassroom({ name: trimmedName, userId });
      this.close();
    }
  };

  handleNameChange = event => {
    const { target } = event;
    this.setState({ name: target.value });
  };

  render() {
    const { classes, t } = this.props;
    const { name, open } = this.state;

    return (
      <>
        <Fab
          id={ADD_CLASSROOM_BUTTON_ID}
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
          aria-labelledby={DIALOG_TITLE_ID}
        >
          <DialogTitle id={DIALOG_TITLE_ID}>
            {t('Enter a name for your new classroom')}
          </DialogTitle>
          <DialogContent>
            <ClassroomNameTextField
              name={name}
              handleChange={this.handleNameChange}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleCancel}
              color="primary"
              id={ADD_CLASSROOM_CANCEL_BUTTON_ID}
            >
              {t('Cancel')}
            </Button>
            <Button
              onClick={this.handleValidate}
              color="primary"
              id={ADD_CLASSROOM_VALIDATE_BUTTON_ID}
              disabled={!this.isClassroomNameValid()}
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
  userMode: authentication.getIn(['user', 'settings', 'userMode']),
});

const mapDispatchToProps = {
  dispatchAddClassroom: addClassroom,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddClassroomButton);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent
);
const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

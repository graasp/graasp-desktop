import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditIcon from '@material-ui/icons/Create';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import CancelIcon from '@material-ui/icons/Cancel';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { withTranslation } from 'react-i18next';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { editClassroom } from '../../actions';
import {
  EDIT_CLASSROOM_BUTTON_CLASS,
  EDIT_CLASSROOM_VALIDATE_BUTTON_ID,
  EDIT_CLASSROOM_CANCEL_BUTTON_ID,
  EDIT_CLASSROOM_DELETE_DATA_BUTTON_CLASS,
} from '../../config/selectors';
import ClassroomNameTextField from './ClassroomNameTextField';
import { isClassroomNameValid } from '../../utils/classroom';

const styles = theme => ({
  deleted: {
    color: 'lightgrey',
  },
  dataTitle: {
    fontSize: 'default',
    fontWeight: 'bold',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
});

const buildDeleteSelection = spaces => {
  return spaces.reduce((selection, { id: spaceId }) => {
    return { ...selection, [spaceId]: false };
  }, {});
};

class EditClassroomButton extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      dataTitle: PropTypes.string.isRequired,
      deleted: PropTypes.string.isRequired,
    }).isRequired,
    dispatchEditClassroom: PropTypes.func.isRequired,
    classroom: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      spaces: PropTypes.arrayOf({}).isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
  };

  state = (() => {
    const {
      classroom: { name, spaces },
    } = this.props;

    // build delete selection on contained spaces for given user
    const deleteSelection = buildDeleteSelection(spaces);

    return {
      open: false,
      name,
      deleteSelection,
    };
  })();

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  close = () => {
    const {
      classroom: { spaces, name },
    } = this.props;
    // replace data with original state
    const deleteSelection = buildDeleteSelection(spaces);
    this.setState({ name, open: false, deleteSelection });
  };

  handleCancel = () => {
    this.close();
  };

  handleValidate = () => {
    const { name, deleteSelection } = this.state;
    const {
      dispatchEditClassroom,
      classroom: { id },
      userId,
    } = this.props;
    if (isClassroomNameValid(name)) {
      dispatchEditClassroom({ name, id, deleteSelection, userId });
      this.close();
    }
  };

  handleChange = event => {
    const { target } = event;
    this.setState({ name: target.value });
  };

  changeDeleteSelection = (event, spaceId, value) => {
    const { deleteSelection: prevDeleteSelection } = this.state;
    const deleteSelection = { ...prevDeleteSelection, [spaceId]: value };
    this.setState({ deleteSelection });
  };

  renderSpaces = () => {
    const {
      classroom: { spaces },
      classes,
      t,
    } = this.props;
    const { deleteSelection } = this.state;

    return (
      <>
        <Typography className={classes.dataTitle}>{t('Spaces')}</Typography>

        {spaces.length > 0 ? (
          <Grid container direction="row" justify="center" alignItems="center">
            {spaces.map(({ id: spaceId, name: spaceName }) => {
              const isSelected = deleteSelection[spaceId];

              const button = isSelected ? (
                <Tooltip title={t(`Cancel delete`)}>
                  <IconButton
                    color="primary"
                    onClick={e => this.changeDeleteSelection(e, spaceId, false)}
                  >
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title={t(`Delete this space`)}>
                  <IconButton
                    className={EDIT_CLASSROOM_DELETE_DATA_BUTTON_CLASS}
                    color="primary"
                    onClick={e => this.changeDeleteSelection(e, spaceId, true)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              );

              return (
                <Grid container data-space-id={spaceId} alignItems="center">
                  <Grid
                    item
                    xs={10}
                    classes={{
                      root: clsx({
                        [classes.deleted]: isSelected,
                      }),
                    }}
                  >
                    <Typography>{spaceName}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    {button}
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Typography>{t('This classroom is empty')}</Typography>
        )}
      </>
    );
  };

  render() {
    const { t } = this.props;
    const { name, open } = this.state;

    const DIALOG_TITLE_ID = 'form-dialog-title';
    return (
      <>
        <Tooltip title={t('Edit this classroom.')}>
          <IconButton
            color="inherit"
            onClick={this.handleClickOpen}
            className={EDIT_CLASSROOM_BUTTON_CLASS}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Dialog
          open={open}
          onClose={this.close}
          aria-labelledby={DIALOG_TITLE_ID}
        >
          <DialogTitle id={DIALOG_TITLE_ID}>
            Edit Classroom information
          </DialogTitle>
          <DialogContent>
            <ClassroomNameTextField
              name={name}
              handleChange={this.handleChange}
            />
            {this.renderSpaces()}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleCancel}
              color="primary"
              id={EDIT_CLASSROOM_CANCEL_BUTTON_ID}
            >
              {t('Cancel')}
            </Button>
            <Button
              onClick={this.handleValidate}
              color="primary"
              id={EDIT_CLASSROOM_VALIDATE_BUTTON_ID}
              disabled={!isClassroomNameValid(name)}
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
  dispatchEditClassroom: editClassroom,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditClassroomButton);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

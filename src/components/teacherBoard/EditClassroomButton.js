import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import { editClassroom } from '../../actions';

class EditClassroomButton extends Component {
  state = (() => {
    const {
      classroom: { name },
    } = this.props;

    return {
      open: false,
      name,
    };
  })();

  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
    dispatchEditClassroom: PropTypes.func.isRequired,
    classroom: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
  };

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
    const { name } = this.state;
    const {
      dispatchEditClassroom,
      classroom: { id },
    } = this.props;
    dispatchEditClassroom({ name, id });
    this.close();
  };

  handleChange = event => {
    const { target } = event;
    this.setState({ name: target.value });
  };

  render() {
    const { t } = this.props;
    const { name, open } = this.state;

    const DIALOG_TITLE_ID = 'form-dialog-title';
    return (
      <>
        <Tooltip title={t('Edit this classroom.')}>
          <IconButton color="inherit" onClick={this.handleClickOpen}>
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
            <TextField
              autoFocus
              margin="dense"
              label={t("Classroom's name")}
              type="text"
              fullWidth
              value={name}
              onChange={this.handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary">
              {t('Cancel')}
            </Button>
            <Button onClick={this.handleValidate} color="primary">
              {t('Validate')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

const mapDispatchToProps = {
  dispatchEditClassroom: editClassroom,
};

const ConnectedComponent = connect(
  null,
  mapDispatchToProps
)(EditClassroomButton);

const TranslatedComponent = withTranslation()(ConnectedComponent);

export default TranslatedComponent;

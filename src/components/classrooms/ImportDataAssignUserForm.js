import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import Typography from '@material-ui/core/Typography/Typography';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Styles from '../../Styles';
import { loadSpaceInClassroom, clearLoadSpaceInClassroom } from '../../actions';
import StudentForm from './StudentForm';
import LoadSpaceSelectors from '../space/load/LoadSpaceSelectors';
import { isSpaceDifferent as isSpaceDifferentFunc } from '../../utils/syncSpace';
import { IMPORT_DATA_CLASSROOM_VALIDATE_BUTTON_ID } from '../../config/selectors';
import { ERROR_MESSAGE_HEADER } from '../../config/messages';

const styles = theme => ({
  ...Styles(theme),
  buttons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class ImportDataAssignUserForm extends Component {
  static propTypes = {
    classroom: PropTypes.instanceOf(Map),
    t: PropTypes.func.isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    extractPath: PropTypes.string,
    space: PropTypes.instanceOf(Map),
    savedSpace: PropTypes.instanceOf(Map),
    elements: PropTypes.instanceOf(Map),
    dispatchLoadSpaceInClassroom: PropTypes.func.isRequired,
    dispatchClearLoadSpaceInClassroom: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      button: PropTypes.string.isRequired,
      buttons: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    classroom: Map(),
    extractPath: '',
    space: Map(),
    savedSpace: Map(),
    elements: Map(),
  };

  state = (() => {
    const { savedSpace, space, elements } = this.props;
    const isSpaceDifferent = isSpaceDifferentFunc(savedSpace, space);

    return {
      isSpaceDifferent,
      space: isSpaceDifferent,
      actions: !elements.get('actions').isEmpty(),
      appInstanceResources: !elements.get('appInstanceResources').isEmpty(),
      usernameOption: null,
    };
  })();

  componentDidUpdate(
    { space: prevSpace, savedSpace: prevSavedSpace },
    { isSpaceDifferent: prevIsSpaceDifferent }
  ) {
    const { space, savedSpace, elements } = this.props;

    if (!space.equals(prevSpace) || !savedSpace.equals(prevSavedSpace)) {
      this.handleSpaceIsDifferent(prevIsSpaceDifferent);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        actions: !elements.get('actions').isEmpty(),
        appInstanceResources: !elements.get('appInstanceResources').isEmpty(),
      });
    }
  }

  handleSpaceIsDifferent = prevIsSpaceDifferent => {
    const { savedSpace, space } = this.props;

    const isSpaceDifferent = isSpaceDifferentFunc(savedSpace, space);

    if (isSpaceDifferent !== prevIsSpaceDifferent) {
      // check space by default if it is different
      this.setState({ isSpaceDifferent, space: isSpaceDifferent });
    }
  };

  handleBack = () => {
    const { extractPath, dispatchClearLoadSpaceInClassroom } = this.props;
    // clearing load in classroom will show first loading form
    dispatchClearLoadSpaceInClassroom({ extractPath });
  };

  setUsername = option => {
    this.setState({ usernameOption: option });
  };

  renderSubmitButton = () => {
    const { t, classes, elements } = this.props;
    const { usernameOption } = this.state;

    let disabled = true;
    if (!elements.isEmpty()) {
      const { space, actions, appInstanceResources } = this.state;
      const selection = [space, actions, appInstanceResources];

      // disable submit if (no username is specified and there are resources/actions) and if nothing is checked
      const importResourcesOrActions = actions || appInstanceResources;
      disabled =
        !selection.includes(true) ||
        (importResourcesOrActions &&
          (!usernameOption || !usernameOption.value.length));
    }

    return (
      <Button
        id={IMPORT_DATA_CLASSROOM_VALIDATE_BUTTON_ID}
        variant="contained"
        onClick={this.handleValidate}
        color="primary"
        className={classes.button}
        disabled={disabled}
      >
        {t('Submit')}
      </Button>
    );
  };

  handleValidate = () => {
    const {
      extractPath,
      elements,
      classroom,
      dispatchLoadSpaceInClassroom,
      t,
    } = this.props;
    const { space, appInstanceResources, actions, usernameOption } = this.state;

    let username = null;
    if (usernameOption) {
      ({ value: username } = usernameOption);
    }

    // username cannot be null if actions or resources are imported
    if (!username && (appInstanceResources || actions)) {
      toastr.error(ERROR_MESSAGE_HEADER, t('A user needs to be specified'));
    } else {
      dispatchLoadSpaceInClassroom({
        extractPath,
        classroomId: classroom.get('id'),
        elements: elements.toJS(),
        username,
        selection: {
          space,
          appInstanceResources,
          actions,
        },
      });
    }
  };

  renderBackButton = () => {
    const { t, classes } = this.props;
    return (
      <>
        <Button
          variant="outlined"
          onClick={this.handleBack}
          color="primary"
          className={classes.button}
        >
          {t('Back')}
        </Button>
      </>
    );
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const { classroom, t, savedSpace, elements, classes } = this.props;

    const {
      space: isSpaceChecked,
      appInstanceResources: isResourcesChecked,
      actions: isActionsChecked,
      isSpaceDifferent,
    } = this.state;

    return (
      <>
        <StudentForm
          setUsername={this.setUsername}
          users={classroom.get('users')}
        />

        <Typography color="inherit">{`${t('Include')}:`}</Typography>
        <LoadSpaceSelectors
          // forbid loading an identical space
          // force loading a missing space
          // let the user choose whether he updates the space
          isSpaceDisabled={!isSpaceDifferent || savedSpace.isEmpty()}
          isSpaceDifferent={isSpaceDifferent}
          isSpaceChecked={isSpaceChecked}
          isResourcesChecked={isResourcesChecked}
          isActionsChecked={isActionsChecked}
          handleChange={this.handleChange}
          elements={elements}
        />
        <div className={classes.buttons}>
          {this.renderBackButton()}
          {this.renderSubmitButton()}
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ classroom }) => ({
  elements: classroom.getIn(['current', 'load', 'extract', 'elements']),
  classroom: classroom.getIn(['current', 'classroom']),
  savedSpace: classroom.getIn(['current', 'load', 'savedSpace']),
  extractPath: classroom.getIn(['current', 'load', 'extract', 'extractPath']),
  space: classroom.getIn(['current', 'load', 'extract', 'elements', 'space']),
});

const mapDispatchToProps = {
  dispatchClearLoadSpaceInClassroom: clearLoadSpaceInClassroom,
  dispatchLoadSpaceInClassroom: loadSpaceInClassroom,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportDataAssignUserForm);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent
);
const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);

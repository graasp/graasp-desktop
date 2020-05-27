import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import CardActions from '@material-ui/core/CardActions';
import { withTranslation } from 'react-i18next';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import { deleteClassroom } from '../../actions';
import EditClassroomButton from './EditClassroomButton';
import { buildClassroomPath } from '../../config/paths';
import {
  CLASSROOM_CARD_CLASS,
  buildClassroomCardId,
  DELETE_CLASSROOM_BUTTON_CLASS,
  CLASSROOM_CARD_SPACES_CLASS,
  CLASSROOM_CARD_STUDENTS_CLASS,
  CLASSROOM_CARD_NAME_CLASS,
} from '../../config/selectors';

const styles = theme => ({
  bullet: {
    display: 'inline-block',
    margin: theme.spacing(0, 1),
  },
});

class ClassroomCard extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      bullet: PropTypes.string.isRequired,
    }).isRequired,
    classroom: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      spaces: PropTypes.arrayOf(PropTypes.object),
      users: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    t: PropTypes.func.isRequired,
    dispatchDeleteClassroom: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    userId: PropTypes.string.isRequired,
  };

  viewLink = () => {
    const {
      classroom: { id },
      history: { push },
    } = this.props;
    push(buildClassroomPath(id));
  };

  deleteClassroom = () => {
    const {
      classroom: { id, name },
      userId,
      dispatchDeleteClassroom,
    } = this.props;
    dispatchDeleteClassroom({ id, name, userId });
  };

  renderDeleteButton = () => {
    const { t } = this.props;
    return (
      <Tooltip title={t('Delete this classroom.')}>
        <IconButton
          color="inherit"
          onClick={this.deleteClassroom}
          className={DELETE_CLASSROOM_BUTTON_CLASS}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );
  };

  render() {
    const { classroom, classes, t } = this.props;
    const { spaces, name, users, id } = classroom;
    const nbSpaces = spaces.length.toString();
    const nbUsers = users.length.toString();

    return (
      <Card
        className={CLASSROOM_CARD_CLASS}
        data-name={name}
        id={buildClassroomCardId(id)}
      >
        <CardActionArea onClick={this.viewLink}>
          <CardContent>
            <Typography
              variant="h5"
              component="h2"
              className={CLASSROOM_CARD_NAME_CLASS}
            >
              {name}
            </Typography>
            <Typography>
              <span className={CLASSROOM_CARD_SPACES_CLASS}>
                {`${nbSpaces} ${t('space(s)')}`}
              </span>
              <span className={classes.bullet}>•</span>
              <span className={CLASSROOM_CARD_STUDENTS_CLASS}>
                {`${nbUsers} ${t('student(s)')}`}
              </span>
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions disableSpacing>
          <EditClassroomButton classroom={classroom} />
          {this.renderDeleteButton()}
        </CardActions>
      </Card>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  userId: authentication.getIn(['user', 'id']),
});

const mapDispatchToProps = {
  dispatchDeleteClassroom: deleteClassroom,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ClassroomCard);
const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent
);
const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);

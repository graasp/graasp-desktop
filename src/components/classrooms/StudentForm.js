import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import Typography from '@material-ui/core/Typography/Typography';
import PropTypes from 'prop-types';
import Creatable from 'react-select/creatable';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Loader from '../common/Loader';

const styles = theme => ({
  select: {
    textAlign: 'left',
    marginBottom: theme.spacing(3),
  },
  title: {
    fontSize: 'default',
  },
});

class StudentForm extends Component {
  propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    activity: PropTypes.bool.isRequired,
    classes: PropTypes.shape({
      title: PropTypes.string.isRequired,
      select: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    setUsername: PropTypes.func.isRequired,
    users: PropTypes.arrayOf({
      username: PropTypes.string.isRequired,
    }).isRequired,
  };

  handleValidate = () => {
    // todo: dispatch add data
  };

  handleChange = newValue => {
    const { setUsername } = this.props;
    setUsername(newValue);
  };

  render() {
    const { activity, users, classes, t } = this.props;

    if (activity) {
      return (
        <div>
          <CssBaseline />
          <AppBar position="fixed">
            <Toolbar />
          </AppBar>
          <main className="Main">
            <Loader />
          </main>
        </div>
      );
    }

    const options = users.map(({ username }) => ({
      value: username,
      label: username,
    }));

    return (
      <>
        <Typography color="inherit" className={classes.title}>
          {t('Assign data to student')}
        </Typography>
        <Creatable
          className={classes.select}
          options={options}
          isClearable
          placeholder={t('Create new student...')}
          onChange={this.handleChange}
        />
      </>
    );
  }
}

const mapStateToProps = ({ classroom }) => ({
  activity: Boolean(classroom.get('activity').size),
});

const ConnectedComponent = connect(mapStateToProps, null)(StudentForm);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent
);
const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);

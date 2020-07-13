import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import ReactJson from 'react-json-view';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import { getDatabase, setDatabase, signOut } from '../../actions';
import Loader from '../common/Loader';
import Styles from '../../Styles';
import SampleDatabase from '../../data/sample';

export class DatabaseEditor extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      button: PropTypes.string.isRequired,
    }).isRequired,
    dispatchGetDatabase: PropTypes.func.isRequired,
    dispatchSetDatabase: PropTypes.func.isRequired,
    database: PropTypes.shape({
      spaces: PropTypes.array,
    }),
    user: PropTypes.instanceOf(Map).isRequired,
    dispatchSignOut: PropTypes.func.isRequired,
  };

  static defaultProps = {
    database: {},
  };

  componentDidMount() {
    const { dispatchGetDatabase } = this.props;
    dispatchGetDatabase();
  }

  handleEdit = ({ updated_src: updatedSrc }) => {
    const { dispatchSetDatabase } = this.props;
    dispatchSetDatabase(updatedSrc);
  };

  handleUseSampleDatabase = () => {
    const { dispatchSetDatabase, dispatchSignOut, user } = this.props;
    dispatchSetDatabase(SampleDatabase);

    // sign out to force authenticate with existing user
    dispatchSignOut(user);
  };

  render() {
    const { database, t, classes } = this.props;

    if (!database) {
      return <Loader />;
    }

    if (_.isEmpty(database)) {
      return <p>{t('The database is empty.')}</p>;
    }

    return (
      <div>
        <Typography variant="h6">{t('Manually Edit the Database')}</Typography>
        <ReactJson
          collapsed
          src={database}
          onEdit={this.handleEdit}
          onAdd={this.handleEdit}
          onDelete={this.handleEdit}
        />
        <br />
        <Button
          variant="contained"
          className={classes.button}
          onClick={this.handleUseSampleDatabase}
          color="primary"
        >
          {t('Use Sample Database')}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = ({ Developer, authentication }) => ({
  database: Developer.get('database'),
  user: authentication.get('user'),
});

const mapDispatchToProps = {
  dispatchGetDatabase: getDatabase,
  dispatchSetDatabase: setDatabase,
  dispatchSignOut: signOut,
};

const StyledComponent = withStyles(Styles, { withTheme: true })(DatabaseEditor);
const TranslatedComponent = withTranslation()(StyledComponent);
const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(TranslatedComponent);

export default ConnectedComponent;

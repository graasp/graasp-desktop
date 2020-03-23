import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import ReactJson from 'react-json-view';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import { getDatabase, setDatabase } from '../../actions';
import Loader from '../common/Loader';
import Styles from '../../Styles';
import SampleDatabase from '../../data/sample.json';

export class DatabaseEditor extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      button: PropTypes.string.isRequired,
    }).isRequired,
    dispatchGetDatabase: PropTypes.func.isRequired,
    dispatchSetDatabase: PropTypes.func.isRequired,
    database: PropTypes.shape({
      user: PropTypes.object,
      spaces: PropTypes.array,
    }),
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
    const { dispatchSetDatabase } = this.props;
    dispatchSetDatabase(SampleDatabase);
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

const mapStateToProps = ({ Developer }) => ({
  database: Developer.get('database'),
});

const mapDispatchToProps = {
  dispatchGetDatabase: getDatabase,
  dispatchSetDatabase: setDatabase,
};

const StyledComponent = withStyles(Styles, { withTheme: true })(DatabaseEditor);
const TranslatedComponent = withTranslation()(StyledComponent);
const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(TranslatedComponent);

export default ConnectedComponent;

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CountUp from 'react-countup';
import _ from 'lodash';
import { getDatabase, setDatabase } from '../../actions';
import Loader from '../common/Loader';

const styles = () => ({
  actionCounter: {
    fontSize: '6rem',
  },
});

// reference: https://github.com/MicheleBertoli/react-count-to

class ActionTotalCount extends PureComponent {
  static propTypes = {
    database: PropTypes.shape({
      user: PropTypes.object,
      spaces: PropTypes.array,
      actions: PropTypes.array,
    }),
    dispatchGetDatabase: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      actionCounter: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    database: {},
  };

  componentDidMount() {
    const { dispatchGetDatabase } = this.props;
    dispatchGetDatabase();
  }

  render() {
    const { database, classes, t } = this.props;

    if (!database || _.isEmpty(database)) {
      return <Loader />;
    }

    const { actions } = database;
    const count = actions.length;

    return (
      <>
        <Typography variant="h5">{t('Total Action Count')}</Typography>
        <Grid container justify="center" alignItems="center">
          <CountUp end={count} duration={5} className={classes.actionCounter} />
        </Grid>
      </>
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

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionTotalCount);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

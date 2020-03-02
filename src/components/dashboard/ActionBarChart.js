import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';
import { getDatabase, setDatabase } from '../../actions';
import Loader from '../common/Loader';
import Styles from '../../Styles';

class ActionBarChart extends PureComponent {
  static propTypes = {
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
      appBar: PropTypes.string.isRequired,
      appBarShift: PropTypes.string.isRequired,
      menuButton: PropTypes.string.isRequired,
      hide: PropTypes.string.isRequired,
      drawer: PropTypes.string.isRequired,
      drawerPaper: PropTypes.string.isRequired,
      drawerHeader: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      contentShift: PropTypes.string.isRequired,
      developer: PropTypes.string.isRequired,
      screenTitle: PropTypes.string.isRequired,
    }).isRequired,
    theme: PropTypes.shape({
      palette: PropTypes.shape({
        type: PropTypes.string.isRequired,
        primary: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
    }).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    i18n: PropTypes.shape({
      changeLanguage: PropTypes.func.isRequired,
    }).isRequired,
    database: PropTypes.shape({
      user: PropTypes.object,
      spaces: PropTypes.array,
      actions: PropTypes.array,
    }),
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    database: {},
  };

  render() {
    const { database, theme, t } = this.props;
    const {
      palette: { primary, type },
    } = theme;

    if (!database || _.isEmpty(database)) {
      return <Loader />;
    }

    const { spaces, actions } = database;
    const data =
      // group actions by space id
      Object.entries(_.groupBy(actions, 'spaceId'))
        // map space id to corresponding space name
        // reduce actions by count number
        .map(([id, actionElements]) => ({
          space: _.find(spaces, ['id', id]).name,
          count: actionElements.length,
        }));

    return (
      <>
        <Typography variant="h5">{t('Action Count Per Space')}</Typography>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width="100%"
            height="100%"
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="space" />
            <YAxis
              label={{
                value: 'Action count',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip />
            <Legend />
            <Bar name="action count" dataKey="count" fill={primary[type]} />
          </BarChart>
        </ResponsiveContainer>
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
)(ActionBarChart);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

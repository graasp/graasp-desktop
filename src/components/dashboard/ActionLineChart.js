import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import _ from 'lodash';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Loader from '../common/Loader';
import Styles from '../../Styles';

class ActionLineChart extends PureComponent {
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
        primary: PropTypes.shape().isRequired,
      }).isRequired,
    }).isRequired,
    i18n: PropTypes.shape({
      changeLanguage: PropTypes.func.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    actions: PropTypes.arrayOf(PropTypes.object),
    id: PropTypes.string,
  };

  static defaultProps = {
    actions: [],
    id: null,
  };

  formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
  };

  render() {
    const { theme, t, actions, id: elementId } = this.props;
    const {
      palette: { primary, type },
    } = theme;

    if (!actions) {
      return <Loader />;
    }

    if (_.isEmpty(actions)) {
      return <p>{t('No action has been recorded.')}</p>;
    }

    const dataWithDateFormatted = actions.map((action) => ({
      date: [this.formatDate(action.createdAt)],
      data: action.data,
    }));

    const data =
      // group actions by creation date
      Object.entries(_.groupBy(dataWithDateFormatted, 'date'))
        // reduce actions by count number
        .map(([date, actionElements]) => ({
          date,
          count: actionElements.length,
        }));

    return (
      <>
        <Typography variant="h5">{t('Action Count Per Space')}</Typography>
        <ResponsiveContainer id={elementId} width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" label={{ value: t('Time'), dy: 15 }} />
            <YAxis
              label={{
                value: t('Action Count'),
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip />
            <Line
              name="action count"
              type="monotone"
              dataKey="count"
              stroke={primary[type]}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </>
    );
  }
}

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ActionLineChart
);
const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

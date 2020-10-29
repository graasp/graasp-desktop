import React, { PureComponent } from 'react';
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
    t: PropTypes.func.isRequired,
    actions: PropTypes.arrayOf(PropTypes.object),
    spaces: PropTypes.arrayOf(PropTypes.object),
    id: PropTypes.string,
  };

  static defaultProps = {
    actions: [],
    spaces: [],
    id: null,
  };

  renderChart = (actions) => {
    const { spaces, theme, t, id: elementId } = this.props;
    const {
      palette: { primary, type },
    } = theme;

    const data =
      // group actions by space id
      Object.entries(_.groupBy(actions, 'spaceId'))
        // map space id to corresponding space name
        // reduce actions by count number
        .map(([id, actionElements]) => {
          const space = _.find(spaces, ['id', id]);
          const name = space ? space.name : id;
          return {
            space: name,
            count: actionElements.length,
          };
        });

    return (
      <ResponsiveContainer id={elementId} width="100%" height="100%">
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
              value: t('Action Count'),
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Tooltip />
          <Legend />
          <Bar name={t('Action Count')} dataKey="count" fill={primary[type]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  render() {
    const { spaces, t, actions } = this.props;

    // remove actions unrelated to spaces
    const actionsWithDefinedSpaceId = actions.filter(({ spaceId }) => spaceId);

    const content =
      _.isEmpty(spaces) || _.isEmpty(actionsWithDefinedSpaceId) ? (
        <p>{t('No action has been recorded.')}</p>
      ) : (
        this.renderChart(actionsWithDefinedSpaceId)
      );

    return (
      <>
        <Typography variant="h5">{t('Action Count Per Space')}</Typography>
        {content}
      </>
    );
  }
}

const StyledComponent = withStyles(Styles, { withTheme: true })(ActionBarChart);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

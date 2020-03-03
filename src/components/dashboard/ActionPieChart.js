import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Loader from '../common/Loader';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;

const styles = theme => ({
  customTooltip: {
    backgroundColor: 'white',
    padding: '0.05rem 0.5rem',
  },
  paper: {
    padding: theme.spacing(2),
  },
});

const CustomTooltip = ({ classes, active, payload }) => {
  if (active) {
    return (
      <div className={classes.customTooltip}>
        <p className="label">{`${payload[0].payload.verb} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

CustomTooltip.propTypes = {
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
    customTooltip: PropTypes.string.isRequired,
  }).isRequired,
  active: PropTypes.bool.isRequired,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      payload: PropTypes.shape({
        verb: PropTypes.string.isRequired,
      }).isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};

class ActionPieChart extends PureComponent {
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
      direction: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    i18n: PropTypes.shape({
      changeLanguage: PropTypes.func.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    actions: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    actions: [],
  };

  renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  render() {
    const { actions, classes, t } = this.props;

    if (!actions || _.isEmpty(actions)) {
      return <Loader />;
    }

    const data =
      // group actions by space id
      Object.entries(_.groupBy(actions, 'verb'))
        // map space id to corresponding space name
        // reduce actions by count number
        .map(([verb, actionElements]) => ({
          verb,
          count: actionElements.length,
        }));

    return (
      <>
        <Typography variant="h5">{t('Action Type Chart')}</Typography>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={this.renderCustomizedLabel}
              outerRadius={120}
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.verb}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip classes={classes} />} />
          </PieChart>
        </ResponsiveContainer>
      </>
    );
  }
}

const StyledComponent = withStyles(styles, { withTheme: true })(ActionPieChart);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

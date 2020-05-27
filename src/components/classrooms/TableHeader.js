import React, { Component } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import { TABLE_ORDER } from '../../config/constants';

const styles = () => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
});

// eslint-disable-next-line react/prefer-stateless-function
class TableHeader extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      visuallyHidden: PropTypes.string.isRequired,
    }).isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(Object.values(TABLE_ORDER)).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    headCells: PropTypes.shape([PropTypes.shape({})]).isRequired,
    t: PropTypes.func.isRequired,
  };

  render() {
    const {
      classes,
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
      headCells,
      t,
    } = this.props;

    const createSortHandler = property => event => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              color="primary"
              inputProps={{ 'aria-label': t('Select all') }}
            />
          </TableCell>
          {headCells.map(headCell => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : TABLE_ORDER.ASC}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === TABLE_ORDER.DESC
                      ? t('sorted descending')
                      : t('sorted ascending')}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
}

const StyledComponent = withStyles(styles, { withTheme: true })(TableHeader);
const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;

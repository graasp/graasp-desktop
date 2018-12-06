import React from 'react';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';

const Loader = ({ type }) => (
  <div className="Loader">
    <ReactLoading
      type={type}
      color="#444"
    />
  </div>
);

Loader.propTypes = {
  type: PropTypes.string,
};

Loader.defaultProps = {
  type: 'bubbles',
};

export default Loader;

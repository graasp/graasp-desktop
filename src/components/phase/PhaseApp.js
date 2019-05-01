import React from 'react';
import PropTypes from 'prop-types';
import './PhaseApp.css';

const PhaseApp = ({ url, asset, name }) => {
  let uri = url;
  if (asset) {
    uri = `file://${asset}`;
  }
  return (
    // state = {
    //   data: null,
    // };
    //
    // constructor(props) {
    //   super(props);
    //   this.retrieveData();
    // }
    //
    // storeData = async (key, value) => {
    //   try {
    //     await AsyncStorage.setItem(key, value);
    //   } catch (error) {
    //     // Error saving data
    //   }
    // };
    //
    // retrieveData = async () => {
    //   const { id } = this.props;
    //   try {
    //     const data = await AsyncStorage.getItem(id);
    //     if (data !== null) {
    //       this.setState({
    //         data,
    //       });
    //     }
    //   } catch (error) {
    //     // Error retrieving data
    //   }
    // };
    //
    // sendData = () => {
    //   const { data } = this.state;
    //   this.webView.postMessage(data, '*');
    // };
    //
    // receiveData = (data) => {
    //   const { id } = this.props;
    //   this.storeData(id, data);
    // };
    <div className="AppDiv">
      <iframe title={name} className="App" sandbox="allow-scripts" src={uri} />
    </div>
  );
};

PhaseApp.propTypes = {
  url: PropTypes.string,
  asset: PropTypes.string,
  name: PropTypes.string,
};

PhaseApp.defaultProps = {
  url: null,
  asset: null,
  name: 'Image',
};

export default PhaseApp;

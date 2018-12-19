import React, { Component } from 'react';
import './PhaseLab.css';

class PhaseLab extends Component {
  // state = {
  //   data: null,
  // };
  //
  // constructor(props) {
  //   super(props);
  //   // this.retrieveData();
  // }

  // storeData = async (key, value) => {
  //   try {
  //     await AsyncStorage.setItem(key, value);
  //   } catch (error) {
  //     // Error saving data
  //   }
  // };

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

  render() {
    const { uri } = this.props;
    return (
      <div className="LabDiv">
        <iframe className="Lab" sandbox="allow-scripts" src={uri} ref={f => this.iframe = f} />
      </div>);
  }
}

export default PhaseLab;

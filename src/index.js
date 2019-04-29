import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import App from './App';
import configureStore from './store/configure';

const { store } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

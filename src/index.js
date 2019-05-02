import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/browser';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import App from './App';
import configureStore from './store/configure';

// set up sentry
const { SENTRY_DSN } = process.env;

Sentry.init({
  dsn: SENTRY_DSN,
  beforeSend(event) {
    // check if it is an exception, and if so, show the report dialog
    if (event.exception) {
      Sentry.showReportDialog({ eventId: event.event_id });
    }
    return event;
  },
});

const { store } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

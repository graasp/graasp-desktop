import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/browser';
import { I18nextProvider } from 'react-i18next';
import i18nConfig from './config/i18n';
import { WHITELISTED_ERRORS } from './config/errors';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import 'react-resizable/css/styles.css';
import App from './App';
import configureStore from './store/configure';

const { REACT_APP_SENTRY_DSN } = process.env;

// set up sentry
Sentry.init({
  dsn: REACT_APP_SENTRY_DSN,
  ignoreErrors: WHITELISTED_ERRORS,
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
    <I18nextProvider i18n={i18nConfig}>
      <App />
    </I18nextProvider>
  </Provider>,
  document.getElementById('root')
);

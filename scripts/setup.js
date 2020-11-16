const fs = require('fs');
const path = require('path');

const DEFAULT_PATH = './public/';
const NAME = 'env.json';

const {
  SENTRY_DSN = '',
  GOOGLE_API_KEY = '',
  GOOGLE_ANALYTICS_ID = '',
  LOGGING_LEVEL = 'info',
} = process.env;

const env = JSON.stringify({
  SENTRY_DSN,
  GOOGLE_API_KEY,
  GOOGLE_ANALYTICS_ID,
  LOGGING_LEVEL,
  HELLO: 'er',
  REACT_APP_HELLO_D: 'wef',
});

fs.writeFileSync(path.join(DEFAULT_PATH, NAME), env, { encoding: 'utf8' });

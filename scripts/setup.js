const fs = require('fs');
const path = require('path');

const DEFAULT_PATH = './public/';
const NAME = 'env.json';

const { SENTRY_DSN = '', GOOGLE_API_KEY = '' } = process.env;

const env = JSON.stringify({
  SENTRY_DSN,
  GOOGLE_API_KEY,
});

fs.writeFileSync(path.join(DEFAULT_PATH, NAME), env, { encoding: 'utf8' });

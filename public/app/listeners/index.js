const loadSpace = require('./loadSpace');
const saveSpace = require('./saveSpace');
const getSpace = require('./getSpace');
const getSpaces = require('./getSpaces');
const deleteSpace = require('./deleteSpace');
const showSyncSpacePrompt = require('./showSyncSpacePrompt');
const syncSpace = require('./syncSpace');
const exportSpace = require('./exportSpace');
const getGeolocationEnabled = require('./getGeolocationEnabled');
const setGeolocationEnabled = require('./setGeolocationEnabled');
const showLoadSpacePrompt = require('./showLoadSpacePrompt');
const showExportSpacePrompt = require('./showExportSpacePrompt');
const showDeleteSpacePrompt = require('./showDeleteSpacePrompt');
const getUserFolder = require('./getUserFolder');
const setLanguage = require('./setLanguage');
const getLanguage = require('./getLanguage');
const getDeveloperMode = require('./getDeveloperMode');

module.exports = {
  loadSpace,
  saveSpace,
  getSpace,
  getSpaces,
  showSyncSpacePrompt,
  syncSpace,
  deleteSpace,
  exportSpace,
  getGeolocationEnabled,
  setGeolocationEnabled,
  showLoadSpacePrompt,
  showExportSpacePrompt,
  showDeleteSpacePrompt,
  getUserFolder,
  setLanguage,
  getLanguage,
  getDeveloperMode,
};

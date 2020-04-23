const loadSpace = require('./loadSpace');
const saveSpace = require('./saveSpace');
const getSpace = require('./getSpace');
const getSpaces = require('./getSpaces');
const deleteSpace = require('./deleteSpace');
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
const setDeveloperMode = require('./setDeveloperMode');
const getSyncAdvancedMode = require('./getSyncAdvancedMode');
const setSyncAdvancedMode = require('./setSyncAdvancedMode');
const clearUserInput = require('./clearUserInput');
const showClearUserInputPrompt = require('./showClearUserInputPrompt');
const postAction = require('./postAction');
const signIn = require('./signIn');
const signOut = require('./signOut');
const isAuthenticated = require('./isAuthenticated');
const getAppInstanceResources = require('./getAppInstanceResources');
const postAppInstanceResource = require('./postAppInstanceResource');
const patchAppInstanceResource = require('./patchAppInstanceResource');
const getAppInstance = require('./getAppInstance');

module.exports = {
  loadSpace,
  saveSpace,
  getSpace,
  getSpaces,
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
  setDeveloperMode,
  getSyncAdvancedMode,
  setSyncAdvancedMode,
  clearUserInput,
  showClearUserInputPrompt,
  postAction,
  signIn,
  signOut,
  isAuthenticated,
  getAppInstanceResources,
  postAppInstanceResource,
  patchAppInstanceResource,
  getAppInstance,
};

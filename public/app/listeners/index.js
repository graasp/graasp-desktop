const {
  loadSpace,
  clearLoadSpace,
  extractFileToLoadSpace,
} = require('./loadSpace');
const saveSpace = require('./saveSpace');
const getSpace = require('./getSpace');
const getSpaces = require('./getSpaces');
const { deleteSpace, deleteSpaceAndResources } = require('./deleteSpace');
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
const getSyncMode = require('./getSyncMode');
const setSyncMode = require('./setSyncMode');
const getUserMode = require('./getUserMode');
const setUserMode = require('./setUserMode');
const clearUserInput = require('./clearUserInput');
const showClearUserInputPrompt = require('./showClearUserInputPrompt');
const postAction = require('./postAction');
const { signIn } = require('./signIn');
const signOut = require('./signOut');
const isAuthenticated = require('./isAuthenticated');
const getAppInstanceResources = require('./getAppInstanceResources');
const postAppInstanceResource = require('./postAppInstanceResource');
const deleteAppInstanceResource = require('./deleteAppInstanceResource');
const patchAppInstanceResource = require('./patchAppInstanceResource');
const getAppInstance = require('./getAppInstance');
const setSpaceAsFavorite = require('./setSpaceAsFavorite');
const setSpaceAsRecent = require('./setSpaceAsRecent');
const addClassroom = require('./addClassroom');
const getClassrooms = require('./getClassrooms');
const deleteClassroom = require('./deleteClassroom');
const editClassroom = require('./editClassroom');
const showDeleteClassroomPrompt = require('./showDeleteClassroomPrompt');
const showDeleteUsersInClassroomPrompt = require('./showDeleteUsersInClassroomPrompt');
const getClassroom = require('./getClassroom');
const { addUserInClassroom } = require('./addUserInClassroom');
const deleteUsersInClassroom = require('./deleteUsersInClassroom');
const editUserInClassroom = require('./editUserInClassroom');
const getSpaceInClassroom = require('./getSpaceInClassroom');
const loadSpaceInClassroom = require('./loadSpaceInClassroom');
const setActionAccessibility = require('./setActionAccessibility');
const setActionsAsEnabled = require('./setActionsAsEnabled');
const windowAllClosed = require('./windowAllClosed');
const completeTour = require('./completeTour');
const postFile = require('./postFile');
const deleteFile = require('./deleteFile');
const installAppUpgrade = require('./installAppUpgrade');
const getAppUpgrade = require('./getAppUpgrade');
const getToursEnabled = require('./getToursEnabled');
const setFontSize = require('./setFontSize');
const getFontSize = require('./getFontSize');

module.exports = {
  loadSpace,
  clearLoadSpace,
  extractFileToLoadSpace,
  saveSpace,
  getSpace,
  getSpaces,
  syncSpace,
  deleteSpace,
  deleteSpaceAndResources,
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
  getSyncMode,
  setSyncMode,
  clearUserInput,
  showClearUserInputPrompt,
  postAction,
  signIn,
  signOut,
  isAuthenticated,
  getAppInstanceResources,
  postAppInstanceResource,
  deleteAppInstanceResource,
  patchAppInstanceResource,
  getAppInstance,
  getUserMode,
  setUserMode,
  setSpaceAsFavorite,
  setSpaceAsRecent,
  addClassroom,
  deleteClassroom,
  editClassroom,
  getClassrooms,
  getClassroom,
  showDeleteClassroomPrompt,
  addUserInClassroom,
  deleteUsersInClassroom,
  showDeleteUsersInClassroomPrompt,
  editUserInClassroom,
  getSpaceInClassroom,
  loadSpaceInClassroom,
  setActionAccessibility,
  setActionsAsEnabled,
  windowAllClosed,
  completeTour,
  postFile,
  deleteFile,
  installAppUpgrade,
  getAppUpgrade,
  getToursEnabled,
  setFontSize,
  getFontSize,
};

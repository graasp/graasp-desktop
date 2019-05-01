// this file needs to use module.exports as it is used both by react and electron
module.exports = {
  SAVE_SPACE_CHANNEL: 'space:save',
  GET_SPACE_CHANNEL: 'space:get',
  GET_SPACES_CHANNEL: 'spaces:get',
  DELETE_SPACE_CHANNEL: 'space:delete',
  DELETED_SPACE_CHANNEL: 'space:deleted',
  LOAD_SPACE_CHANNEL: 'space:load',
  LOADED_SPACE_CHANNEL: 'space:loaded',
  EXPORT_SPACE_CHANNEL: 'space:export',
  EXPORTED_SPACE_CHANNEL: 'space:exported',
  SHOW_OPEN_DIALOG_CHANNEL: 'show-open-dialog',
  SHOW_SAVE_DIALOG_CHANNEL: 'show-save-dialog',
  OPEN_DIALOG_PATHS_SELECTED_CHANNEL: 'open-dialog-paths-selected',
  SHOW_MESSAGE_DIALOG_CHANNEL: 'show-message-dialog',
  SAVE_DIALOG_PATH_SELECTED_CHANNEL: 'save-dialog-path-selected',
  MESSAGE_DIALOG_RESPOND_CHANNEL: 'message-dialog-respond',
};

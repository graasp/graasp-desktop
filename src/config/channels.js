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
  SHOW_LOAD_SPACE_PROMPT_CHANNEL: 'prompt:space:load:show',
  SHOW_EXPORT_SPACE_PROMPT_CHANNEL: 'prompt:space:export:show',
  SHOW_DELETE_SPACE_PROMPT_CHANNEL: 'prompt:space:delete:show',
  RESPOND_LOAD_SPACE_PROMPT_CHANNEL: 'prompt:space:load:response',
  RESPOND_EXPORT_SPACE_PROMPT_CHANNEL: 'prompt:space:export:respond',
  RESPOND_DELETE_SPACE_PROMPT_CHANNEL: 'prompt:space:delete:respond',
};

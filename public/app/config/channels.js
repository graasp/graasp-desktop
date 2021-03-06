// this file needs to use module.exports as it is used both by react and
// electron make sure this file is identical in both src/config/channels.js
// and public/app/config/channels.js

module.exports = {
  SAVE_SPACE_CHANNEL: 'space:save',
  GET_SPACE_CHANNEL: 'space:get',
  GET_SPACES_CHANNEL: 'spaces:get',
  DELETE_SPACE_CHANNEL: 'space:delete',
  DELETED_SPACE_CHANNEL: 'space:deleted',
  CLEAR_LOAD_SPACE_CHANNEL: 'space:load:clear',
  EXTRACT_FILE_TO_LOAD_SPACE_CHANNEL: 'space:load:extract-file',
  LOAD_SPACE_CHANNEL: 'space:load',
  LOADED_SPACE_CHANNEL: 'space:loaded',
  EXPORT_SPACE_CHANNEL: 'space:export',
  EXPORTED_SPACE_CHANNEL: 'space:exported',
  SHOW_LOAD_SPACE_PROMPT_CHANNEL: 'prompt:space:load:show',
  SHOW_EXPORT_SPACE_PROMPT_CHANNEL: 'prompt:space:export:show',
  RESPOND_EXPORT_SPACE_PROMPT_CHANNEL: 'prompt:space:export:respond',
  RESPOND_LOAD_SPACE_PROMPT_CHANNEL: 'prompt:space:load:respond',
  SHOW_DELETE_SPACE_PROMPT_CHANNEL: 'prompt:space:delete:show',
  RESPOND_DELETE_SPACE_PROMPT_CHANNEL: 'prompt:space:delete:respond',
  GET_USER_FOLDER_CHANNEL: 'user:folder:get',
  GET_LANGUAGE_CHANNEL: 'user:lang:get',
  SET_LANGUAGE_CHANNEL: 'user:lang:set',
  SET_DEVELOPER_MODE_CHANNEL: 'user:developer-mode:set',
  GET_DEVELOPER_MODE_CHANNEL: 'user:developer-mode:get',
  SET_GEOLOCATION_ENABLED_CHANNEL: 'user:geolocation-enabled:set', // todo: remove
  GET_GEOLOCATION_ENABLED_CHANNEL: 'user:geolocation-enabled:get', // todo: remove
  GET_APP_INSTANCE_RESOURCES_CHANNEL: 'app-instance-resources:get',
  POST_APP_INSTANCE_RESOURCE_CHANNEL: 'app-instance-resource:post',
  PATCH_APP_INSTANCE_RESOURCE_CHANNEL: 'app-instance-resource:patch',
  DELETE_APP_INSTANCE_RESOURCE_CHANNEL: 'app-instance-resource:delete',
  GET_APP_INSTANCE_CHANNEL: 'app-instance:get',
  PATCH_APP_INSTANCE_CHANNEL: 'app-instance:patch',
  GET_DATABASE_CHANNEL: 'developer:database:get',
  SET_DATABASE_CHANNEL: 'developer:database:set',
  RESPOND_SYNC_SPACE_PROMPT_CHANNEL: 'prompt:space:sync:respond',
  SYNC_SPACE_CHANNEL: 'space:sync',
  SYNCED_SPACE_CHANNEL: 'space:synced',
  CLEAR_USER_INPUT_CHANNEL: 'space:clear',
  CLEARED_USER_INPUT_CHANNEL: 'space:cleared',
  SHOW_CLEAR_USER_INPUT_PROMPT_CHANNEL: 'prompt:space:clear:show',
  RESPOND_CLEAR_USER_INPUT_PROMPT_CHANNEL: 'prompt:space:clear:respond',
  POST_ACTION_CHANNEL: 'action:post',
  SIGN_IN_CHANNEL: 'auth:signin',
  SIGN_OUT_CHANNEL: 'auth:signout',
  IS_AUTHENTICATED_CHANNEL: 'auth:authenticated:get',
  GET_SYNC_MODE_CHANNEL: 'sync:mode:get',
  SET_SYNC_MODE_CHANNEL: 'sync:mode:set',
  GET_USER_MODE_CHANNEL: 'user:mode:get',
  SET_USER_MODE_CHANNEL: 'user:mode:set',
  SET_SPACE_AS_FAVORITE_CHANNEL: 'user:set-space-favorite:set',
  SET_SPACE_AS_RECENT_CHANNEL: 'user:set-space-recent:set',
  SET_ACTION_ACCESSIBILITY_CHANNEL: 'user:action:accessibility:set',
  SET_ACTIONS_AS_ENABLED_CHANNEL: 'user:action:enabled:set',
  GET_CLASSROOMS_CHANNEL: 'classrooms:get',
  ADD_CLASSROOM_CHANNEL: 'classroom:add',
  DELETE_CLASSROOM_CHANNEL: 'classroom:delete',
  SHOW_DELETE_CLASSROOM_PROMPT_CHANNEL: 'prompt:classroom:delete:show',
  RESPOND_DELETE_CLASSROOM_PROMPT_CHANNEL: 'prompt:classroom:delete:respond',
  EDIT_CLASSROOM_CHANNEL: 'classroom:edit',
  GET_CLASSROOM_CHANNEL: 'classroom:get',
  ADD_USER_IN_CLASSROOM_CHANNEL: 'classroom:user:add',
  DELETE_USERS_IN_CLASSROOM_CHANNEL: 'classroom:user:delete',
  SHOW_DELETE_USERS_IN_CLASSROOM_PROMPT_CHANNEL:
    'prompt:classroom:user:delete:show',
  RESPOND_DELETE_USERS_IN_CLASSROOM_PROMPT_CHANNEL:
    'prompt:classroom:user:delete:respond',
  EDIT_USER_IN_CLASSROOM_CHANNEL: 'classroom:user:edit',
  GET_SPACE_IN_CLASSROOM_CHANNEL: 'classroom:space:get',
  LOAD_SPACE_IN_CLASSROOM_CHANNEL: 'classroom:space:load',
  GET_SPACE_TO_LOAD_IN_CLASSROOM_CHANNEL: 'classroom:space:load:get-space',
  POST_FILE_CHANNEL: 'file:post',
  DELETE_FILE_CHANNEL: 'file:delete',
  COMPLETE_TOUR_CHANNEL: 'tour:complete',
  GET_APP_UPGRADE_CHANNEL: 'app:upgrade:get',
  INSTALL_APP_UPGRADE_CHANNEL: 'app:upgrade:install',
  GET_TOURS_ENABLED_CHANNEL: 'tour:enabled:get',
  SET_FONT_SIZE_CHANNEL: 'user:font-size:set',
  GET_FONT_SIZE_CHANNEL: 'user:font-size:get',
};

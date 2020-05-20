export const HOME_PATH = '/';
export const SPACES_NEARBY_PATH = '/nearby';
export const VISIT_PATH = '/visit-space';
export const LOAD_SPACE_PATH = '/load-space';
export const LOAD_SELECTION_SPACE_PATH = `/load-space/selection`;
export const SETTINGS_PATH = '/settings';
export const SPACE_PATH = '/space/:id';
export const DEVELOPER_PATH = '/developer';
export const DASHBOARD_PATH = '/dashboard';
export const SIGN_IN_PATH = '/signin';
export const SYNC_SPACE_PATH = '/space/sync/:id';
export const SAVED_SPACES_PATH = '/saved-spaces';
export const CLASSROOMS_PATH = '/classrooms';

export const buildExportSelectionPathForSpaceId = (id = ':id') => {
  return `/space/export/${id}/selection`;
};

export const buildSpacePath = (id = ':id', saved = false) => {
  return `/space/${id}?saved=${saved}`;
};

export const buildClassroomPath = (id = ':id') => {
  return `/classrooms/${id}`;
};

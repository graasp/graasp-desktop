// request defaults
const DEFAULT_REQUEST = {
  headers: { 'content-type': 'application/json' },
  credentials: 'include',
};
export const DEFAULT_GET_REQUEST = {
  ...DEFAULT_REQUEST,
  method: 'GET',
};
export const DEFAULT_POST_REQUEST = {
  ...DEFAULT_REQUEST,
  method: 'POST',
};
export const DEFAULT_PATCH_REQUEST = {
  ...DEFAULT_REQUEST,
  method: 'PATCH',
};
export const DEFAULT_DELETE_REQUEST = {
  ...DEFAULT_REQUEST,
  method: 'DELETE',
};

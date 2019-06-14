const { REACT_APP_GRAASP_API_HOST, REACT_APP_GRAASP_HOST } = process.env;

export const generateGetSpaceEndpoint = id =>
  `${REACT_APP_GRAASP_API_HOST}/spaces/${id}/offline-structure`;

export const GET_SPACES_NEARBY_ENDPOINT = `${REACT_APP_GRAASP_HOST}/spaces/nearby`;

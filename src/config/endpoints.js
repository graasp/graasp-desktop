const { REACT_APP_GRAASP_HOST } = process.env;

export const generateGetSpaceEndpoint = id =>
  `${REACT_APP_GRAASP_HOST}/spaces/${id}/download-offline`;

export const GET_SPACES_NEARBY_ENDPOINT = `${REACT_APP_GRAASP_HOST}/spaces/nearby`;

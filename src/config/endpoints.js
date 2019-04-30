const { REACT_APP_GRAASP_HOST } = process.env;

// eslint-disable-next-line import/prefer-default-export
export const generateGetSpaceEndpoint = id =>
  `${REACT_APP_GRAASP_HOST}/spaces/${id}/download-offline`;

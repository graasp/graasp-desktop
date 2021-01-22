// eslint-disable-next-line import/prefer-default-export
export const searchSpacesByQuery = (spaces, query) =>
  spaces.filter(
    ({ name, description }) =>
      name.toLowerCase().trim().includes(query.toLowerCase().trim()) ||
      description.toLowerCase().trim().includes(query.toLowerCase().trim())
  );

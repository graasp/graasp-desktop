// eslint-disable-next-line import/prefer-default-export
export const searchSpacesByQuery = (spaces, query) => {
  return spaces.filter(({ name }) =>
    name.toLowerCase().includes(query.toLowerCase())
  );
};

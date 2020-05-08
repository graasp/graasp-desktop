// eslint-disable-next-line import/prefer-default-export
export const searchSpacesByQuery = (spaces, query) => {
  return spaces.filter(({ name }) =>
    name
      .toLowerCase()
      .trim()
      .includes(query.toLowerCase().trim())
  );
};

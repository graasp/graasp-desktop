/* eslint-disable-next-line import/prefer-default-export */
export const USER_GRAASP = {
  name: 'graasp',
  password: 'password',
};

export const buildResource = (data, spaceId, user) => {
  return {
    appInstance: '5d594472328fd9001e570eed',
    createdAt: '2020-03-23T17:21:28.611Z',
    updatedAt: '2020-03-23T17:21:28.611Z',
    data,
    format: 'v1',
    type: 'input',
    visibility: 'private',
    user,
    id: '5e78f018c5911b410cf61c32',
    spaceId,
  };
};

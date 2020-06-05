export const isClassroomNameValid = name => {
  // todo: check for special characters

  // check name is a string
  if (typeof name !== 'string' && !(name instanceof String)) {
    return false;
  }

  return Boolean(name.trim().length);
};

export const getUserResourcesForSpaceInClassroom = (
  classroom,
  spaceId,
  userId
) => {
  return classroom
    .get('appInstanceResources')
    .filter(({ spaceId: id, user }) => spaceId === id && user === userId);
};

export const getUserActionsForSpaceInClassroom = (
  classroom,
  spaceId,
  userId
) => {
  return classroom
    .get('actions')
    .filter(({ spaceId: id, user }) => spaceId === id && user === userId);
};

export const hasUserResourcesForSpaceInClassroom = (
  classroom,
  spaceId,
  userId
) => {
  return Boolean(
    getUserResourcesForSpaceInClassroom(classroom, spaceId, userId).length
  );
};

export const hasUserActionsForSpaceInClassroom = (
  classroom,
  spaceId,
  userId
) => {
  return Boolean(
    getUserActionsForSpaceInClassroom(classroom, spaceId, userId).length
  );
};

export const hasUserDataInClassroom = (classroom, userId) => {
  const hasActions = Boolean(
    classroom.get('actions').filter(({ user }) => user === userId).length
  );
  const hasResources = Boolean(
    classroom.get('appInstanceResources').filter(({ user }) => user === userId)
      .length
  );
  return hasActions || hasResources;
};

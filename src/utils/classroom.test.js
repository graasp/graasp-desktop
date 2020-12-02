import { Map } from 'immutable';

import {
  isClassroomNameValid,
  getUserResourcesForSpaceInClassroom,
  getUserActionsForSpaceInClassroom,
  hasUserDataInClassroom,
  hasUserActionsForSpaceInClassroom,
  hasUserResourcesForSpaceInClassroom,
} from './classroom';
import { isClassroomNameValidFixtures } from '../test/fixtures/classroom';
import { USER_ALICE, USER_BOB } from '../../test/fixtures/users';

const { username: alice } = USER_ALICE;
const { username: bob } = USER_BOB;

const createResource = (spaceId, user) => ({
  spaceId,
  user,
});

const createAction = (spaceId, user) => ({
  spaceId,
  user,
});

const createClassroom = (appInstanceResources = [], actions = []) =>
  Map({
    appInstanceResources,
    actions,
  });

describe('classroom', () => {
  describe.each(isClassroomNameValidFixtures)(
    'isClassroomNameValid',
    (name, result) => {
      it(`returns ${result} for '${name}'`, () => {
        const isValid = isClassroomNameValid(name);
        expect(isValid).toEqual(result);
      });
    }
  );

  describe('getUserResourcesForSpaceInClassroom', () => {
    it(`empty resources`, () => {
      const classroom = createClassroom();
      const res = getUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId1',
        alice
      );
      expect(res).toEqual([]);
      const res1 = getUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId2',
        alice
      );
      expect(res1).toEqual([]);
    });
    it(`classroom with 1 resource returns resources`, () => {
      const resource = createResource('spaceId1', alice);
      const classroom = createClassroom([resource]);
      const res = getUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId1',
        alice
      );
      expect(res).toEqual([resource]);
      const res1 = getUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId2',
        alice
      );
      expect(res1).toEqual([]);
      const res2 = getUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId1',
        bob
      );
      expect(res2).toEqual([]);
    });
    it(`classroom with 2 resources (2 spaces, 1 user) returns resources`, () => {
      const resource1 = createResource('spaceId1', alice);
      const resource2 = createResource('spaceId2', alice);
      const classroom = createClassroom([resource1, resource2]);
      const res = getUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId1',
        alice
      );
      expect(res).toEqual([resource1]);
      const res1 = getUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId2',
        alice
      );
      expect(res1).toEqual([resource2]);
      const res2 = getUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId2',
        bob
      );
      expect(res2).toEqual([]);
    });
    it(`classroom with 2 resources (1 space, 2 users) returns resources`, () => {
      const resource1 = createResource('spaceId1', alice);
      const resource2 = createResource('spaceId1', bob);
      const classroom = createClassroom([resource1, resource2]);
      const res = getUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId1',
        alice
      );
      expect(res).toEqual([resource1]);
      const res1 = getUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId2',
        alice
      );
      expect(res1).toEqual([]);
      const res2 = getUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId1',
        bob
      );
      expect(res2).toEqual([resource2]);
      const res3 = getUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId2',
        bob
      );
      expect(res3).toEqual([]);
    });
    it(`classroom with 2 resources (2 spaces, 2 users) returns resources`, () => {
      const resource1 = createResource('spaceId1', alice);
      const resource2 = createResource('spaceId2', bob);
      const classroom = createClassroom([resource1, resource2]);
      const res = getUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId1',
        alice
      );
      expect(res).toEqual([resource1]);
      const res1 = getUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId2',
        alice
      );
      expect(res1).toEqual([]);
      const res2 = getUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId1',
        bob
      );
      expect(res2).toEqual([]);
      const res3 = getUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId2',
        bob
      );
      expect(res3).toEqual([resource2]);
    });
  });

  describe('getUserActionsForSpaceInClassroom', () => {
    it(`empty actions`, () => {
      const classroom = createClassroom();
      const res = getUserActionsForSpaceInClassroom(
        classroom,
        'spaceId1',
        alice
      );
      expect(res).toEqual([]);
      const res1 = getUserActionsForSpaceInClassroom(
        classroom,
        'spaceId2',
        alice
      );
      expect(res1).toEqual([]);
    });
    it(`classroom with 1 action returns actions`, () => {
      const action = createAction('spaceId1', alice);
      const classroom = createClassroom([], [action]);
      const res = getUserActionsForSpaceInClassroom(
        classroom,
        'spaceId1',
        alice
      );
      expect(res).toEqual([action]);
      const res1 = getUserActionsForSpaceInClassroom(
        classroom,
        'spaceId2',
        alice
      );
      expect(res1).toEqual([]);
      const res2 = getUserActionsForSpaceInClassroom(
        classroom,
        'spaceId1',
        bob
      );
      expect(res2).toEqual([]);
    });
    it(`classroom with 2 actions (2 spaces, 1 user) returns actions`, () => {
      const action1 = createAction('spaceId1', alice);
      const action2 = createAction('spaceId2', alice);
      const classroom = createClassroom([], [action1, action2]);
      const res = getUserActionsForSpaceInClassroom(
        classroom,
        'spaceId1',
        alice
      );
      expect(res).toEqual([action1]);
      const res1 = getUserActionsForSpaceInClassroom(
        classroom,
        'spaceId2',
        alice
      );
      expect(res1).toEqual([action2]);
      const res2 = getUserActionsForSpaceInClassroom(
        classroom,
        'spaceId2',
        bob
      );
      expect(res2).toEqual([]);
    });
    it(`classroom with 2 actions (1 space, 2 users) returns actions`, () => {
      const action1 = createAction('spaceId1', alice);
      const action2 = createAction('spaceId1', bob);
      const classroom = createClassroom([], [action1, action2]);
      const res = getUserActionsForSpaceInClassroom(
        classroom,
        'spaceId1',
        alice
      );
      expect(res).toEqual([action1]);
      const res1 = getUserActionsForSpaceInClassroom(
        classroom,
        'spaceId2',
        alice
      );
      expect(res1).toEqual([]);
      const res2 = getUserActionsForSpaceInClassroom(
        classroom,
        'spaceId1',
        bob
      );
      expect(res2).toEqual([action2]);
      const res3 = getUserActionsForSpaceInClassroom(
        classroom,
        'spaceId2',
        bob
      );
      expect(res3).toEqual([]);
    });
    it(`classroom with 2 actions (2 spaces, 2 users) returns actions`, () => {
      const action1 = createAction('spaceId1', alice);
      const action2 = createAction('spaceId2', bob);
      const classroom = createClassroom([], [action1, action2]);
      const res = getUserActionsForSpaceInClassroom(
        classroom,
        'spaceId1',
        alice
      );
      expect(res).toEqual([action1]);
      const res1 = getUserActionsForSpaceInClassroom(
        classroom,
        'spaceId2',
        alice
      );
      expect(res1).toEqual([]);
      const res2 = getUserActionsForSpaceInClassroom(
        classroom,
        'spaceId1',
        bob
      );
      expect(res2).toEqual([]);
      const res3 = getUserActionsForSpaceInClassroom(
        classroom,
        'spaceId2',
        bob
      );
      expect(res3).toEqual([action2]);
    });
  });

  describe('hasUserResourcesForSpaceInClassroom', () => {
    it(`empty resources`, () => {
      const classroom = createClassroom();
      const res = hasUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId1',
        alice
      );
      expect(res).toEqual(false);
      const res1 = hasUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId2',
        alice
      );
      expect(res1).toEqual(false);
    });
    it(`classroom with 1 resource returns whether has resources`, () => {
      const resource = createResource('spaceId1', alice);
      const classroom = createClassroom([resource]);
      const res = hasUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId1',
        alice
      );
      expect(res).toEqual(true);
      const res1 = hasUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId2',
        alice
      );
      expect(res1).toEqual(false);
      const res2 = hasUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId1',
        bob
      );
      expect(res2).toEqual(false);
    });
    it(`classroom with 2 resources (2 spaces, 1 user) returns whether has resources`, () => {
      const resource1 = createResource('spaceId1', alice);
      const resource2 = createResource('spaceId2', alice);
      const classroom = createClassroom([resource1, resource2]);
      const res = hasUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId1',
        alice
      );
      expect(res).toEqual(true);
      const res1 = hasUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId2',
        alice
      );
      expect(res1).toEqual(true);
      const res2 = hasUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId2',
        bob
      );
      expect(res2).toEqual(false);
    });
    it(`classroom with 2 resources (1 space, 2 users) returns whether has resources`, () => {
      const resource1 = createResource('spaceId1', alice);
      const resource2 = createResource('spaceId1', bob);
      const classroom = createClassroom([resource1, resource2]);
      const res = hasUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId1',
        alice
      );
      expect(res).toEqual(true);
      const res1 = hasUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId2',
        alice
      );
      expect(res1).toEqual(false);
      const res2 = hasUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId1',
        bob
      );
      expect(res2).toEqual(true);
      const res3 = hasUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId2',
        bob
      );
      expect(res3).toEqual(false);
    });
    it(`classroom with 2 resources (2 spaces, 2 users) returns whether has resources`, () => {
      const resource1 = createResource('spaceId1', alice);
      const resource2 = createResource('spaceId2', bob);
      const classroom = createClassroom([resource1, resource2]);
      const res = hasUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId1',
        alice
      );
      expect(res).toEqual(true);
      const res1 = hasUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId2',
        alice
      );
      expect(res1).toEqual(false);
      const res2 = hasUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId1',
        bob
      );
      expect(res2).toEqual(false);
      const res3 = hasUserResourcesForSpaceInClassroom(
        classroom,
        'spaceId2',
        bob
      );
      expect(res3).toEqual(true);
    });
  });

  describe('hasUserActionsForSpaceInClassroom', () => {
    it(`empty actions`, () => {
      const classroom = createClassroom();
      const res = hasUserActionsForSpaceInClassroom(
        classroom,
        'spaceId1',
        alice
      );
      expect(res).toEqual(false);
      const res1 = hasUserActionsForSpaceInClassroom(
        classroom,
        'spaceId2',
        alice
      );
      expect(res1).toEqual(false);
    });
    it(`classroom with 1 action returns whether has actions`, () => {
      const action = createAction('spaceId1', alice);
      const classroom = createClassroom([], [action]);
      const res = hasUserActionsForSpaceInClassroom(
        classroom,
        'spaceId1',
        alice
      );
      expect(res).toEqual(true);
      const res1 = hasUserActionsForSpaceInClassroom(
        classroom,
        'spaceId2',
        alice
      );
      expect(res1).toEqual(false);
      const res2 = hasUserActionsForSpaceInClassroom(
        classroom,
        'spaceId1',
        bob
      );
      expect(res2).toEqual(false);
    });
    it(`classroom with 2 actions (2 spaces, 1 user) returns whether has actions`, () => {
      const action1 = createAction('spaceId1', alice);
      const action2 = createAction('spaceId2', alice);
      const classroom = createClassroom([], [action1, action2]);
      const res = hasUserActionsForSpaceInClassroom(
        classroom,
        'spaceId1',
        alice
      );
      expect(res).toEqual(true);
      const res1 = hasUserActionsForSpaceInClassroom(
        classroom,
        'spaceId2',
        alice
      );
      expect(res1).toEqual(true);
      const res2 = hasUserActionsForSpaceInClassroom(
        classroom,
        'spaceId2',
        bob
      );
      expect(res2).toEqual(false);
    });
    it(`classroom with 2 actions (1 space, 2 users) returns whether has actions`, () => {
      const action1 = createAction('spaceId1', alice);
      const action2 = createAction('spaceId1', bob);
      const classroom = createClassroom([], [action1, action2]);
      const res = hasUserActionsForSpaceInClassroom(
        classroom,
        'spaceId1',
        alice
      );
      expect(res).toEqual(true);
      const res1 = hasUserActionsForSpaceInClassroom(
        classroom,
        'spaceId2',
        alice
      );
      expect(res1).toEqual(false);
      const res2 = hasUserActionsForSpaceInClassroom(
        classroom,
        'spaceId1',
        bob
      );
      expect(res2).toEqual(true);
      const res3 = hasUserActionsForSpaceInClassroom(
        classroom,
        'spaceId2',
        bob
      );
      expect(res3).toEqual(false);
    });
    it(`classroom with 2 actions (2 spaces, 2 users) returns whether has actions`, () => {
      const action1 = createAction('spaceId1', alice);
      const action2 = createAction('spaceId2', bob);
      const classroom = createClassroom([], [action1, action2]);
      const res = hasUserActionsForSpaceInClassroom(
        classroom,
        'spaceId1',
        alice
      );
      expect(res).toEqual(true);
      const res1 = hasUserActionsForSpaceInClassroom(
        classroom,
        'spaceId2',
        alice
      );
      expect(res1).toEqual(false);
      const res2 = hasUserActionsForSpaceInClassroom(
        classroom,
        'spaceId1',
        bob
      );
      expect(res2).toEqual(false);
      const res3 = hasUserActionsForSpaceInClassroom(
        classroom,
        'spaceId2',
        bob
      );
      expect(res3).toEqual(true);
    });
  });

  describe('hasUserDataInClassroom', () => {
    it(`empty classroom`, () => {
      const classroom = createClassroom();
      const res = hasUserDataInClassroom(classroom, alice);
      expect(res).toEqual(false);
      const res1 = hasUserDataInClassroom(classroom, bob);
      expect(res1).toEqual(false);
    });
    it(`classroom with 1 action returns whether has data`, () => {
      const action = createAction('spaceId1', alice);
      const classroom = createClassroom([], [action]);
      const res = hasUserDataInClassroom(classroom, alice);
      expect(res).toEqual(true);
      const res2 = hasUserDataInClassroom(classroom, bob);
      expect(res2).toEqual(false);
    });
    it(`classroom with 1 resource returns whether has data`, () => {
      const resource = createResource('spaceId1', alice);
      const classroom = createClassroom([resource]);
      const res = hasUserDataInClassroom(classroom, alice);
      expect(res).toEqual(true);
      const res2 = hasUserDataInClassroom(classroom, bob);
      expect(res2).toEqual(false);
    });
    it(`classroom with 2 actions (2 spaces, 1 user) returns whether has data`, () => {
      const action1 = createAction('spaceId1', alice);
      const action2 = createAction('spaceId2', alice);
      const classroom = createClassroom([], [action1, action2]);
      const res = hasUserDataInClassroom(classroom, alice);
      expect(res).toEqual(true);
      const res2 = hasUserDataInClassroom(classroom, bob);
      expect(res2).toEqual(false);
    });
    it(`classroom with 2 resources (2 spaces, 1 user) returns whether has data`, () => {
      const resource1 = createResource('spaceId1', alice);
      const resource2 = createResource('spaceId2', alice);
      const classroom = createClassroom([resource1, resource2]);
      const res = hasUserDataInClassroom(classroom, alice);
      expect(res).toEqual(true);
      const res2 = hasUserDataInClassroom(classroom, bob);
      expect(res2).toEqual(false);
    });
    it(`classroom with 2 actions (1 space, 2 users) returns whether has data`, () => {
      const action1 = createAction('spaceId1', alice);
      const action2 = createAction('spaceId1', bob);
      const classroom = createClassroom([], [action1, action2]);
      const res = hasUserDataInClassroom(classroom, alice);
      expect(res).toEqual(true);
      const res3 = hasUserDataInClassroom(classroom, bob);
      expect(res3).toEqual(true);
    });
    it(`classroom with 2 resources (1 space, 2 users) returns whether has data`, () => {
      const resource1 = createResource('spaceId1', alice);
      const resource2 = createResource('spaceId1', bob);
      const classroom = createClassroom([resource1, resource2]);
      const res = hasUserDataInClassroom(classroom, alice);
      expect(res).toEqual(true);
      const res3 = hasUserDataInClassroom(classroom, bob);
      expect(res3).toEqual(true);
    });
    it(`classroom with 2 actions (2 spaces, 2 users) returns whether has data`, () => {
      const action1 = createAction('spaceId1', alice);
      const action2 = createAction('spaceId2', bob);
      const classroom = createClassroom([], [action1, action2]);
      const res = hasUserDataInClassroom(classroom, alice);
      expect(res).toEqual(true);
      const res3 = hasUserDataInClassroom(classroom, bob);
      expect(res3).toEqual(true);
    });
    it(`classroom with 2 resources (2 spaces, 2 users) returns whether has data`, () => {
      const resource1 = createResource('spaceId1', alice);
      const resource2 = createResource('spaceId2', bob);
      const classroom = createClassroom([resource1, resource2]);
      const res = hasUserDataInClassroom(classroom, alice);
      expect(res).toEqual(true);
      const res3 = hasUserDataInClassroom(classroom, bob);
      expect(res3).toEqual(true);
    });
    it(`classroom with 1 resource and 1 action (1 space, 1 user) returns whether has data`, () => {
      const resource1 = createResource('spaceId1', alice);
      const action1 = createAction('spaceId1', alice);
      const classroom = createClassroom([resource1], [action1]);
      const res = hasUserDataInClassroom(classroom, alice);
      expect(res).toEqual(true);
      const res3 = hasUserDataInClassroom(classroom, bob);
      expect(res3).toEqual(false);
    });
    it(`classroom with 1 resource and 1 action (2 spaces, 1 user) returns whether has data`, () => {
      const resource1 = createResource('spaceId1', alice);
      const action1 = createAction('spaceId2', alice);
      const classroom = createClassroom([resource1], [action1]);
      const res = hasUserDataInClassroom(classroom, alice);
      expect(res).toEqual(true);
      const res3 = hasUserDataInClassroom(classroom, bob);
      expect(res3).toEqual(false);
    });
    it(`classroom with 1 resource and 1 action (2 spaces, 2 users) returns whether has data`, () => {
      const resource1 = createResource('spaceId1', alice);
      const action1 = createAction('spaceId2', bob);
      const classroom = createClassroom([resource1], [action1]);
      const res = hasUserDataInClassroom(classroom, alice);
      expect(res).toEqual(true);
      const res3 = hasUserDataInClassroom(classroom, bob);
      expect(res3).toEqual(true);
    });
  });
});

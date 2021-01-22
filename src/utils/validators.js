import ObjectId from 'bson-objectid';
import { SHORT_ID_LENGTH } from '../config/constants';

const isValidSpaceShortId = (id) =>
  id.length === SHORT_ID_LENGTH && /^[a-z0-9]+$/i.test(id);

const isValidLongSpaceId = (id) => ObjectId.isValid(id);

const isValidSpaceId = (id) =>
  isValidLongSpaceId(id) || isValidSpaceShortId(id);

export { isValidSpaceId, isValidLongSpaceId, isValidSpaceShortId };

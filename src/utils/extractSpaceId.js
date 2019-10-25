import {
  GRAASP_CLOUD_LONG_LINK,
  GRAASP_CLOUD_SHORT_LINK,
  GRAASP_PAGES_PATH,
  GRAASP_SPACES_LINK,
  GRAASP_VIEWER_LONG_LINK,
} from '../config/links';
import { LONG_ID_LENGTH, SHORT_ID_LENGTH } from '../config/constants';

const extractSpaceId = string => {
  try {
    if (string.includes(GRAASP_SPACES_LINK)) {
      const split = string.split(GRAASP_SPACES_LINK);
      return split[1].substring(0, LONG_ID_LENGTH);
    }
    if (string.includes(GRAASP_CLOUD_LONG_LINK)) {
      const split = string.split(GRAASP_PAGES_PATH);
      return split[1].substring(0, LONG_ID_LENGTH);
    }
    if (string.includes(GRAASP_VIEWER_LONG_LINK)) {
      const split = string.split(GRAASP_PAGES_PATH);
      return split[1].substring(0, LONG_ID_LENGTH);
    }
    if (string.includes(GRAASP_CLOUD_SHORT_LINK)) {
      const split = string.split(GRAASP_CLOUD_SHORT_LINK);
      return split[1].substring(0, SHORT_ID_LENGTH);
    }
    return false;
  } catch {
    return false;
  }
};

export default extractSpaceId;

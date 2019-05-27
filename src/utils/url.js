import { SMART_GATEWAY_HOST } from '../config/constants';

const isSmartGatewayUrl = url => url.includes(SMART_GATEWAY_HOST);

export {
  // eslint-disable-next-line
  isSmartGatewayUrl,
};

export { addClerkPrefix, getScriptUrl, getClerkJsMajorVersionOrTag } from '@appypeeps/clerk-shared/url';
export { retry } from '@appypeeps/clerk-shared/retry';
export {
  isDevelopmentFromSecretKey,
  isProductionFromSecretKey,
  parsePublishableKey,
  getCookieSuffix,
  getSuffixedCookieName,
} from '@appypeeps/clerk-shared/keys';
export { deprecated, deprecatedProperty } from '@appypeeps/clerk-shared/deprecated';

import { buildErrorThrower } from '@appypeeps/clerk-shared/error';
import { createDevOrStagingUrlCache } from '@appypeeps/clerk-shared/keys';
// TODO: replace packageName with `${PACKAGE_NAME}@${PACKAGE_VERSION}` from tsup.config.ts
export const errorThrower = buildErrorThrower({ packageName: '@appypeeps/clerk-backend' });

export const { isDevOrStagingUrl } = createDevOrStagingUrlCache();

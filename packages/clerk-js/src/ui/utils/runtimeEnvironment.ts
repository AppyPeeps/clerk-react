import { isDevelopmentEnvironment } from '@appypeeps/clerk-shared/utils';
import type { LoadedClerk } from '@appypeeps/clerk-types';

export const isDevelopmentSDK = (clerk: LoadedClerk) =>
  isDevelopmentEnvironment() || clerk.sdkMetadata?.environment === 'development';

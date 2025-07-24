import { useAssertWrappedByClerkProvider as useSharedAssertWrappedByClerkProvider } from '@appypeeps/clerk-shared/react';

import { errorThrower } from '../errors/errorThrower';

export const useAssertWrappedByClerkProvider = (source: string): void => {
  useSharedAssertWrappedByClerkProvider(() => {
    errorThrower.throwMissingClerkProviderError({ source });
  });
};

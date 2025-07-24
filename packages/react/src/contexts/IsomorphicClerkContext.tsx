import { ClerkInstanceContext, useClerkInstanceContext } from '@appypeeps/clerk-shared/react';

import type { IsomorphicClerk } from '../isomorphicClerk';

export const IsomorphicClerkContext = ClerkInstanceContext;
export const useIsomorphicClerkContext = useClerkInstanceContext as unknown as () => IsomorphicClerk;

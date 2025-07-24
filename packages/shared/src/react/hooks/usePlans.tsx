import type { CommercePlanResource, GetPlansParams } from '@appypeeps/clerk-types';

import { useClerkInstanceContext } from '../contexts';
import { createCommercePaginatedHook } from './createCommerceHook';

/**
 * @internal
 */
export const usePlans = createCommercePaginatedHook<CommercePlanResource, GetPlansParams>({
  hookName: 'usePlans',
  resourceType: 'commerce-plans',
  useFetcher: _for => {
    const clerk = useClerkInstanceContext();
    return params => clerk.billing.getPlans({ ...params, for: _for === 'organization' ? 'org' : 'user' });
  },
  options: {
    unauthenticated: true,
  },
});

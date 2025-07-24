import type { CommercePaymentResource, GetPaymentAttemptsParams } from '@appypeeps/clerk-types';

import { useClerkInstanceContext } from '../contexts';
import { createCommercePaginatedHook } from './createCommerceHook';

/**
 * @internal
 */
export const usePaymentAttempts = createCommercePaginatedHook<CommercePaymentResource, GetPaymentAttemptsParams>({
  hookName: 'usePaymentAttempts',
  resourceType: 'commerce-payment-attempts',
  useFetcher: () => {
    const clerk = useClerkInstanceContext();
    return clerk.billing.getPaymentAttempts;
  },
});

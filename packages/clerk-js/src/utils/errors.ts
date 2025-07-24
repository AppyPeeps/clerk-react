import type { ClerkAPIError } from '@appypeeps/clerk-types';

import type { ClerkAPIResponseError } from '../core/resources/internal';

export function isError(err: ClerkAPIResponseError, code = ''): boolean {
  return err.errors && !!err.errors.find((e: ClerkAPIError) => e.code === code);
}

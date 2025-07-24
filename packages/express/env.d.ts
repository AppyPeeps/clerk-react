import type { AuthObject } from '@appypeeps/clerk-backend';
import type { PendingSessionOptions } from '@appypeeps/clerk-types';

declare global {
  namespace Express {
    interface Request {
      auth: AuthObject & {
        (options?: PendingSessionOptions): AuthObject;
      };
    }
  }
}

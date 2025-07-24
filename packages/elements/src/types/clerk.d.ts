import '@appypeeps/clerk-types';

import type { EnvironmentResource } from '@appypeeps/clerk-types';

declare module '@appypeeps/clerk-types' {
  export interface Clerk {
    __unstable__environment: EnvironmentResource | null | undefined;
  }
}

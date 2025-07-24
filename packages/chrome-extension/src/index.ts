export * from './react/re-exports';

export type { StorageCache } from './internal/utils/storage';

// The order matters since we want override @appypeeps/clerk-react components
export { ClerkProvider, GoogleOneTap } from './react';

// Override Clerk React error thrower to show that errors come from @appypeeps/clerk-chrome-extension
import { setErrorThrowerOptions } from '@appypeeps/clerk-react/internal';
setErrorThrowerOptions({ packageName: PACKAGE_NAME });

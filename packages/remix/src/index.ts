import './globalPolyfill';

export * from './client';

// Override Clerk React error thrower to show that errors come from @appypeeps/clerk-remix
import { setErrorThrowerOptions } from '@appypeeps/clerk-react/internal';
setErrorThrowerOptions({ packageName: PACKAGE_NAME });

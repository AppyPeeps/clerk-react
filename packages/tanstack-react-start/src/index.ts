export * from './client/index';

// Override Clerk React error thrower to show that errors come from @appypeeps/clerk-tanstack-react-start
import { setErrorThrowerOptions } from '@appypeeps/clerk-react/internal';
setErrorThrowerOptions({ packageName: PACKAGE_NAME });

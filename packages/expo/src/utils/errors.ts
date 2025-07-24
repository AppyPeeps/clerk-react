import { buildErrorThrower } from '@appypeeps/clerk-shared/error';

export const errorThrower = buildErrorThrower({ packageName: PACKAGE_NAME });

import { buildErrorThrower } from '@appypeeps/clerk-shared/error';

const errorThrower = buildErrorThrower({ packageName: __PKG_NAME__ });

export { errorThrower };

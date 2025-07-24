import type { ErrorThrowerOptions } from '@appypeeps/clerk-shared/error';
import { buildErrorThrower } from '@appypeeps/clerk-shared/error';

const errorThrower = buildErrorThrower({ packageName: '@appypeeps/clerk-vue' });

export { errorThrower };

/**
 * Overrides options of the internal errorThrower (eg setting packageName prefix).
 *
 * @internal
 */
export function setErrorThrowerOptions(options: ErrorThrowerOptions) {
  errorThrower.setMessages(options).setPackageName(options);
}

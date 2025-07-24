import { createDevOrStagingUrlCache } from '@appypeeps/clerk-shared/keys';
const { isDevOrStagingUrl } = createDevOrStagingUrlCache();
export { isDevOrStagingUrl };

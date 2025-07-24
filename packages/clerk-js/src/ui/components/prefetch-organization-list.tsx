import { useOrganizationList } from '@appypeeps/clerk-shared/react';

import { organizationListParams } from './OrganizationSwitcher/utils';

export function OrganizationSwitcherPrefetch() {
  useOrganizationList(organizationListParams);
  return null;
}

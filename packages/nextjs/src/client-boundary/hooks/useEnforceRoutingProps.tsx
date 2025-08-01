import { useRoutingProps } from '@appypeeps/clerk-react/internal';
import type { RoutingOptions } from '@appypeeps/clerk-types';

import { useEnforceCatchAllRoute } from './useEnforceCatchAllRoute';
import { usePathnameWithoutCatchAll } from './usePathnameWithoutCatchAll';

export function useEnforceCorrectRoutingProps<T extends RoutingOptions>(
  componentName: string,
  props: T,
  requireSessionBeforeCheck = true,
): T {
  const path = usePathnameWithoutCatchAll();
  const routingProps = useRoutingProps(componentName, props, { path });
  useEnforceCatchAllRoute(componentName, path, routingProps.routing, requireSessionBeforeCheck);
  return routingProps;
}

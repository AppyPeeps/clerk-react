import { useClerk } from '@appypeeps/clerk-shared/react';
import type { UserResource } from '@appypeeps/clerk-types';

type UseMultipleSessionsParam = {
  user: UserResource | null | undefined;
};

const useMultipleSessions = (params: UseMultipleSessionsParam) => {
  const clerk = useClerk();
  const signedInSessions = clerk.client.signedInSessions;

  return {
    signedInSessions,
    otherSessions: signedInSessions.filter(s => s.user?.id !== params.user?.id),
  };
};

export { useMultipleSessions };

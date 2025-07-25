import { assertContextExists, ClientContext, useClientContext } from '@appypeeps/clerk-shared/react';
import type { SignInResource, SignUpResource } from '@appypeeps/clerk-types';

export function useCoreSignIn(): SignInResource {
  const ctx = useClientContext();
  assertContextExists(ctx, ClientContext);
  return ctx.signIn;
}

export function useCoreSignUp(): SignUpResource {
  const ctx = useClientContext();
  assertContextExists(ctx, ClientContext);
  return ctx.signUp;
}

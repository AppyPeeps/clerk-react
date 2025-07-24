import { createClerkClient } from '@appypeeps/clerk-backend';
import type { AuthenticateRequestOptions, SignedInState, SignedOutState } from '@appypeeps/clerk-backend/internal';
import { AuthStatus, constants } from '@appypeeps/clerk-backend/internal';
import { handleNetlifyCacheInDevInstance } from '@appypeeps/clerk-shared/netlifyCacheHandler';
import type { LoaderFunctionArgs } from 'react-router';

import { patchRequest } from './utils';

export async function authenticateRequest(
  args: LoaderFunctionArgs,
  opts: AuthenticateRequestOptions,
): Promise<SignedInState | SignedOutState> {
  const { request } = args;
  const { audience, authorizedParties } = opts;

  const { apiUrl, secretKey, jwtKey, proxyUrl, isSatellite, domain, publishableKey } = opts;
  const { signInUrl, signUpUrl, afterSignInUrl, afterSignUpUrl } = opts;

  const requestState = await createClerkClient({
    apiUrl,
    secretKey,
    jwtKey,
    proxyUrl,
    isSatellite,
    domain,
    publishableKey,
    userAgent: `${PACKAGE_NAME}@${PACKAGE_VERSION}`,
  }).authenticateRequest(patchRequest(request), {
    audience,
    authorizedParties,
    signInUrl,
    signUpUrl,
    afterSignInUrl,
    afterSignUpUrl,
  });

  const locationHeader = requestState.headers.get(constants.Headers.Location);
  if (locationHeader) {
    handleNetlifyCacheInDevInstance({
      locationHeader,
      requestStateHeaders: requestState.headers,
      publishableKey: requestState.publishableKey,
    });
    // triggering a handshake redirect
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response(null, { status: 307, headers: requestState.headers });
  }

  if (requestState.status === AuthStatus.Handshake) {
    throw new Error('Clerk: unexpected handshake without redirect');
  }

  return requestState;
}

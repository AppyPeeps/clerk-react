import type { RequestState } from '@appypeeps/clerk-backend/internal';
import { debugRequestState } from '@appypeeps/clerk-backend/internal';
import { getEnvVariable } from '@appypeeps/clerk-shared/getEnvVariable';
import { isTruthy } from '@appypeeps/clerk-shared/underscore';

import type { AdditionalStateOptions } from '../types';

/**
 * Wraps obscured clerk internals with a readable `clerkState` key.
 * This is intended to be passed into <ClerkProvider>
 *
 * @internal
 */
export const wrapWithClerkState = (data: any) => {
  return { __internal_clerk_state: { ...data } };
};

/**
 * Returns the clerk state object and observability headers to be injected into a context.
 *
 * @internal
 */
export function getResponseClerkState(requestState: RequestState, additionalStateOptions: AdditionalStateOptions = {}) {
  const { reason, message, isSignedIn, ...rest } = requestState;

  const clerkInitialState = wrapWithClerkState({
    __clerk_ssr_state: rest.toAuth(),
    __publishableKey: requestState.publishableKey,
    __proxyUrl: requestState.proxyUrl,
    __domain: requestState.domain,
    __isSatellite: requestState.isSatellite,
    __signInUrl: requestState.signInUrl,
    __signUpUrl: requestState.signUpUrl,
    __afterSignInUrl: requestState.afterSignInUrl,
    __afterSignUpUrl: requestState.afterSignUpUrl,
    __clerk_debug: debugRequestState(requestState),
    __clerkJSUrl: getEnvVariable('CLERK_JS'),
    __clerkJSVersion: getEnvVariable('CLERK_JS_VERSION'),
    __telemetryDisabled: isTruthy(getEnvVariable('CLERK_TELEMETRY_DISABLED')),
    __telemetryDebug: isTruthy(getEnvVariable('CLERK_TELEMETRY_DEBUG')),
    __signInForceRedirectUrl:
      additionalStateOptions.signInForceRedirectUrl || getEnvVariable('CLERK_SIGN_IN_FORCE_REDIRECT_URL') || '',
    __signUpForceRedirectUrl:
      additionalStateOptions.signUpForceRedirectUrl || getEnvVariable('CLERK_SIGN_UP_FORCE_REDIRECT_URL') || '',
    __signInFallbackRedirectUrl:
      additionalStateOptions.signInFallbackRedirectUrl || getEnvVariable('CLERK_SIGN_IN_FALLBACK_REDIRECT_URL') || '',
    __signUpFallbackRedirectUrl:
      additionalStateOptions.signUpFallbackRedirectUrl || getEnvVariable('CLERK_SIGN_UP_FALLBACK_REDIRECT_URL') || '',
  });

  return {
    clerkInitialState,
    headers: requestState.headers,
  };
}

/**
 * Patches request to avoid duplex issues with unidici
 * For more information, see:
 * https://github.com/nodejs/node/issues/46221
 * https://github.com/whatwg/fetch/pull/1457
 * @internal
 */
export const patchRequest = (request: Request) => {
  const clonedRequest = new Request(request.url, {
    headers: request.headers,
    method: request.method,
    redirect: request.redirect,
    cache: request.cache,
    signal: request.signal,
  });

  // If duplex is not set, set it to 'half' to avoid duplex issues with unidici
  if (clonedRequest.method !== 'GET' && clonedRequest.body !== null && !('duplex' in clonedRequest)) {
    (clonedRequest as unknown as { duplex: 'half' }).duplex = 'half';
  }

  return clonedRequest;
};

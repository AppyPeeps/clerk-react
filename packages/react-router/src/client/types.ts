import type { ClerkProviderProps } from '@appypeeps/clerk-react';
import type { InitialState, Without } from '@appypeeps/clerk-types';
import type React from 'react';

export type ClerkState = {
  __type: 'clerkState';
  __internal_clerk_state: {
    __clerk_ssr_state: InitialState;
    __publishableKey: string | undefined;
    __proxyUrl: string | undefined;
    __domain: string | undefined;
    __isSatellite: boolean;
    __signInUrl: string | undefined;
    __signUpUrl: string | undefined;
    __afterSignInUrl: string | undefined;
    __afterSignUpUrl: string | undefined;
    __signInForceRedirectUrl: string | undefined;
    __signUpForceRedirectUrl: string | undefined;
    __signInFallbackRedirectUrl: string | undefined;
    __signUpFallbackRedirectUrl: string | undefined;
    __clerk_debug: any;
    __clerkJSUrl: string | undefined;
    __clerkJSVersion: string | undefined;
    __telemetryDisabled: boolean | undefined;
    __telemetryDebug: boolean | undefined;
  };
};

export type WithClerkState<U = any> = {
  data: U;
  clerkState: { __type: 'clerkState' };
};

export type ReactRouterClerkProviderProps = Without<ClerkProviderProps, 'publishableKey' | 'initialState'> & {
  /**
   * Used to override the default VITE_CLERK_PUBLISHABLE_KEY env variable if needed.
   * This is optional for React Router (in SSR mode) as the ClerkProvider will automatically use the VITE_CLERK_PUBLISHABLE_KEY env variable if it exists.
   * If you use React Router in SPA mode or as a library, you have to pass the publishableKey prop.
   */
  publishableKey?: string;
  children: React.ReactNode;
};

declare global {
  interface Window {
    __reactRouterContext: {
      isSpaMode?: boolean;
    };
  }
}

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
    __clerk_debug: any;
    __clerkJSUrl: string | undefined;
    __clerkJSVersion: string | undefined;
    __telemetryDisabled: boolean | undefined;
    __telemetryDebug: boolean | undefined;
  };
};

export type TanstackStartClerkProviderProps = Without<ClerkProviderProps, 'publishableKey' | 'initialState'> & {
  publishableKey?: string;
  children: React.ReactNode;
};

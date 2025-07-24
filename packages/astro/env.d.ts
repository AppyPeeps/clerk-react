/* eslint-disable @typescript-eslint/consistent-type-imports */

declare namespace App {
  interface Locals {
    authToken: string | null;
    authStatus: string;
    authMessage: string | null;
    authReason: string | null;
    auth: () => import('@appypeeps/clerk-astro/server').GetAuthReturn & {
      redirectToSignIn: import('@appypeeps/clerk-backend/internal').RedirectFun<Response>;
    };
    currentUser: () => Promise<import('@appypeeps/clerk-astro/server').User | null>;
  }
}

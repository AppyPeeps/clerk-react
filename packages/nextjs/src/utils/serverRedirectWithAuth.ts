// Middleware runs on the server side, before clerk-js is loaded, that's why we need Cookies.
import type { ClerkRequest } from '@appypeeps/clerk-backend/internal';
import { constants } from '@appypeeps/clerk-backend/internal';
import { DEV_BROWSER_JWT_KEY, setDevBrowserJWTInURL } from '@appypeeps/clerk-shared/devBrowser';
import { isDevelopmentFromSecretKey } from '@appypeeps/clerk-shared/keys';
import { NextResponse } from 'next/server';

/**
 * Grabs the dev browser JWT from cookies and appends it to the redirect URL when redirecting to cross-origin.
 */
export const serverRedirectWithAuth = (clerkRequest: ClerkRequest, res: Response, opts: { secretKey: string }) => {
  const location = res.headers.get('location');
  const shouldAppendDevBrowser = res.headers.get(constants.Headers.ClerkRedirectTo) === 'true';

  if (
    shouldAppendDevBrowser &&
    !!location &&
    isDevelopmentFromSecretKey(opts.secretKey) &&
    clerkRequest.clerkUrl.isCrossOrigin(location)
  ) {
    const dbJwt = clerkRequest.cookies.get(DEV_BROWSER_JWT_KEY) || '';
    // Next.js 12.1+ allows redirects only to absolute URLs
    const url = new URL(location);
    const urlWithDevBrowser = setDevBrowserJWTInURL(url, dbJwt);
    return NextResponse.redirect(urlWithDevBrowser.href, res);
  }
  return res;
};

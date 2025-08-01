import { clerkMiddleware, createRouteMatcher } from '@appypeeps/clerk-nextjs/server';

const csp = `default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' 'nonce-deadbeef';
  img-src 'self' https://img.clerk.com;
  worker-src 'self' blob:;
  style-src 'self' 'unsafe-inline';
  frame-src 'self' https://challenges.cloudflare.com;
`;

const isProtectedRoute = createRouteMatcher(['/protected(.*)', '/user(.*)', '/switcher(.*)']);
const isAdminRoute = createRouteMatcher(['/only-admin(.*)']);
const isCSPRoute = createRouteMatcher(['/csp']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  if (isAdminRoute(req)) {
    await auth.protect({ role: 'org:admin' });
  }

  if (isCSPRoute(req)) {
    req.headers.set('Content-Security-Policy', csp.replace(/\n/g, ''));
  }
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // Don't run middleware on static files
    '/', // Run middleware on index page
    '/(api|trpc)(.*)',
  ], // Run middleware on API routes
};

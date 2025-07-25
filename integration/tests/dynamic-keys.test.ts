import { expect, test } from '@playwright/test';

import type { Application } from '../models/application';
import { appConfigs } from '../presets';
import { createTestUtils } from '../testUtils';

test.describe('dynamic keys @nextjs', () => {
  test.describe.configure({ mode: 'serial' });
  let app: Application;

  test.beforeAll(async () => {
    app = await appConfigs.next.appRouter
      .clone()
      .addFile(
        'src/middleware.ts',
        () => `import { clerkClient, clerkMiddleware, createRouteMatcher } from '@appypeeps/clerk-nextjs/server';
        import { NextResponse } from 'next/server';

        const isProtectedRoute = createRouteMatcher(['/protected']);
        const shouldFetchBapi = createRouteMatcher(['/fetch-bapi-from-middleware']);

        export default clerkMiddleware(async (auth, request) => {
          if (isProtectedRoute(request)) {
            await auth.protect();
          }

          if (shouldFetchBapi(request)){
            const client = await clerkClient();

            const count = await client.users?.getCount();

            if (count){
              return NextResponse.redirect(new URL('/users-count', request.url));
            }
          }
        }, {
          secretKey: process.env.CLERK_DYNAMIC_SECRET_KEY,
          signInUrl: '/foobar'
        });

        export const config = {
          matcher: ['/((?!.*\\\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
        };`,
      )
      .addFile(
        'src/app/users-count/page.tsx',
        () => `import { clerkClient } from '@appypeeps/clerk-nextjs/server'

        export default async function Page(){
          const count = await clerkClient().users?.getCount() ?? 0;

          return <p>Users count: {count}</p>
        }
        `,
      )
      .commit();

    await app.setup();
    await app.withEnv(appConfigs.envs.withDynamicKeys);
    await app.dev();
  });

  test.afterAll(async () => {
    await app.teardown();
  });

  test('redirects to `signInUrl` on `await auth.protect()`', async ({ page, context }) => {
    const u = createTestUtils({ app, page, context });

    await u.page.goToAppHome();

    await u.po.expect.toBeSignedOut();

    await u.page.goToRelative('/protected');

    await u.page.waitForURL(/foobar/);
  });

  test('resolves auth signature with `secretKey` on `await auth.protect()`', async ({ page, context }) => {
    const u = createTestUtils({ app, page, context });
    await u.page.goToRelative('/page-protected');
    await u.page.waitForURL(/foobar/);
  });

  test('calls `clerkClient` with dynamic keys from application runtime', async ({ page, context }) => {
    const u = createTestUtils({ app, page, context });
    await u.page.goToRelative('/users-count');
    await expect(u.page.getByText(/Users count/i)).toBeVisible();
  });

  test('calls `clerkClient` with dynamic keys from middleware runtime', async ({ page, context }) => {
    const u = createTestUtils({ app, page, context });
    await u.page.goToRelative('/fetch-bapi-from-middleware');
    await u.page.waitForAppUrl('/users-count');
    await expect(u.page.getByText(/Users count/i)).toBeVisible();
  });
});

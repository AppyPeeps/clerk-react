import { defer, type DataFunctionArgs } from '@remix-run/node';
import type { MetaFunction } from '@remix-run/react';
import { Await, Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';
import { rootAuthLoader } from '@appypeeps/clerk-remix/ssr.server';
import { ClerkApp } from '@appypeeps/clerk-remix';
import { Suspense } from 'react';

export const loader = (args: DataFunctionArgs) => {
  return rootAuthLoader(
    args,
    ({ request }) => {
      const { user } = request;
      const data: Promise<{ foo: string }> = new Promise(r => r({ foo: 'bar' }))

      console.log('root User:', user);

      return defer({ user, data }, { headers: { 'x-clerk': '1' } })
    },
    { loadUser: true },
  );
};

export function headers({
  actionHeaders,
  loaderHeaders,
  parentHeaders,
}: {
  actionHeaders: Headers;
  loaderHeaders: Headers;
  parentHeaders: Headers;
}) {
  console.log(loaderHeaders)
  return loaderHeaders 
}

export const meta: MetaFunction = () => {
  return [
    {
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Remix',
        url: 'https://remix.run',
      },
    },
  ];
};

function App() {
  const loaderData = useLoaderData<typeof loader>();

  console.log('root: ', { loaderData });

  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Suspense fallback="Loading...">
          <Await resolve={loaderData.data}>
            {val => (<>Hello {val.foo}</>)}
          </Await>
        </Suspense>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default ClerkApp(App);

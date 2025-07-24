import { headers } from 'next/headers';
import { ClerkLoaded } from '@appypeeps/clerk-nextjs';

export default async function CSPPage() {
  const cspHeader = (await headers()).get('Content-Security-Policy');

  return (
    <div>
      CSP: <pre>{cspHeader}</pre>
      <ClerkLoaded>
        <p>clerk loaded</p>
      </ClerkLoaded>
    </div>
  );
}

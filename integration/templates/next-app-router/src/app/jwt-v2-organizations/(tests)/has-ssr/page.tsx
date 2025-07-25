import { ClerkProvider } from '@appypeeps/clerk-nextjs';
import { SSR } from './client';

export default function Page() {
  return (
    <ClerkProvider dynamic>
      <SSR />
    </ClerkProvider>
  );
}

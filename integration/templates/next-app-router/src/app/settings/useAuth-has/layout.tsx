import { ClerkProvider } from '@appypeeps/clerk-nextjs';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ClerkProvider dynamic>{children}</ClerkProvider>;
}

import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@appypeeps/clerk-nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          // Icon buttons only contain accessible labels when they use an icon; our generated letter icon does not have
          // an accessible label. Using the "blockButton" variant ensures that the button contains a visible label that
          // can be selected by a Playwright selector.
          socialButtonsVariant: 'blockButton',
        },
      }}
      experimental={{
        persistClient: process.env.NEXT_PUBLIC_EXPERIMENTAL_PERSIST_CLIENT
          ? process.env.NEXT_PUBLIC_EXPERIMENTAL_PERSIST_CLIENT === 'true'
          : undefined,
      }}
    >
      <html lang='en'>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}

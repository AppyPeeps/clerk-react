'use client';
import { SignedIn, SignedOut } from '@appypeeps/clerk-nextjs';

export default function Page() {
  return (
    <div>
      {/* @ts-ignore */}
      <SignedIn>Hello In</SignedIn>
      {/* @ts-ignore */}
      <SignedOut>Hello Out</SignedOut>
    </div>
  );
}

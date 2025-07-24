import type { Clerk } from '@appypeeps/clerk-types';

declare global {
  interface Window {
    Clerk: Clerk;
  }
}

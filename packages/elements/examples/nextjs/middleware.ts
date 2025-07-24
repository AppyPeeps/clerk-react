import { clerkMiddleware } from '@appypeeps/clerk-nextjs/server';
export default clerkMiddleware;

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

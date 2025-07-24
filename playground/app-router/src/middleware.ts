import { clerkMiddleware } from '@appypeeps/clerk-nextjs/server';


export default clerkMiddleware()

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

import { auth } from '@appypeeps/clerk-nextjs/server';

export async function GET() {
  const { userId } = await auth.protect((has: any) => has({ role: 'org:admin' }) || has({ role: 'org:editor' }));
  return new Response(JSON.stringify({ userId }));
}

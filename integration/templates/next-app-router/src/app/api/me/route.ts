import { auth } from '@appypeeps/clerk-nextjs/server';

export async function GET() {
  const { userId } = await auth();
  return new Response(JSON.stringify({ userId }));
}

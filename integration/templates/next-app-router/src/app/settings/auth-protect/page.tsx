import { auth } from '@appypeeps/clerk-nextjs/server';

export default async function Page() {
  await auth.protect({ role: 'org:admin' });
  return <p>User has access</p>;
}

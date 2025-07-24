import { UserProfile } from '@appypeeps/clerk-react';

export default function Page() {
  return (
    <div>
      <UserProfile
        path={'/user'}
        fallback={<>Loading user profile</>}
      />
    </div>
  );
}

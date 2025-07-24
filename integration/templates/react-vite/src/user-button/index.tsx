import { UserButton } from '@appypeeps/clerk-react';

export default function Page() {
  return (
    <div>
      <UserButton fallback={<>Loading user button</>} />
    </div>
  );
}

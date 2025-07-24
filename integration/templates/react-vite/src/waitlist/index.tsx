import { Waitlist } from '@appypeeps/clerk-react';

export default function Page() {
  return (
    <div>
      <Waitlist fallback={<>Loading waitlist</>} />
    </div>
  );
}

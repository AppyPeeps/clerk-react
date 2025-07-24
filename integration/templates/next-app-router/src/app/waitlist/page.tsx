import { Waitlist } from '@appypeeps/clerk-nextjs';

export default function Page() {
  return (
    <div>
      <Waitlist fallback={<>Loading waitlist</>} />
    </div>
  );
}

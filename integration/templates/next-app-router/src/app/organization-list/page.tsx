import { OrganizationList } from '@appypeeps/clerk-nextjs';

export default function Page() {
  return (
    <div>
      <OrganizationList fallback={<>Loading organization list</>} />
    </div>
  );
}

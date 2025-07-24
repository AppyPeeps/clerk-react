import { OrganizationList } from '@appypeeps/clerk-react';

export default function Page() {
  return (
    <div>
      <OrganizationList fallback={<>Loading organization list</>} />
    </div>
  );
}

import { CreateOrganization } from '@appypeeps/clerk-react';

export default function Page() {
  return (
    <div>
      <CreateOrganization fallback={<>Loading create organization</>} />
    </div>
  );
}

import { OrganizationProfile } from '@appypeeps/clerk-react';

export default function Page() {
  return (
    <div>
      <OrganizationProfile
        routing='hash'
        fallback={<>Loading organization profile</>}
      />
    </div>
  );
}

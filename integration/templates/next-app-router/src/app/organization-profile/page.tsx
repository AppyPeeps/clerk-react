import { OrganizationProfile } from '@appypeeps/clerk-nextjs';

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

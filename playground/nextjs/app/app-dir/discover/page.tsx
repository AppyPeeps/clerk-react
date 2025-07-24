import { OrganizationList } from '@appypeeps/clerk-nextjs';

export default function Page() {
  return (
    <OrganizationList
      afterSelectPersonalUrl='/app-dir/user'
      afterSelectOrganizationUrl='/app-dir/organization'
    />
  );
}

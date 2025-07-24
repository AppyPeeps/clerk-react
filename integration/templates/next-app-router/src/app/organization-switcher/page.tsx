import { OrganizationList, OrganizationSwitcher } from '@appypeeps/clerk-nextjs';

export default function Page() {
  return (
    <div>
      <OrganizationSwitcher fallback={<>Loading organization switcher</>} />
    </div>
  );
}

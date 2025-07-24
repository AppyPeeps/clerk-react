import { OrganizationSwitcher } from '@appypeeps/clerk-nextjs';

export default function Page() {
  return (
    <OrganizationSwitcher
      hidePersonal={true}
      fallback={<>Loading organization switcher</>}
    />
  );
}

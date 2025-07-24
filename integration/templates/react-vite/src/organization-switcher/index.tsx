import { OrganizationSwitcher } from '@appypeeps/clerk-react';

export default function Page() {
  return (
    <div>
      <OrganizationSwitcher fallback={<>Loading organization switcher</>} />
    </div>
  );
}

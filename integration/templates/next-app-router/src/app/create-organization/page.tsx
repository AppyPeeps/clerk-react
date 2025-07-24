import { CreateOrganization } from '@appypeeps/clerk-nextjs';

export default function Page() {
  return (
    <div>
      <CreateOrganization fallback={<>Loading create organization</>} />
    </div>
  );
}

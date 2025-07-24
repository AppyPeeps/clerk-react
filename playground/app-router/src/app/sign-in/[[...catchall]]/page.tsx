import { SignIn } from '@appypeeps/clerk-nextjs';

export default function Page() {
  return (
    <div>
      here?
      <SignIn
        routing={'path'}
        path={'/sign-in'}
        signUpUrl={'/sign-up'}
      />
    </div>
  );
}

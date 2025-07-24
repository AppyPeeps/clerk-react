import { SignUp } from '@appypeeps/clerk-nextjs';

export default function Page() {
  return (
    <SignUp
      path='/app-dir/sign-up'
      signInUrl='/app-dir/sign-in'
      redirectUrl='/app-dir'
    />
  );
}

import type {
  SignInButtonProps as _SignInButtonProps,
  SignUpButtonProps as _SignUpButtonProps,
} from '@appypeeps/clerk-types';

export type SignInButtonProps = _SignInButtonProps & {
  children?: React.ReactNode;
};

export type SignUpButtonProps = _SignUpButtonProps & {
  children?: React.ReactNode;
};

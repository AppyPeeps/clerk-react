import { parseError } from '@appypeeps/clerk-shared/error';
import type { SignInResource } from '@appypeeps/clerk-types';
import { describe, it, jest } from '@jest/globals';
import { waitFor } from '@testing-library/dom';

import { ClerkAPIResponseError } from '../../../../core/resources';
import { act, mockWebAuthn, render, screen } from '../../../../testUtils';
import { bindCreateFixtures } from '../../../utils/test/createFixtures';
import { runFakeTimers } from '../../../utils/test/runFakeTimers';
import { SignInFactorOne } from '../SignInFactorOne';

const { createFixtures } = bindCreateFixtures('SignIn');

describe('SignInFactorOne', () => {
  it('renders the component', async () => {
    const { wrapper, fixtures } = await createFixtures(f => {
      f.withEmailAddress();
      f.withPassword();
      f.withPreferredSignInStrategy({ strategy: 'otp' });
      f.startSignInWithEmailAddress({ supportEmailCode: true });
    });
    fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
    render(<SignInFactorOne />, { wrapper });
    screen.getByText('Check your email');
  });

  it('prefills the email if the identifier is an email', async () => {
    const { wrapper } = await createFixtures(f => {
      f.withEmailAddress({ first_factors: ['email_code', 'email_link'] });
      f.withPassword();
      f.startSignInWithEmailAddress({ supportEmailCode: true, supportEmailLink: true, identifier: 'test@clerk.com' });
    });

    render(<SignInFactorOne />, { wrapper });
    screen.getByText('test@clerk.com');
  });

  it('prefills the phone number if the identifier is a phone number', async () => {
    const { wrapper } = await createFixtures(f => {
      f.withPhoneNumber();
      f.withPassword();
      f.startSignInWithPhoneNumber({ identifier: '+301234567890' });
    });

    render(<SignInFactorOne />, { wrapper });
    screen.getByText('+30 123 4567890');
  });

  describe('Navigation', () => {
    it('navigates to SignInStart component when user clicks the edit icon', async () => {
      const { wrapper, fixtures } = await createFixtures(f => {
        f.withEmailAddress();
        f.withPassword();
        f.withPreferredSignInStrategy({ strategy: 'otp' });
        f.startSignInWithEmailAddress({ supportEmailCode: true });
      });
      fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
      const { container, userEvent } = render(<SignInFactorOne />, { wrapper });
      container.getElementsByClassName('cl-identityPreviewEditButton');
      const editButton = container.getElementsByClassName('cl-identityPreviewEditButton').item(0);
      expect(editButton).toBeDefined();
      if (editButton) {
        await userEvent.click(editButton);
      }
      expect(fixtures.router.navigate).toHaveBeenCalledWith('../');
    });

    it('navigates to SignInStart component if the user lands on SignInFactorOne directly without calling signIn.create', async () => {
      const { wrapper, fixtures } = await createFixtures();
      render(<SignInFactorOne />, { wrapper });
      expect(fixtures.router.navigate).toHaveBeenCalledWith('../');
    });
  });

  describe('Submitting', () => {
    it('navigates to SignInFactorTwo page when user submits first factor and second factor is enabled', async () => {
      const { wrapper, fixtures } = await createFixtures(f => {
        f.withPhoneNumber();
        f.withPreferredSignInStrategy({ strategy: 'otp' });
        f.startSignInWithPhoneNumber({ supportPhoneCode: true, supportPassword: false });
      });
      fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
      fixtures.signIn.attemptFirstFactor.mockReturnValueOnce(
        Promise.resolve({ status: 'needs_second_factor' } as SignInResource),
      );
      await runFakeTimers(async timers => {
        const { userEvent } = render(<SignInFactorOne />, { wrapper });

        await userEvent.type(screen.getByLabelText(/Enter verification code/i), '123456');
        timers.runOnlyPendingTimers();
        await waitFor(() => expect(fixtures.router.navigate).toHaveBeenCalledWith('../factor-two'));
      });
    });

    it('sets an active session when user submits first factor successfully and second factor does not exist', async () => {
      const { wrapper, fixtures } = await createFixtures(f => {
        f.withPhoneNumber();
        f.withPreferredSignInStrategy({ strategy: 'otp' });
        f.startSignInWithPhoneNumber({ supportPhoneCode: true, supportPassword: false });
      });
      fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
      fixtures.signIn.attemptFirstFactor.mockReturnValueOnce(Promise.resolve({ status: 'complete' } as SignInResource));
      await runFakeTimers(async timers => {
        const { userEvent } = render(<SignInFactorOne />, { wrapper });

        await userEvent.type(screen.getByLabelText(/Enter verification code/i), '123456');
        timers.runOnlyPendingTimers();
        await waitFor(() => {
          expect(fixtures.clerk.setActive).toHaveBeenCalled();
        });
      });
    });
  });

  describe('Selected First Factor Method', () => {
    describe('Password', () => {
      it('shows an input to fill with password', async () => {
        const { wrapper } = await createFixtures(f => {
          f.withEmailAddress();
          f.withPassword();
          f.withPreferredSignInStrategy({ strategy: 'password' });
          f.startSignInWithEmailAddress({ supportEmailCode: true, supportPassword: true });
        });
        render(<SignInFactorOne />, { wrapper });
        screen.getByText('Password');
      });

      it('should render the other methods component when clicking on "Forgot password"', async () => {
        const email = 'test@clerk.com';
        const { wrapper } = await createFixtures(f => {
          f.withEmailAddress();
          f.withPassword();
          f.withPreferredSignInStrategy({ strategy: 'password' });
          f.startSignInWithEmailAddress({
            supportEmailCode: true,
            supportPassword: true,
            supportResetPassword: false,
            identifier: email,
          });
        });
        const { userEvent } = render(<SignInFactorOne />, { wrapper });
        await userEvent.click(screen.getByText(/Forgot password/i));
        screen.getByText('Use another method');
        expect(screen.queryByText('Or, sign in with another method')).not.toBeInTheDocument();
        screen.getByText(`Email code to ${email}`);
        expect(screen.queryByText('Sign in with your password')).not.toBeInTheDocument();
      });

      it('should render the Forgot Password alternative methods component when clicking on "Forgot password" (email)', async () => {
        const { wrapper, fixtures } = await createFixtures(f => {
          f.withEmailAddress();
          f.withPassword();
          f.withPreferredSignInStrategy({ strategy: 'password' });
          f.startSignInWithEmailAddress({
            supportEmailCode: true,
            supportPassword: true,
            supportResetPassword: true,
          });
        });
        const { userEvent } = render(<SignInFactorOne />, { wrapper });

        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
        await userEvent.click(screen.getByText(/Forgot password/i));
        screen.getByText('Forgot Password?');
        screen.getByText('Or, sign in with another method');
        await userEvent.click(screen.getByText('Reset your password'));
        screen.getByText('First, enter the code sent to your email address');
      });

      it('shows a UI error when submission fails', async () => {
        const { wrapper, fixtures } = await createFixtures(f => {
          f.withEmailAddress();
          f.withPassword();
          f.withPreferredSignInStrategy({ strategy: 'password' });
          f.startSignInWithPhoneNumber({ supportPassword: true });
        });
        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
        fixtures.signIn.attemptFirstFactor.mockRejectedValueOnce(
          new ClerkAPIResponseError('Error', {
            data: [
              {
                code: 'form_code_incorrect',
                long_message: 'Incorrect Password',
                message: 'is incorrect',
                meta: { param_name: 'password' },
              },
            ],
            status: 422,
          }),
        );
        await runFakeTimers(async () => {
          const { userEvent } = render(<SignInFactorOne />, { wrapper });
          await userEvent.type(screen.getByLabelText('Password'), '123456');
          await userEvent.click(screen.getByText('Continue'));
          await waitFor(() => expect(screen.getByText('Incorrect Password')).toBeDefined());
        });
      });

      it('redirects back to sign-in if the user is locked', async () => {
        const { wrapper, fixtures } = await createFixtures(f => {
          f.withEmailAddress();
          f.withPassword();
          f.withPreferredSignInStrategy({ strategy: 'password' });
          f.startSignInWithPhoneNumber({ supportPassword: true });
        });
        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));

        const errJSON = {
          code: 'user_locked',
          long_message: 'Your account is locked. Please try again after 1 hour.',
          message: 'Account locked',
          meta: { duration_in_seconds: 3600 },
        };

        fixtures.signIn.attemptFirstFactor.mockRejectedValueOnce(
          new ClerkAPIResponseError('Error', {
            data: [errJSON],
            status: 422,
          }),
        );
        await runFakeTimers(async () => {
          const { userEvent } = render(<SignInFactorOne />, { wrapper });
          await userEvent.type(screen.getByLabelText('Password'), '123456');
          await userEvent.click(screen.getByText('Continue'));
          await waitFor(() => {
            expect(fixtures.clerk.__internal_navigateWithError).toHaveBeenCalledWith('..', parseError(errJSON));
          });
        });
      });

      it('Prompts the user to reset their password via email if it has been pwned', async () => {
        const { wrapper, fixtures } = await createFixtures(f => {
          f.withEmailAddress();
          f.withPassword();
          f.withPreferredSignInStrategy({ strategy: 'password' });
          f.startSignInWithEmailAddress({
            supportPassword: true,
            supportEmailCode: true,
            supportResetPassword: true,
          });
        });
        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));

        const errJSON = {
          code: 'form_password_pwned',
          long_message:
            'Password has been found in an online data breach. For account safety, please reset your password.',
          message: 'Password has been found in an online data breach. For account safety, please reset your password.',
          meta: { param_name: 'password' },
        };

        fixtures.signIn.attemptFirstFactor.mockRejectedValueOnce(
          new ClerkAPIResponseError('Error', {
            data: [errJSON],
            status: 422,
          }),
        );

        await runFakeTimers(async () => {
          const { userEvent } = render(<SignInFactorOne />, { wrapper });
          await userEvent.type(screen.getByLabelText('Password'), '123456');
          await userEvent.click(screen.getByText('Continue'));

          await waitFor(() => {
            screen.getByText('Password compromised');
            screen.getByText(
              'This password has been found as part of a breach and can not be used, please reset your password.',
            );
            screen.getByText('Or, sign in with another method');
          });

          await userEvent.click(screen.getByText('Reset your password'));
          screen.getByText('First, enter the code sent to your email address');
        });
      });

      it('Prompts the user to reset their password via phone if it has been pwned', async () => {
        const { wrapper, fixtures } = await createFixtures(f => {
          f.withEmailAddress();
          f.withPassword();
          f.withPreferredSignInStrategy({ strategy: 'password' });
          f.startSignInWithPhoneNumber({
            supportPassword: true,
            supportPhoneCode: true,
            supportResetPassword: true,
          });
        });
        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));

        const errJSON = {
          code: 'form_password_pwned',
          long_message:
            'Password has been found in an online data breach. For account safety, please reset your password.',
          message: 'Password has been found in an online data breach. For account safety, please reset your password.',
          meta: { param_name: 'password' },
        };

        fixtures.signIn.attemptFirstFactor.mockRejectedValueOnce(
          new ClerkAPIResponseError('Error', {
            data: [errJSON],
            status: 422,
          }),
        );

        await runFakeTimers(async () => {
          const { userEvent } = render(<SignInFactorOne />, { wrapper });
          await userEvent.type(screen.getByLabelText('Password'), '123456');
          await userEvent.click(screen.getByText('Continue'));

          await waitFor(() => {
            screen.getByText('Password compromised');
            screen.getByText(
              'This password has been found as part of a breach and can not be used, please reset your password.',
            );
            screen.getByText('Or, sign in with another method');
          });

          await userEvent.click(screen.getByText('Reset your password'));
          screen.getByText('First, enter the code sent to your phone');
        });
      });

      it('entering a pwned password, then going back and clicking forgot password should result in the correct title', async () => {
        const { wrapper, fixtures } = await createFixtures(f => {
          f.withEmailAddress();
          f.withPassword();
          f.withPreferredSignInStrategy({ strategy: 'password' });
          f.startSignInWithEmailAddress({
            supportPassword: true,
            supportEmailCode: true,
            supportResetPassword: true,
          });
        });
        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));

        const errJSON = {
          code: 'form_password_pwned',
          long_message:
            'Password has been found in an online data breach. For account safety, please reset your password.',
          message: 'Password has been found in an online data breach. For account safety, please reset your password.',
          meta: { param_name: 'password' },
        };

        fixtures.signIn.attemptFirstFactor.mockRejectedValueOnce(
          new ClerkAPIResponseError('Error', {
            data: [errJSON],
            status: 422,
          }),
        );

        await runFakeTimers(async () => {
          const { userEvent } = render(<SignInFactorOne />, { wrapper });
          await userEvent.type(screen.getByLabelText('Password'), '123456');
          await userEvent.click(screen.getByText('Continue'));

          await waitFor(() => {
            screen.getByText('Password compromised');
            screen.getByText(
              'This password has been found as part of a breach and can not be used, please reset your password.',
            );
            screen.getByText('Or, sign in with another method');
          });

          // Go back
          await userEvent.click(screen.getByText('Back'));

          // Choose to reset password via "Forgot password" instead
          await userEvent.click(screen.getByText(/Forgot password/i));
          screen.getByText('Forgot Password?');
          expect(
            screen.queryByText(
              'This password has been found as part of a breach and can not be used, please reset your password.',
            ),
          ).not.toBeInTheDocument();
        });
      });
    });

    describe('Forgot Password', () => {
      it('shows an input to add the code sent to phone', async () => {
        const { wrapper, fixtures } = await createFixtures(f => {
          f.withEmailAddress();
          f.withPassword();
          f.withPreferredSignInStrategy({ strategy: 'password' });
          f.startSignInWithPhoneNumber({
            supportPassword: true,
            supportResetPassword: true,
          });
        });
        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
        const { userEvent } = render(<SignInFactorOne />, { wrapper });
        await userEvent.click(screen.getByText(/Forgot password/i));
        screen.getByText('Forgot Password?');

        await userEvent.click(screen.getByText('Reset your password'));
        screen.getByText('First, enter the code sent to your phone');
      });

      it('redirects to `reset-password` on successful code verification', async () => {
        const { wrapper, fixtures } = await createFixtures(f => {
          f.withEmailAddress();
          f.withPassword();
          f.withPreferredSignInStrategy({ strategy: 'password' });
          f.startSignInWithEmailAddress({
            supportEmailCode: true,
            supportPassword: true,
            supportResetPassword: true,
          });
        });
        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
        fixtures.signIn.attemptFirstFactor.mockReturnValueOnce(
          Promise.resolve({ status: 'needs_new_password' } as SignInResource),
        );
        const { userEvent } = render(<SignInFactorOne />, { wrapper });
        await userEvent.click(screen.getByText(/Forgot password/i));
        await userEvent.click(screen.getByText('Reset your password'));
        await userEvent.type(screen.getByLabelText(/Enter verification code/i), '123456');
        expect(fixtures.signIn.attemptFirstFactor).toHaveBeenCalledWith({
          strategy: 'reset_password_email_code',
          code: '123456',
        });
        await waitFor(() => {
          expect(fixtures.router.navigate).toHaveBeenCalledWith('../reset-password');
        });
      });

      it('redirects to `reset-password` on successful code verification received in phone number', async () => {
        const { wrapper, fixtures } = await createFixtures(f => {
          f.withEmailAddress();
          f.withPassword();
          f.withPreferredSignInStrategy({ strategy: 'password' });
          f.startSignInWithPhoneNumber({
            supportPassword: true,
            supportResetPassword: true,
          });
        });
        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
        fixtures.signIn.attemptFirstFactor.mockReturnValueOnce(
          Promise.resolve({ status: 'needs_new_password' } as SignInResource),
        );
        const { userEvent } = render(<SignInFactorOne />, { wrapper });
        await userEvent.click(screen.getByText(/Forgot password/i));
        await userEvent.click(screen.getByText('Reset your password'));
        await userEvent.type(screen.getByLabelText(/Enter verification code/i), '123456');
        expect(fixtures.signIn.attemptFirstFactor).toHaveBeenCalledWith({
          strategy: 'reset_password_phone_code',
          code: '123456',
        });
        await waitFor(() => {
          expect(fixtures.router.navigate).toHaveBeenCalledWith('../reset-password');
        });
      });
    });

    describe('Verification link', () => {
      it('shows message to use the magic link in their email', async () => {
        const { wrapper, fixtures } = await createFixtures(f => {
          f.withEmailAddress();
          f.withEmailLink();
          f.startSignInWithEmailAddress({ supportEmailLink: true, supportPassword: false });
        });

        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
        fixtures.signIn.createEmailLinkFlow.mockImplementation(
          () =>
            ({
              startEmailLinkFlow: jest.fn(() => new Promise(() => ({}))),
              cancelEmailLinkFlow: jest.fn(() => new Promise(() => ({}))),
            }) as any,
        );

        render(<SignInFactorOne />, { wrapper });
        screen.getByText('Use the verification link sent to your email');
      });

      it('enables the "Resend link" button after 60 seconds', async () => {
        jest.useFakeTimers();

        const { wrapper, fixtures } = await createFixtures(f => {
          f.withEmailAddress();
          f.withEmailLink();
          f.startSignInWithEmailAddress({ supportEmailLink: true, supportPassword: false });
        });

        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
        fixtures.signIn.createEmailLinkFlow.mockImplementation(
          () =>
            ({
              startEmailLinkFlow: jest.fn(() => new Promise(() => ({}))),
              cancelEmailLinkFlow: jest.fn(() => new Promise(() => ({}))),
            }) as any,
        );

        const { getByText } = render(<SignInFactorOne />, { wrapper });
        expect(getByText(/Resend/, { exact: false }).closest('button')).toHaveAttribute('disabled');
        await act(() => {
          jest.advanceTimersByTime(30000);
        });
        expect(getByText(/Resend/, { exact: false }).closest('button')).toHaveAttribute('disabled');
        await act(() => {
          jest.advanceTimersByTime(30000);
        });
        expect(getByText(/Resend/, { exact: false }).closest('button')).not.toHaveAttribute('disabled');

        jest.useRealTimers();
      });
    });

    describe('Email Code', () => {
      it('shows an input to add the code sent to email', async () => {
        const { wrapper, fixtures } = await createFixtures(f => {
          f.withEmailAddress();
          f.withPassword();
          f.withPreferredSignInStrategy({ strategy: 'otp' });
          f.startSignInWithEmailAddress({ supportEmailCode: true });
        });
        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
        render(<SignInFactorOne />, { wrapper });
        screen.getByText('Check your email');
      });

      it('enables the "Resend code" button after 30 seconds', async () => {
        jest.useFakeTimers();

        const { wrapper, fixtures } = await createFixtures(f => {
          f.withEmailAddress();
          f.withPassword();
          f.withPreferredSignInStrategy({ strategy: 'otp' });
          f.startSignInWithEmailAddress({ supportEmailCode: true });
        });

        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
        const { getByText } = render(<SignInFactorOne />, { wrapper });
        expect(getByText(/Resend/, { exact: false }).closest('button')).toHaveAttribute('disabled');
        await act(() => {
          jest.advanceTimersByTime(15000);
        });
        expect(getByText(/Resend/, { exact: false }).closest('button')).toHaveAttribute('disabled');
        await act(() => {
          jest.advanceTimersByTime(15000);
        });
        expect(getByText(/Resend/, { exact: false }).closest('button')).not.toHaveAttribute('disabled');

        jest.useRealTimers();
      });

      it('auto submits when typing all the 6 digits of the code', async () => {
        const { wrapper, fixtures } = await createFixtures(f => {
          f.withEmailAddress();
          f.withPreferredSignInStrategy({ strategy: 'otp' });
          f.startSignInWithPhoneNumber({ supportPhoneCode: true, supportPassword: false });
        });
        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
        fixtures.signIn.attemptFirstFactor.mockReturnValueOnce(
          Promise.resolve({ status: 'complete' } as SignInResource),
        );
        const { userEvent } = render(<SignInFactorOne />, { wrapper });
        await userEvent.type(screen.getByLabelText(/Enter verification code/i), '123456');
        expect(fixtures.signIn.attemptFirstFactor).toHaveBeenCalled();
      });

      it('shows a UI error when submission fails', async () => {
        const { wrapper, fixtures } = await createFixtures(f => {
          f.withEmailAddress();
          f.withPreferredSignInStrategy({ strategy: 'otp' });
          f.startSignInWithPhoneNumber({ supportPhoneCode: true, supportPassword: false });
        });
        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
        fixtures.signIn.attemptFirstFactor.mockRejectedValueOnce(
          new ClerkAPIResponseError('Error', {
            data: [
              {
                code: 'form_code_incorrect',
                long_message: 'Incorrect code',
                message: 'is incorrect',
                meta: { param_name: 'code' },
              },
            ],
            status: 422,
          }),
        );
        await runFakeTimers(async () => {
          const { userEvent } = render(<SignInFactorOne />, { wrapper });
          await userEvent.type(screen.getByLabelText(/Enter verification code/i), '123456');
          await waitFor(() => expect(screen.getByText('Incorrect code')).toBeDefined());
        });
      });

      it('redirects back to sign-in if the user is locked', async () => {
        const { wrapper, fixtures } = await createFixtures(f => {
          f.withEmailAddress();
          f.withPreferredSignInStrategy({ strategy: 'otp' });
          f.startSignInWithPhoneNumber({ supportPhoneCode: true, supportPassword: false });
        });
        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));

        const errJSON = {
          code: 'user_locked',
          long_message: 'Your account is locked. Please try again after 2 hours.',
          message: 'Account locked',
          meta: { duration_in_seconds: 7200 },
        };

        fixtures.signIn.attemptFirstFactor.mockRejectedValueOnce(
          new ClerkAPIResponseError('Error', {
            data: [errJSON],
            status: 422,
          }),
        );

        await runFakeTimers(async () => {
          const { userEvent } = render(<SignInFactorOne />, { wrapper });
          await userEvent.type(screen.getByLabelText(/Enter verification code/i), '123456');
          expect(fixtures.clerk.__internal_navigateWithError).toHaveBeenCalledWith('..', parseError(errJSON));
        });
      });
    });

    describe('Phone Code', () => {
      it('shows an input to add the code sent to phone', async () => {
        const { wrapper, fixtures } = await createFixtures(f => {
          f.withPhoneNumber();
          f.withPreferredSignInStrategy({ strategy: 'otp' });
          f.startSignInWithPhoneNumber({ supportPhoneCode: true, supportPassword: false });
        });
        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
        render(<SignInFactorOne />, { wrapper });
        screen.getByText('Check your phone');
        screen.getByText('to continue to TestApp');
      });

      it('enables the "Resend" button after 30 seconds', async () => {
        jest.useFakeTimers();

        const { wrapper, fixtures } = await createFixtures(f => {
          f.withPhoneNumber();
          f.withPreferredSignInStrategy({ strategy: 'otp' });
          f.startSignInWithPhoneNumber({ supportPhoneCode: true, supportPassword: false });
        });

        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
        const { getByText } = render(<SignInFactorOne />, { wrapper });
        expect(getByText(/Resend/, { exact: false }).closest('button')).toHaveAttribute('disabled');
        await act(() => {
          jest.advanceTimersByTime(15000);
        });
        expect(getByText(/Resend/, { exact: false }).closest('button')).toHaveAttribute('disabled');
        await act(() => {
          jest.advanceTimersByTime(15000);
        });
        expect(getByText(/Resend/, { exact: false }).closest('button')).not.toHaveAttribute('disabled');

        jest.useRealTimers();
      });

      it('auto submits when typing all the 6 digits of the code', async () => {
        const { wrapper, fixtures } = await createFixtures(f => {
          f.withPhoneNumber();
          f.withPreferredSignInStrategy({ strategy: 'otp' });
          f.startSignInWithPhoneNumber({ supportPhoneCode: true, supportPassword: false });
        });
        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
        fixtures.signIn.attemptFirstFactor.mockReturnValueOnce(
          Promise.resolve({ status: 'complete' } as SignInResource),
        );
        const { userEvent } = render(<SignInFactorOne />, { wrapper });
        await userEvent.type(screen.getByLabelText(/Enter verification code/i), '123456');
        expect(fixtures.signIn.attemptFirstFactor).toHaveBeenCalled();
      });

      it('shows a UI error when submission fails', async () => {
        const { wrapper, fixtures } = await createFixtures(f => {
          f.withPhoneNumber();
          f.withPreferredSignInStrategy({ strategy: 'otp' });
          f.startSignInWithPhoneNumber({ supportPhoneCode: true, supportPassword: false });
        });
        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
        fixtures.signIn.attemptFirstFactor.mockRejectedValueOnce(
          new ClerkAPIResponseError('Error', {
            data: [
              {
                code: 'form_code_incorrect',
                long_message: 'Incorrect phone code',
                message: 'is incorrect',
                meta: { param_name: 'code' },
              },
            ],
            status: 422,
          }),
        );
        await runFakeTimers(async () => {
          const { userEvent } = render(<SignInFactorOne />, { wrapper });
          await userEvent.type(screen.getByLabelText(/Enter verification code/i), '123456');
          await waitFor(() => expect(screen.getByText('Incorrect phone code')).toBeDefined());
        });
      });

      it('redirects back to sign-in if the user is locked', async () => {
        const { wrapper, fixtures } = await createFixtures(f => {
          f.withPhoneNumber();
          f.withPreferredSignInStrategy({ strategy: 'otp' });
          f.startSignInWithPhoneNumber({ supportPhoneCode: true, supportPassword: false });
        });
        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));

        const errJSON = {
          code: 'user_locked',
          long_message: 'Your account is locked. Please contact support for more information.',
          message: 'Account locked',
        };

        fixtures.signIn.attemptFirstFactor.mockRejectedValueOnce(
          new ClerkAPIResponseError('Error', {
            data: [errJSON],
            status: 422,
          }),
        );

        await runFakeTimers(async () => {
          const { userEvent } = render(<SignInFactorOne />, { wrapper });
          await userEvent.type(screen.getByLabelText(/Enter verification code/i), '123456');
          await waitFor(() => {
            expect(fixtures.clerk.__internal_navigateWithError).toHaveBeenCalledWith('..', parseError(errJSON));
          });
        });
      });
    });

    describe('Passkey', () => {
      it('shows the next available factor because webauthn is not supported', async () => {
        const { wrapper, fixtures } = await createFixtures(f => {
          f.withEmailAddress();
          f.withPassword();
          f.withPasskey();
          f.withPreferredSignInStrategy({ strategy: 'otp' });
          f.startSignInWithEmailAddress({ supportPasskey: true, supportEmailCode: true });
        });
        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
        render(<SignInFactorOne />, { wrapper });
        screen.getByText('Check your email');
      });

      mockWebAuthn(() => {
        it('shows a passkey factor one screen', async () => {
          const { wrapper } = await createFixtures(f => {
            f.withEmailAddress();
            f.withPassword();
            f.withPasskey();
            f.withPreferredSignInStrategy({ strategy: 'otp' });
            f.startSignInWithEmailAddress({ supportPasskey: true, supportEmailCode: true });
          });
          render(<SignInFactorOne />, { wrapper });
          screen.getByText('Use your passkey');
          screen.getByText(
            "Using your passkey confirms it's you. Your device may ask for your fingerprint, face or screen lock.",
          );
          screen.getByText('hello@clerk.com');
        });

        it('call appropriate method from passkey factor one screen', async () => {
          const { wrapper, fixtures } = await createFixtures(f => {
            f.withEmailAddress();
            f.withPassword();
            f.withPasskey();
            f.withPreferredSignInStrategy({ strategy: 'otp' });
            f.startSignInWithEmailAddress({ supportPasskey: true, supportEmailCode: true });
          });
          fixtures.signIn.authenticateWithPasskey.mockResolvedValue({
            status: 'complete',
          } as SignInResource);
          const { userEvent } = render(<SignInFactorOne />, { wrapper });

          await userEvent.click(screen.getByText('Continue'));

          await waitFor(() => {
            expect(fixtures.signIn.authenticateWithPasskey).toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('Use another method', () => {
    it('should render the other authentication methods list component when clicking on "Use another method"', async () => {
      const email = 'test@clerk.com';
      const { wrapper } = await createFixtures(f => {
        f.withEmailAddress({ first_factors: ['email_code', 'email_link'] });
        f.withPassword();
        f.startSignInWithEmailAddress({ supportEmailCode: true, supportEmailLink: true, identifier: email });
      });

      const { userEvent } = render(<SignInFactorOne />, { wrapper });
      await userEvent.click(screen.getByText('Use another method'));
      screen.getByText(`Email code to ${email}`);
      screen.getByText(`Email link to ${email}`);
      expect(screen.queryByText(`Sign in with your password`)).not.toBeInTheDocument();
    });

    it('"Use another method" should not exist if only the current strategy is available', async () => {
      const email = 'test@clerk.com';
      const { wrapper } = await createFixtures(f => {
        f.withEmailAddress({ first_factors: [], verifications: [] });
        f.withPassword();
        f.startSignInWithEmailAddress({
          supportEmailCode: false,
          supportEmailLink: false,
          identifier: email,
          supportPassword: true,
        });
      });

      render(<SignInFactorOne />, { wrapper });
      expect(screen.queryByText(`Use another method`)).not.toBeInTheDocument();
      screen.getByText(`Get help`);
    });

    it('should go back to the main screen when clicking the "<- Back" button from the "Use another method" page', async () => {
      const { wrapper } = await createFixtures(f => {
        f.withEmailAddress();
        f.withPassword();
        f.withPreferredSignInStrategy({ strategy: 'password' });
        f.startSignInWithEmailAddress({ supportEmailCode: true });
      });

      const { userEvent } = render(<SignInFactorOne />, { wrapper });
      await userEvent.click(screen.getByText('Use another method'));
      await userEvent.click(screen.getByText('Back'));
      screen.getByText('Enter your password');
    });

    it('should list all the enabled first factor methods', async () => {
      const email = 'test@clerk.com';
      const { wrapper, fixtures } = await createFixtures(f => {
        f.withEmailAddress();
        f.withPassword();
        f.withPreferredSignInStrategy({ strategy: 'otp' });
        f.startSignInWithEmailAddress({ supportEmailCode: true, identifier: email });
      });
      fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
      const { userEvent } = render(<SignInFactorOne />, { wrapper });
      await userEvent.click(screen.getByText('Use another method'));
      screen.getByText(`Sign in with your password`);
      const deactivatedMethod = screen.queryByText(`Send link to ${email}`);
      expect(deactivatedMethod).not.toBeInTheDocument();
    });

    it('should skip passkey alternative method when webauthn is not supported', async () => {
      const email = 'test@clerk.com';
      const { wrapper, fixtures } = await createFixtures(f => {
        f.withEmailAddress();
        f.withPassword();
        f.withPasskey();
        f.withPreferredSignInStrategy({ strategy: 'otp' });
        f.startSignInWithEmailAddress({ supportPasskey: true, supportEmailCode: true, identifier: email });
      });
      fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
      const { userEvent } = render(<SignInFactorOne />, { wrapper });
      await userEvent.click(screen.getByText('Use another method'));
      await userEvent.click(screen.getByText('Sign in with your password'));
      await userEvent.click(screen.getByText('Use another method'));
      const deactivatedMethod = screen.queryByText(`Sign in with your passkey`);
      expect(deactivatedMethod).not.toBeInTheDocument();
    });

    mockWebAuthn(() => {
      it('should not skip passkey alternative method when webauthn is supported', async () => {
        const email = 'test@clerk.com';
        const { wrapper, fixtures } = await createFixtures(f => {
          f.withEmailAddress();
          f.withPassword();
          f.withPasskey();
          f.withPreferredSignInStrategy({ strategy: 'otp' });
          f.startSignInWithEmailAddress({ supportPasskey: true, supportEmailCode: true, identifier: email });
        });
        fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
        const { userEvent } = render(<SignInFactorOne />, { wrapper });
        await userEvent.click(screen.getByText('Use another method'));
        await userEvent.click(screen.getByText('Sign in with your password'));
        await userEvent.click(screen.getByText('Use another method'));
        screen.getByText(`Sign in with your passkey`);
      });
    });

    it('should list enabled first factor methods without the current one', async () => {
      const email = 'test@clerk.com';
      const { wrapper, fixtures } = await createFixtures(f => {
        f.withSocialProvider({ provider: 'google' });
        f.withEmailAddress();
        f.withPassword();
        f.withPreferredSignInStrategy({ strategy: 'otp' });
        f.startSignInWithEmailAddress({ supportEmailCode: true, identifier: email });
      });
      fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
      const { userEvent } = render(<SignInFactorOne />, { wrapper });
      await userEvent.click(screen.getByText('Use another method'));
      const currentMethod = screen.queryByText(`Send code to ${email}`);
      expect(currentMethod).not.toBeInTheDocument();
      screen.getByText(/Continue with google/i);
      screen.getByText(`Sign in with your password`);
      const deactivatedMethod = screen.queryByText(`Send link to ${email}`);
      expect(deactivatedMethod).not.toBeInTheDocument();
    });

    it('clicking the password method should show the password input', async () => {
      const { wrapper, fixtures } = await createFixtures(f => {
        f.withEmailAddress();
        f.withPassword();
        f.withPreferredSignInStrategy({ strategy: 'otp' });
        f.startSignInWithEmailAddress({ supportEmailCode: true });
      });
      fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
      const { userEvent } = render(<SignInFactorOne />, { wrapper });
      await userEvent.click(screen.getByText('Use another method'));
      await userEvent.click(screen.getByText('Sign in with your password'));
      screen.getByText('Enter your password');
    });

    it('clicking the email link method should show the magic link screen', async () => {
      const email = 'test@clerk.com';
      const { wrapper, fixtures } = await createFixtures(f => {
        f.withEmailAddress();
        f.withPassword();
        f.withPreferredSignInStrategy({ strategy: 'password' });
        f.startSignInWithEmailAddress({ supportEmailLink: true, identifier: email });
      });
      fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
      fixtures.signIn.createEmailLinkFlow.mockImplementation(
        () =>
          ({
            startEmailLinkFlow: jest.fn(() => new Promise(() => ({}))),
            cancelEmailLinkFlow: jest.fn(() => new Promise(() => ({}))),
          }) as any,
      );
      const { userEvent } = render(<SignInFactorOne />, { wrapper });
      await userEvent.click(screen.getByText('Use another method'));
      screen.getByText(`Email link to ${email}`);
      await userEvent.click(screen.getByText(`Email link to ${email}`));
      screen.getByText('Check your email');
      screen.getByText('Use the verification link sent to your email');
    });

    it('clicking the email code method should show the email code input', async () => {
      const email = 'test@clerk.com';
      const { wrapper, fixtures } = await createFixtures(f => {
        f.withEmailAddress();
        f.withPassword();
        f.withPreferredSignInStrategy({ strategy: 'password' });
        f.startSignInWithEmailAddress({ supportEmailCode: true, identifier: email });
      });
      fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
      fixtures.signIn.createEmailLinkFlow.mockReturnValue({
        startEmailLinkFlow: jest.fn(() => new Promise(() => ({}))),
        cancelEmailLinkFlow: jest.fn(() => new Promise(() => ({}))),
      } as any);
      const { userEvent } = render(<SignInFactorOne />, { wrapper });
      await userEvent.click(screen.getByText('Use another method'));
      screen.getByText(`Email code to ${email}`);
      await userEvent.click(screen.getByText(`Email code to ${email}`));
      screen.getByText('Check your email');
      screen.getByText('to continue to TestApp');
    });

    it('clicking the phone code method should show the phone code input', async () => {
      const { wrapper, fixtures } = await createFixtures(f => {
        f.withEmailAddress();
        f.withPassword();
        f.withPreferredSignInStrategy({ strategy: 'password' });
        f.startSignInWithPhoneNumber({ supportPhoneCode: true });
      });
      fixtures.signIn.prepareFirstFactor.mockReturnValueOnce(Promise.resolve({} as SignInResource));
      fixtures.signIn.createEmailLinkFlow.mockReturnValue({
        startEmailLinkFlow: jest.fn(() => new Promise(() => ({}))),
        cancelEmailLinkFlow: jest.fn(() => new Promise(() => ({}))),
      } as any);
      const { userEvent } = render(<SignInFactorOne />, { wrapper });
      await userEvent.click(screen.getByText('Use another method'));
      screen.getByText(/code to \+/);
      await userEvent.click(screen.getByText(/code to \+/));
      screen.getByText('Check your phone');
    });

    describe('Get Help', () => {
      it('should render the get help component when clicking the "Get Help" button', async () => {
        const { wrapper } = await createFixtures(f => {
          f.withEmailAddress({ first_factors: ['email_code', 'email_link'] });
          f.startSignInWithEmailAddress({ supportEmailCode: true, supportEmailLink: true });
        });

        const { userEvent } = render(<SignInFactorOne />, { wrapper });
        await userEvent.click(screen.getByText('Use another method'));
        await userEvent.click(screen.getByText('Get help'));
        screen.getByText('Email support');
      });

      it('should go back to "Use another method" screen when clicking the "<- Back" button', async () => {
        const { wrapper } = await createFixtures(f => {
          f.withEmailAddress({ first_factors: ['email_code', 'email_link'] });
          f.startSignInWithEmailAddress({ supportEmailCode: true, supportEmailLink: true });
        });

        const { userEvent, getByText } = render(<SignInFactorOne />, { wrapper });
        await userEvent.click(getByText('Use another method'));
        await userEvent.click(getByText('Get help'));
        await userEvent.click(getByText('Back'));

        expect(getByText('Use another method'));
      });

      it('should open a "mailto:" link when clicking the email support button', async () => {
        const { wrapper } = await createFixtures(f => {
          f.withEmailAddress({ first_factors: ['email_code', 'email_link'] });
          f.startSignInWithEmailAddress({ supportEmailCode: true, supportEmailLink: true });
        });

        const { userEvent } = render(<SignInFactorOne />, { wrapper });
        await userEvent.click(screen.getByText('Use another method'));
        await userEvent.click(screen.getByText('Get help'));

        const assignMock = jest.fn();
        const mockResponse = jest.fn();
        Object.defineProperty(window, 'location', {
          value: {
            set href(_) {
              assignMock();
            },
            get href() {
              return '';
            },
            assign: mockResponse,
          },
          writable: true,
        });
        await userEvent.click(screen.getByText('Email support'));
        expect(assignMock).toHaveBeenCalled();
      });
    });
  });
});

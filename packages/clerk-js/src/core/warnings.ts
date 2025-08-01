import type { Serializable } from '@appypeeps/clerk-types';

const formatWarning = (msg: string) => {
  return `🔒 Clerk:\n${msg.trim()}\n(This notice only appears in development)`;
};

const createMessageForDisabledOrganizations = (
  componentName: 'OrganizationProfile' | 'OrganizationSwitcher' | 'OrganizationList' | 'CreateOrganization',
) => {
  return formatWarning(
    `The <${componentName}/> cannot be rendered when the feature is turned off. Visit 'dashboard.clerk.com' to enable the feature. Since the feature is turned off, this is no-op.`,
  );
};
const createMessageForDisabledCommerce = (componentName: 'PricingTable' | 'Checkout' | 'PlanDetails') => {
  return formatWarning(
    `The <${componentName}/> component cannot be rendered when billing is disabled. Visit 'https://dashboard.clerk.com/last-active?path=billing/settings' to follow the necessary steps to enable commerce. Since commerce is disabled, this is no-op.`,
  );
};
const warnings = {
  cannotRenderComponentWhenSessionExists:
    'The <SignUp/> and <SignIn/> components cannot render when a user is already signed in, unless the application allows multiple sessions. Since a user is signed in and this application only allows a single session, Clerk is redirecting to the Home URL instead.',
  cannotRenderSignUpComponentWhenSessionExists:
    'The <SignUp/> component cannot render when a user is already signed in, unless the application allows multiple sessions. Since a user is signed in and this application only allows a single session, Clerk is redirecting to the value set in `afterSignUp` URL instead.',
  cannotRenderSignUpComponentWhenTaskExists:
    'The <SignUp/> component cannot render when a user has a pending task, unless the application allows multiple sessions. Since a user is signed in and this application only allows a single session, Clerk is redirecting to the task instead.',
  cannotRenderSignInComponentWhenSessionExists:
    'The <SignIn/> component cannot render when a user is already signed in, unless the application allows multiple sessions. Since a user is signed in and this application only allows a single session, Clerk is redirecting to the `afterSignIn` URL instead.',
  cannotRenderSignInComponentWhenTaskExists:
    'The <SignIn/> component cannot render when a user has a pending task, unless the application allows multiple sessions. Since a user is signed in and this application only allows a single session, Clerk is redirecting to the task instead.',
  cannotRenderComponentWhenUserDoesNotExist:
    '<UserProfile/> cannot render unless a user is signed in. Since no user is signed in, this is no-op.',
  cannotRenderComponentWhenOrgDoesNotExist: `<OrganizationProfile/> cannot render unless an organization is active. Since no organization is currently active, this is no-op.`,
  cannotRenderAnyOrganizationComponent: createMessageForDisabledOrganizations,
  cannotRenderAnyCommerceComponent: createMessageForDisabledCommerce,
  cannotOpenUserProfile:
    'The UserProfile modal cannot render unless a user is signed in. Since no user is signed in, this is no-op.',
  cannotOpenCheckout:
    'The Checkout drawer cannot render unless a user is signed in. Since no user is signed in, this is no-op.',
  cannotOpenSignInOrSignUp:
    'The SignIn or SignUp modals do not render when a user is already signed in, unless the application allows multiple sessions. Since a user is signed in and this application only allows a single session, this is no-op.',
  cannotRenderAPIKeysComponent:
    'The <APIKeys/> component cannot be rendered when API keys is disabled. Since API keys is disabled, this is no-op.',
  cannotRenderAPIKeysComponentForOrgWhenUnauthorized:
    'The <APIKeys/> component cannot be rendered for an organization unless a user has the required permissions. Since the user does not have the necessary permissions, this is no-op.',
};

type SerializableWarnings = Serializable<typeof warnings>;

for (const key of Object.keys(warnings)) {
  const item = warnings[key as keyof typeof warnings];
  if (typeof item !== 'function') {
    warnings[key as keyof SerializableWarnings] = formatWarning(item);
  }
}

export { warnings };

export * from './middlewareHandler';

export * from './getAuth';
export { clerkClient } from './clerkClient';

/**
 * Re-export resource types from @appypeeps/clerk-backend
 */
export type {
  OrganizationMembershipRole,
  // Webhook event types
  WebhookEvent,
  WebhookEventType,
  // Resources
  AllowlistIdentifier,
  Client,
  EmailAddress,
  ExternalAccount,
  Invitation,
  OauthAccessToken,
  Organization,
  OrganizationDomain,
  OrganizationInvitation,
  OrganizationMembership,
  OrganizationMembershipPublicUserData,
  PhoneNumber,
  Session,
  SignInToken,
  SMSMessage,
  Token,
  User,
} from '@appypeeps/clerk-backend';

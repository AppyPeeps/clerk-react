import type {
  Attributes,
  EmailAddressResource,
  PhoneNumberResource,
  UserResource,
  Web3WalletResource,
} from '@appypeeps/clerk-types';

type IDable = { id: string };

export const primaryIdentificationFirst = (primaryId: string | null) => (val1: IDable, val2: IDable) => {
  return primaryId === val1.id ? -1 : primaryId === val2.id ? 1 : 0;
};

export const currentSessionFirst = (id: string) => (a: IDable) => (a.id === id ? -1 : 1);

export const defaultFirst = (a: PhoneNumberResource) => (a.defaultSecondFactor ? -1 : 1);

export function getSecondFactors(attributes: Partial<Attributes>): string[] {
  const secondFactors: string[] = [];

  Object.entries(attributes).forEach(([, attr]) => {
    if (attr.used_for_second_factor) {
      secondFactors.push(...attr.second_factors);
    }
  });

  return secondFactors;
}

export function getSecondFactorsAvailableToAdd(attributes: Partial<Attributes>, user: UserResource): string[] {
  let sfs = getSecondFactors(attributes);

  // If user.totp_enabled, skip totp from the list of choices
  if (user.totpEnabled) {
    sfs = sfs.filter(f => f !== 'totp');
  }

  // Remove backup codes if already enabled or user doesn't have another MFA method added
  if (user.backupCodeEnabled || !user.twoFactorEnabled) {
    sfs = sfs.filter(f => f !== 'backup_code');
  }

  return sfs;
}

export function sortIdentificationBasedOnVerification<
  T extends Array<EmailAddressResource | PhoneNumberResource | Web3WalletResource>,
>(array: T | null | undefined, primaryId: string | null | undefined): T {
  if (!array) {
    return [] as unknown as T;
  }
  const primaryItem = array.filter(item => item.id === primaryId);
  const itemsWithoutPrimary = array.filter(item => item.id !== primaryId);
  const verifiedItems = itemsWithoutPrimary.filter(item => item.verification?.status === 'verified');
  const unverifiedItems = itemsWithoutPrimary.filter(
    item => !!item.verification?.status && item.verification?.status !== 'verified',
  );
  const unverifiedItemsWithoutVerification = itemsWithoutPrimary.filter(item => !item.verification.status);

  // Sorting verified items alphabetically by name
  verifiedItems.sort((a, b) => a.id.localeCompare(b.id));

  // Sorting unverified items by expireAt, most recent last
  unverifiedItems.sort((a, b) => {
    if (!a.verification?.expireAt || !b.verification?.expireAt) {
      return 0;
    }
    return a.verification.expireAt.getTime() - b.verification.expireAt.getTime();
  });

  return [...primaryItem, ...verifiedItems, ...unverifiedItems, ...unverifiedItemsWithoutVerification] as T;
}

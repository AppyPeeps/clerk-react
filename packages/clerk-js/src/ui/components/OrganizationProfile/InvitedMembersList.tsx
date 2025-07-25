import { useOrganization } from '@appypeeps/clerk-shared/react';
import type { OrganizationInvitationResource } from '@appypeeps/clerk-types';

import { useCardState } from '@/ui/elements/contexts';
import { ThreeDotsMenu } from '@/ui/elements/ThreeDotsMenu';
import { UserPreview } from '@/ui/elements/UserPreview';
import { handleError } from '@/ui/utils/errorHandler';

import { Box, descriptors, localizationKeys, Td, Text } from '../../customizables';
import { useFetchRoles, useLocalizeCustomRoles } from '../../hooks/useFetchRoles';
import { DataTable, RowContainer } from './MemberListTable';

const invitationsParams = {
  invitations: {
    pageSize: 10,
    keepPreviousData: true,
  },
};

export const InvitedMembersList = () => {
  const card = useCardState();
  const { organization, invitations } = useOrganization(invitationsParams);

  const { options, isLoading: loadingRoles } = useFetchRoles();

  if (!organization) {
    return null;
  }

  const revoke = (invitation: OrganizationInvitationResource) => async () => {
    return card
      .runAsync(async () => {
        await invitation.revoke();
        await invitations?.revalidate?.();
        return invitation;
      })
      .catch(err => handleError(err, [], card.setError));
  };

  return (
    <DataTable
      page={invitations?.page || 1}
      onPageChange={invitations?.fetchPage || (() => null)}
      itemCount={invitations?.count || 0}
      pageCount={invitations?.pageCount || 0}
      itemsPerPage={invitationsParams.invitations.pageSize}
      isLoading={invitations?.isLoading || loadingRoles}
      emptyStateLocalizationKey={localizationKeys('organizationProfile.membersPage.invitationsTab.table__emptyRow')}
      headers={[
        localizationKeys('organizationProfile.membersPage.activeMembersTab.tableHeader__user'),
        localizationKeys('organizationProfile.membersPage.invitedMembersTab.tableHeader__invited'),
        localizationKeys('organizationProfile.membersPage.activeMembersTab.tableHeader__role'),
        localizationKeys('organizationProfile.membersPage.activeMembersTab.tableHeader__actions'),
      ]}
      rows={(invitations?.data || []).map(i => (
        <InvitationRow
          key={i.id}
          options={options}
          invitation={i}
          onRevoke={revoke(i)}
        />
      ))}
    />
  );
};

const InvitationRow = (props: {
  invitation: OrganizationInvitationResource;
  options: ReturnType<typeof useFetchRoles>['options'];
  onRevoke: () => unknown;
}) => {
  const { invitation, onRevoke, options } = props;
  const { localizeCustomRole } = useLocalizeCustomRoles();

  const unlocalizedRoleLabel = options?.find(a => a.value === invitation.role)?.label;

  return (
    <RowContainer>
      <Td>
        <UserPreview
          sx={{ maxWidth: '30ch' }}
          user={{ primaryEmailAddress: { emailAddress: invitation.emailAddress } } as any}
        />
      </Td>
      <Td>
        <Box
          as='span'
          elementDescriptor={descriptors.formattedDate}
          elementId={descriptors.formattedDate.setId('tableCell')}
        >
          {invitation.createdAt.toLocaleDateString()}
        </Box>
      </Td>
      <Td>
        <Text
          colorScheme='secondary'
          localizationKey={localizeCustomRole(invitation.role) || unlocalizedRoleLabel}
        />
      </Td>
      <Td>
        <ThreeDotsMenu
          actions={[
            {
              label: localizationKeys('organizationProfile.membersPage.invitedMembersTab.menuAction__revoke'),
              isDestructive: true,
              onClick: onRevoke,
            },
          ]}
          elementId={'invitation'}
        />
      </Td>
    </RowContainer>
  );
};

<script setup lang="ts">
import { useClerk } from '../../../composables';
import type { UserProfileProps } from '@appypeeps/clerk-types';
import { ClerkHostRenderer, CustomPortalsRenderer } from '../../ClerkHostRenderer';
import { computed, provide } from 'vue';
import { UserProfileInjectionKey } from '../../../keys';
import { useUserProfileCustomPages } from '../../../utils/useCustomPages';

type Props = Omit<UserProfileProps, 'customPages'>;
const props = defineProps<Props>();

const clerk = useClerk();
const { customPages, customPagesPortals, addCustomPage } = useUserProfileCustomPages();

const finalProps = computed(() => ({
  ...props,
  customPages: customPages.value,
}));

provide(UserProfileInjectionKey, {
  addCustomPage,
});
</script>

<template>
  <ClerkHostRenderer
    :mount="clerk?.mountUserProfile"
    :unmount="clerk?.unmountUserProfile"
    :props="finalProps"
    :update-props="(clerk as any)?.__unstable__updateProps"
  />
  <CustomPortalsRenderer :custom-pages-portals="customPagesPortals" />
  <slot />
</template>

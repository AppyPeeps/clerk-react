<script setup lang="ts">
import { ClerkHostRenderer } from '../ClerkHostRenderer';
import { useClerk } from '../../composables';
import type { CreateOrganizationProps } from '@appypeeps/clerk-types';

const clerk = useClerk();
const props = defineProps<CreateOrganizationProps>();
</script>

<template>
  <ClerkHostRenderer
    :mount="clerk?.mountCreateOrganization"
    :unmount="clerk?.unmountCreateOrganization"
    :update-props="(clerk as any)?.__unstable__updateProps"
    :props="props"
  />
</template>

<script setup lang="ts">
import { ClerkHostRenderer } from '../ClerkHostRenderer';
import type { WaitlistProps } from '@appypeeps/clerk-types';
import { useClerk } from '../../composables';

const clerk = useClerk();
const props = defineProps<WaitlistProps>();
</script>

<template>
  <ClerkHostRenderer
    :mount="clerk?.mountWaitlist"
    :unmount="clerk?.unmountWaitlist"
    :update-props="(clerk as any)?.__unstable__updateProps"
    :props="props"
  />
</template>

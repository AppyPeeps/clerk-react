import { setClerkJsLoadingErrorPackageName } from '@appypeeps/clerk-shared/loadClerkJsScript';
import type { InitialState } from '@appypeeps/clerk-types';
import { clerkPlugin } from '@appypeeps/clerk-vue';
import { setErrorThrowerOptions } from '@appypeeps/clerk-vue/internal';
import { defineNuxtPlugin, navigateTo, useRuntimeConfig, useState } from 'nuxt/app';

setErrorThrowerOptions({ packageName: PACKAGE_NAME });
setClerkJsLoadingErrorPackageName(PACKAGE_NAME);

export default defineNuxtPlugin(nuxtApp => {
  // SSR-friendly shared state
  const initialState = useState<InitialState | undefined>('clerk-initial-state', () => undefined);

  if (import.meta.server) {
    // Save the initial state from server and pass it to the plugin
    initialState.value = nuxtApp.ssrContext?.event.context.__clerk_initial_state;
  }

  const runtimeConfig = useRuntimeConfig();

  nuxtApp.vueApp.use(clerkPlugin, {
    ...(runtimeConfig.public.clerk ?? {}),
    sdkMetadata: {
      name: PACKAGE_NAME,
      version: PACKAGE_VERSION,
      environment: process.env.NODE_ENV,
    },
    routerPush: (to: string) => navigateTo(to),
    routerReplace: (to: string) => navigateTo(to, { replace: true }),
    initialState: initialState.value,
  });
});

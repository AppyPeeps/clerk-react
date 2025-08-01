import type { PluginOptions } from '@appypeeps/clerk-vue';

declare global {
  const PACKAGE_NAME: string;
  const PACKAGE_VERSION: string;
}

// See https://nuxt.com/docs/guide/going-further/runtime-config#typing-runtime-config
declare module 'nuxt/schema' {
  interface RuntimeConfig {
    clerk: {
      secretKey?: string;
      jwtKey?: string;
      webhookSigningSecret?: string;
    };
  }
  interface PublicRuntimeConfig {
    clerk: PluginOptions;
  }
}

export {};

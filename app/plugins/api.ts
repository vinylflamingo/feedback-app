// plugins/api.ts
import { defineNuxtPlugin } from '#app';
import api, { initializeApiClient } from '@/services/api';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  initializeApiClient(config.public.apiUrl);
  nuxtApp.provide('api', api);
});
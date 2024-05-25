// plugins/initAuthAndApi.ts
import { defineNuxtPlugin, useCookie } from '#app'
import { useAuthStore } from '@/store/auth'
import api, { initializeApiClient } from '@/services/api'

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig();

  const tokenLifetime: number = Number(config.public.TOKEN_LIFETIME) || 60; // Default to 60 minutes
  const tokenRefreshMargin: number = Number(config.public.TOKEN_REFRESH_MARGIN) || 10; // Default to 10 minutes
  const baseUrl: string = String(config.public.BASE_URL) || "https://localhost:8000";
  const maxAge = tokenLifetime * 60; // Convert to seconds
  console.log("Plugin injecting cookie. Max Age: ", maxAge)
  const tokenCookie = useCookie("1023n1212lno12oi12pubd012ud09n12ud90u21d9u12du1n2dn031n3n", { maxAge });
  const tokenExpirationCookie = useCookie("token_expiration");

  if (tokenCookie.value) {
    authStore.setToken(tokenCookie.value);
    if (tokenExpirationCookie.value) {
      authStore.setTokenExpiration(new Date(tokenExpirationCookie.value));
    } else {
      // Set expiration to TOKEN_LIFETIME minutes from now if expiration cookie is missing
      const expirationDate = new Date();
      expirationDate.setSeconds(expirationDate.getSeconds() + maxAge);
      authStore.setTokenExpiration(expirationDate);
      tokenExpirationCookie.value = expirationDate.toISOString();
    }
  }

  initializeApiClient(baseUrl, tokenLifetime, tokenRefreshMargin);
  nuxtApp.provide('api', api);
});

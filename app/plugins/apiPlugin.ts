import { defineNuxtPlugin, useCookie, useRuntimeConfig } from '#app'
import { useAuthStore } from '@/store/auth'
import api, { initializeApiClient } from '@/services/api'
import qs from 'qs';

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  const tokenLifetime = Number(config.public.TOKEN_LIFETIME) || 60; // Default to 60 minutes
  const tokenRefreshMargin = Number(config.public.TOKEN_REFRESH_MARGIN) || 10; // Default to 10 minutes
  const baseUrl = String(config.public.BASE_URL) || "https://localhost:8000";
  const maxAge = tokenLifetime * 60; // Convert to seconds

  const tokenCookie = useCookie("auth_token", { maxAge });
  const tokenExpirationCookie = useCookie("auth_token_expiration");

  if (tokenCookie.value) {
    authStore.setToken(tokenCookie.value);
    if (tokenExpirationCookie.value) {
      authStore.setTokenExpiration(new Date(tokenExpirationCookie.value));
    } else {
      const expirationDate = new Date();
      expirationDate.setSeconds(expirationDate.getSeconds() + maxAge);
      authStore.setTokenExpiration(expirationDate);
      tokenExpirationCookie.value = expirationDate.toISOString();
    }
  }

  initializeApiClient(baseUrl, tokenLifetime, tokenRefreshMargin);

  async function performLogin() {
    try {
      const loginData = {
        username: config.public.BUILD_ADMIN_USERNAME,
        password: config.public.BUILD_ADMIN_PASSWORD,
      };

      const data = qs.stringify(loginData, { format: 'RFC1738' });
      const response = await api.apiClient.post('/token', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const token = response.data.access_token;
      api.apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      authStore.setToken(token);
      const expirationDate = new Date();
      expirationDate.setSeconds(expirationDate.getSeconds() + maxAge);
      authStore.setTokenExpiration(expirationDate);
      tokenExpirationCookie.value = expirationDate.toISOString();
    } catch (error) {
      console.error('Failed to log in:', error);
      throw new Error('Failed to log in');
    }
  };

  console.log("is build time?", process.env.BUILD_TIME)
  if (process.env.BUILD_TIME === 'true') {

    await performLogin();
  }

  // Ensure that all subsequent requests use the token
  api.apiClient.interceptors.request.use(config => {
    if (authStore.token) {
      config.headers['Authorization'] = `Bearer ${authStore.token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

  nuxtApp.provide('api', api);
});

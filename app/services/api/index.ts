import { login, refreshAuthToken, clearToken, updateCookiesAndStore } from './auth';
import { createSuggestion, updateSuggestion, readSuggestions, getRoadmapCounts } from './suggestions';
import { addComment, addChildComment } from './comments';
import { upvoteSuggestion } from './upvotes';
import { createUser } from './user';



import type { AxiosInstance } from 'axios';
import type { RuntimeConfig } from 'nuxt/schema';
import qs from 'qs';
import type { AuthCookies } from '~/types';

export const TOKEN_COOKIE: string = 'auth_token';
export const TOKEN_EXPIRATION_COOKIE: string = 'auth_token_expiration';
export const TOKEN_USER_ID: string = 'current_user_id';
export let needRefresh: boolean = false;

export let apiClient: AxiosInstance;
export let isBuildMode: boolean = false;
export let stores: { authStore: ReturnType<typeof useAuthStore>, runtimeConfig: RuntimeConfig };
export let cookies: AuthCookies;

export const initialize = async (authStore: ReturnType<typeof useAuthStore>, runtimeConfig: RuntimeConfig, authCookies: AuthCookies) => {
  stores = { authStore, runtimeConfig };
  cookies = authCookies;

  const existingToken = cookies.tokenCookie.value;
  if (existingToken != null && existingToken != undefined) {
    stores.authStore.setToken(existingToken);
    const expirationValue = cookies.expirationCookie.value;
    if (expirationValue) {
      const expirationTimestamp = Date.parse(expirationValue as string);
      if (expirationTimestamp) {
        const expirationDate = new Date(expirationTimestamp).toISOString();
        if (new Date(expirationDate) <= new Date()) {
          stores.authStore.clearToken();
        } else {
          stores.authStore.setTokenExpiration(expirationDate);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;
          const user = cookies.userCookie;
          stores.authStore.setUserId(parseInt(user.value as string || ''));
        }
      }
    }
  }

  const isBuildTime = process.env.BUILD_TIME === 'true';
  if (isBuildTime) {
    enableBuildMode();
    await login({ username: process.env.BUILD_ADMIN_USERNAME, password: process.env.BUILD_ADMIN_PASSWORD });
  }
};

export const setApiClient = (client: AxiosInstance) => {
  apiClient = client;
};

export const enableBuildMode = () => {
  isBuildMode = true;
};

export const handleErrors = (error: any) => {
  if (error.response) {
    console.error('API response error:', error.response.data);
    console.error('API response status:', error.response.status);
    console.error('API response headers:', error.response.headers);
  } else if (error.request) {
    console.error('API no response received:', error.request);
  } else {
    console.error('API request error:', error.message);
  }
};

export const prepareData = (formData: Record<string, any>, contentType: string) => {
  if (contentType === 'application/x-www-form-urlencoded') {
    return qs.stringify(formData);
  }
  return formData;
};


// import 

export default {
    initialize,
    setApiClient,
    enableBuildMode,
    login,
    refreshAuthToken,
    clearToken,
    createUser,
    addComment,
    addChildComment,
    upvoteSuggestion,
    TOKEN_COOKIE,
    TOKEN_EXPIRATION_COOKIE,
    createSuggestion,
    updateSuggestion,
    readSuggestions,
    getRoadmapCounts,
    updateCookiesAndStore,
    needRefresh,
  };
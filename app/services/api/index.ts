
//// THESE IMPORTS ARE JUST TO EXPORT OUT THE DEFAULT. /////
import { login, refreshAuthToken, clearToken, updateCookiesAndStore } from './auth';
import { createSuggestion, updateSuggestion, readSuggestions, getRoadmapCounts } from './suggestions';
import { addComment, addChildComment } from './comments';
import { upvoteSuggestion } from './upvotes';
import { createUser, currentUser } from './user';


//// THESE ARE EXTERNAL TO USE IN THIS FILE. /////
import type { AxiosInstance } from 'axios';
import type { RuntimeConfig } from 'nuxt/schema';
import qs from 'qs';
import type { AuthCookies } from '~/types';
export let needRefresh: boolean = false;


//// SERVICE WIDE VARIABLES //// 
export let apiClient: AxiosInstance;
export let isBuildMode: boolean = false;
export let stores: { authStore: ReturnType<typeof useAuthStore>, runtimeConfig: RuntimeConfig, userStore: ReturnType<typeof useUserStore> };
export let cookies: AuthCookies;

/// INITILIAZES THE API SERVICE /// 
export const initialize = async (authStore: ReturnType<typeof useAuthStore>, runtimeConfig: RuntimeConfig, authCookies: AuthCookies, userStore: ReturnType<typeof useUserStore>) => {
  stores = { authStore, runtimeConfig, userStore };
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
          stores.userStore.refreshStore()
        }
      }
    }
  } else /* if the token exist, but another check fails along the way, we clear it all */ {
    clearToken();
  }

  const isBuildTime = process.env.BUILD_TIME === 'true';
  if (isBuildTime) {
    enableBuildMode();
    await login({ username: process.env.BUILD_ADMIN_USERNAME, password: process.env.BUILD_ADMIN_PASSWORD });
  }
};

/// USED IN THE PLUGIN ///
export const setApiClient = (client: AxiosInstance) => {
  apiClient = client;
};

/// NO USE YET, USEFUL IN FUTURE /// 
export const enableBuildMode = () => {
  isBuildMode = true;
};

/// BROKEN DOWN LOGGING ///
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

/// JUST USED TO FORMAT DATA FROM OBJECT TO FORM ///
export const prepareData = (formData: Record<string, any>, contentType: string) => {
  if (contentType === 'application/x-www-form-urlencoded') {
    return qs.stringify(formData);
  }
  return formData;
};


 /// IMPORTS WE SEND OUT OF THE SERVICE api.exportedMember()
export default {
    initialize,
    setApiClient,
    enableBuildMode,
    login,
    refreshAuthToken,
    clearToken,
    createUser,
    currentUser,
    addComment,
    addChildComment,
    upvoteSuggestion,
    createSuggestion,
    updateSuggestion,
    readSuggestions,
    getRoadmapCounts,
    updateCookiesAndStore,
    needRefresh,
  };
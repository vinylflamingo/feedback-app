// services/api.ts

import axios, { type AxiosInstance } from 'axios';
import qs from 'qs';
import { useAuthStore } from '@/store/auth';
import { useCookie, type CookieRef } from '#app';
import type { Api, Suggestion, Comment } from '~/types';

let apiClient: AxiosInstance;

const TOKEN_COOKIE: string = "1023n1212lno12oi12pubd012ud09n12ud90u21d9u12du1n2dn031n";
const TOKEN_EXPIRATION_COOKIE: string = "token_expiration";

let tokenLifetime: number;
let tokenRefreshMargin: number;
let isRefreshing: boolean = false;

function setTokenExpiration(expirationTime: number): void {
  const expirationDate = new Date(expirationTime * 1000); // Convert seconds to milliseconds
  document.cookie = `${TOKEN_EXPIRATION_COOKIE}=${expirationDate.toISOString()};path=/`;
}

function getTokenExpiration(): Date | null {
  const expirationCookie = document.cookie.split('; ').find(row => row.startsWith(TOKEN_EXPIRATION_COOKIE));
  if (expirationCookie) {
    const expirationDate = expirationCookie.split('=')[1];
    return new Date(expirationDate);
  }
  return null;
}

export function setAuthToken(token: string): void {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function clearAuthToken(): void {
  delete apiClient.defaults.headers.common['Authorization'];
}

export function handleErrors(error: any): void {
  if (error.response) {
    console.error("API response error:", error.response.data);
    console.error("API response status:", error.response.status);
    console.error("API response headers:", error.response.headers);
  } else if (error.request) {
    console.error("API no response received:", error.request);
  } else {
    console.error("API request error:", error.message);
  }
}

function prepareData(formData: Record<string, any>, contentType: string) {
  if (contentType === 'application/x-www-form-urlencoded') {
    return qs.stringify(formData);
  }
  return formData;
}

const api: Api = {
  apiClient: {} as AxiosInstance,

  async login(formData: Record<string, any>): Promise<void> {
    const authStore = useAuthStore();
    const tokenCookie = useCookie(TOKEN_COOKIE);
    const tokenExpirationCookie = useCookie(TOKEN_EXPIRATION_COOKIE);
    try {
      const data = prepareData({ username: formData.username, password: formData.password }, 'application/x-www-form-urlencoded');
      const response = await apiClient.post('/token', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const token = response.data.access_token;
      const expiresIn = tokenLifetime * 60; // Convert minutes to seconds
      authStore.setToken(token);
      tokenCookie.value = token;
      setAuthToken(token);

      const expirationDate = new Date();
      expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);
      authStore.setTokenExpiration(expirationDate);
      tokenExpirationCookie.value = expirationDate.toISOString();
    } catch (error: any) {
      console.log(error);
      handleErrors(error);
      throw new Error('Failed to log in');
    }
  },

  async refreshAuthToken(): Promise<string | null> {
    const authStore = useAuthStore();
    const tokenCookie = useCookie(TOKEN_COOKIE);
    if (isRefreshing) return null;
    isRefreshing = true;
    try {
      const response = await apiClient.post('/refresh_token', {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const newToken = response.data.access_token;
      authStore.setToken(newToken);
      tokenCookie.value = newToken;
      setAuthToken(newToken);

      const expiresIn = tokenLifetime * 60; // Convert minutes to seconds
      const expirationDate = new Date();
      expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);
      authStore.setTokenExpiration(expirationDate);
      const tokenExpirationCookie = useCookie(TOKEN_EXPIRATION_COOKIE);
      tokenExpirationCookie.value = expirationDate.toISOString();
      
      return newToken;
    } catch (error: any) {
      console.log(error);
      handleErrors(error);
      return null;
    } finally {
      isRefreshing = false;
    }
  },
  
  clearToken(): void {
    const authStore = useAuthStore();
    const tokenCookie = useCookie(TOKEN_COOKIE);
    const tokenExpirationCookie = useCookie(TOKEN_EXPIRATION_COOKIE);
    authStore.setToken(null);
    authStore.setTokenExpiration(null);
    tokenCookie.value = null;
    tokenExpirationCookie.value = null;
    clearAuthToken();
  },
  

  async createUser(formData: Record<string, any>): Promise<void> {
    try {
      await apiClient.post('/users', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error: any) {
      handleErrors(error);
      throw new Error('Failed to create user');
    }
  },

  async createSuggestion(formData: Record<string, any>): Promise<Number> {
    try {
      formData.status = 'New';
      formData.completed = false;
      const response = await apiClient.post('/suggestions', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("Response", response)
      if (response.status === 200 && response.data.id) {
        return response.data.id;
      }
      else {
        return NaN
      }


    } catch (error: any) {
      handleErrors(error);
      throw new Error('Failed to create suggestion');
    }
  },

  async updateSuggestion(suggestionId: number, formData: Record<string, any>): Promise<Number> {
    try {
      console.log("beginning update suggestions");
      console.log(suggestionId);
      console.log(formData);

      const response = await apiClient.put(`/suggestions/${suggestionId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("Response", response)
      if (response.status === 200 && response.data.id) {
        return response.data.id;
      }
      else {
        return NaN
      }
    } catch (error: any) {
      handleErrors(error);
      throw new Error('Failed to update suggestion');
    }
  },

  async getSuggestion(suggestionId: number): Promise<Suggestion | null> {
    try {
      console.log("getSuggestion suggestionId", suggestionId);
      const response = await apiClient.get(`/suggestions/${suggestionId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("Response", response);
      if (response.status === 200 && response.data) {
        return response.data as Suggestion;
      } else {
        return null;
      }
    } catch (error: any) {
      handleErrors(error);
      throw new Error('Failed to fetch suggestion');
    }
  },
  

  async readTopSuggestions(): Promise<any> {
    try {
      const response = await apiClient.get('/top');
      return response.data;
    } catch (error: any) {
      handleErrors(error);
      throw new Error('Failed to read top suggestions');
    }
  },

  async readAllSuggestions(): Promise<any> {
    try {
      const response = await apiClient.get('/suggestions');
      return response.data;
    } catch (error: any) {
      handleErrors(error);
      throw new Error('Failed to read all suggestions');
    }
  },

  async readSuggestionsByCategory(category: string): Promise<any> {
    try {
      const response = await apiClient.get(`/suggestions/category/${category}`);
      return response.data;
    } catch (error: any) {
      handleErrors(error);
      throw new Error('Failed to read suggestions by category');
    }
  },

  async readSuggestionsByStatus(status: string): Promise<any> {
    try {
      const response = await apiClient.get(`/suggestions/status/${status}`);
      return response.data;
    } catch (error: any) {
      handleErrors(error);
      throw new Error('Failed to read suggestions by status');
    }
  },

  async addComment(suggestionId: number, formData: Record<string, any>): Promise<void> {
    try {
      const data = prepareData(formData, 'application/json');
      await apiClient.post(`/suggestions/${suggestionId}/comments`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error: any) {
      handleErrors(error);
      throw new Error('Failed to add comment');
    }
  },

  async addChildComment(suggestionId: number, commentId: string, formData: Record<string, any>): Promise<void> {
    try {
      const data = prepareData({ ...formData, parent_comment_id: commentId }, 'application/json');
      await apiClient.post(`/suggestions/${suggestionId}/comments`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error: any) {
      handleErrors(error);
      throw new Error('Failed to add child comment');
    }
  },

  async readCommentsBySuggestion(suggestionId: number): Promise<any> {
    try {
      const response = await apiClient.get(`/suggestions/${suggestionId}/comments`);
      return response.data;
    } catch (error: any) {
      handleErrors(error);
      throw new Error('Failed to read comments by suggestion');
    }
  },

  async upvoteSuggestion(suggestionId: number): Promise<void> {
    try {
      await apiClient.post(`/suggestions/${suggestionId}/upvote`);
    } catch (error: any) {
      handleErrors(error);
      throw new Error('Failed to upvote suggestion');
    }
  },
};

export const initializeApiClient = (baseURL: string, tokenLife: number, refreshMargin: number) => {
  apiClient = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  tokenLifetime = tokenLife;
  tokenRefreshMargin = refreshMargin;

  const authStore = useAuthStore();
  const tokenCookie = useCookie(TOKEN_COOKIE);
  const tokenExpirationCookie = useCookie(TOKEN_EXPIRATION_COOKIE);
  if (tokenCookie.value) {
    authStore.setToken(tokenCookie.value);
    setAuthToken(tokenCookie.value);
    if (tokenExpirationCookie.value) {
      authStore.setTokenExpiration(new Date(tokenExpirationCookie.value));
    }
  }

  function setupInterceptors() {
    apiClient.interceptors.request.use(
      async (config) => {
        const tokenExpiration = authStore.getTokenExpiration();
        if (tokenExpiration) {
          const currentTime = new Date();
          const timeDifference = (tokenExpiration.getTime() - currentTime.getTime()) / 1000;
          console.log("checking for auto refresh....");
          if (timeDifference < tokenRefreshMargin * 60 && timeDifference > 0) { 
            console.log("Attempting to refresh token...");
            const newToken = await api.refreshAuthToken();
            if (newToken) {
              config.headers['Authorization'] = `Bearer ${newToken}`;
              console.log("Token refreshed successfully.");
            }
          } else if (timeDifference <= 0) { // Clear if expired
            console.log("Token expired. Clearing token.");
            api.clearToken();
            window.location.href = '/login';
            return Promise.reject('Token expired');
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          console.log("Received 401. Clearing token and redirecting to login.");
          api.clearToken();
          window.location.href = `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
        }
        return Promise.reject(error);
      }
    );
  }

  setupInterceptors();

  api.apiClient = apiClient;
};


export default api;



// services/api.ts
import axios, { type AxiosInstance } from 'axios';
import qs from 'qs';
import { useAuthStore } from '@/store/auth';
import { useCookie, type CookieRef } from '#app';

interface Api {
  login(formData: Record<string, any>): Promise<void>;
  add(formData: Record<string, any>): Promise<void>;
  edit(formData: Record<string, any>): Promise<void>;
  createUser(formData: Record<string, any>): Promise<void>;
  createSuggestion(formData: Record<string, any>): Promise<void>;
  readSuggestionsByCategory(category: string): Promise<any>;
  readSuggestionsByStatus(status: string): Promise<any>;
  updateSuggestion(suggestionId: string, formData: Record<string, any>): Promise<void>;
  addComment(suggestionId: string, formData: Record<string, any>): Promise<void>;
  addChildComment(suggestionId: string, commentId: string, formData: Record<string, any>): Promise<void>;
  readCommentsBySuggestion(suggestionId: string): Promise<any>;
  upvoteSuggestion(suggestionId: string): Promise<void>;
  readTopSuggestions(): Promise<any>;
  readAllSuggestions(): Promise<any>;
  apiClient: AxiosInstance;
}

let apiClient: AxiosInstance;

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
let TOKEN_COOKIE: string = "1023n1212lno12oi12pubd012ud09n12ud90u21d9u12du1n2dn031n3n";

const api: Api = {
  apiClient: {} as AxiosInstance,
  

  async login(formData: Record<string, any>): Promise<void> {
    const authStore = useAuthStore();
    const tokenCookie = useCookie(TOKEN_COOKIE);
    try {
      const data = qs.stringify({ username: formData.username, password: formData.password });
      const response = await apiClient.post('/token', data);
      console.log(response);
      const token = response.data.access_token;
      authStore.setToken(token);
      tokenCookie.value = token // Set cookie
      setAuthToken(token);
    } catch (error: any) {
      console.log(error);
      handleErrors(error);
      throw new Error('Failed to log in');
    }
  },
  async add(formData: Record<string, any>): Promise<void> {
    console.log("Create New API called with", formData);
  },

  async edit(formData: Record<string, any>): Promise<void> {
    console.log("Edit API called with", formData);
  },

  async createUser(formData: Record<string, any>): Promise<void> {
    try {
      await apiClient.post('/users', formData);
    } catch (error: any) {
      handleErrors(error);
      throw new Error('Failed to create user');
    }
  },

  async createSuggestion(formData: Record<string, any>): Promise<void> {
    try {
      await apiClient.post('/suggestions', formData);
    } catch (error: any) {
      handleErrors(error);
      throw new Error('Failed to create suggestion');
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

  async updateSuggestion(suggestionId: string, formData: Record<string, any>): Promise<void> {
    try {
      await apiClient.put(`/suggestions/${suggestionId}`, formData);
    } catch (error: any) {
      handleErrors(error);
      throw new Error('Failed to update suggestion');
    }
  },

  async addComment(suggestionId: string, formData: Record<string, any>): Promise<void> {
    try {
      await apiClient.post(`/suggestions/${suggestionId}/comments`, formData);
    } catch (error: any) {
      handleErrors(error);
      throw new Error('Failed to add comment');
    }
  },

  async addChildComment(suggestionId: string, commentId: string, formData: Record<string, any>): Promise<void> {
    try {
      await apiClient.post(`/suggestions/${suggestionId}/comments`, { ...formData, parent_comment_id: commentId });
    } catch (error: any) {
      handleErrors(error);
      throw new Error('Failed to add child comment');
    }
  },

  async readCommentsBySuggestion(suggestionId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/suggestions/${suggestionId}/comments`);
      return response.data;
    } catch (error: any) {
      handleErrors(error);
      throw new Error('Failed to read comments by suggestion');
    }
  },

  async upvoteSuggestion(suggestionId: string): Promise<void> {
    try {
      await apiClient.post(`/suggestions/${suggestionId}/upvote`);
    } catch (error: any) {
      handleErrors(error);
      throw new Error('Failed to upvote suggestion');
    }
  },

  async readTopSuggestions(): Promise<any> {
    try {
      const response = await apiClient.get('/suggestions/top');
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
};

export const initializeApiClient = (baseURL: string) => {
  apiClient = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const authStore = useAuthStore()
  const tokenCookie = useCookie(TOKEN_COOKIE)
  if (tokenCookie.value) {
    authStore.setToken(tokenCookie.value)
    setAuthToken(tokenCookie.value)
  }

  api.apiClient = apiClient
};

export default api;
import type { AxiosInstance } from 'axios';
import type { Suggestion, Comment } from '../types';
import { type CookieRef } from '#app';

export interface Api {
  apiClient: AxiosInstance;
  setApiClient(client: AxiosInstance): void;
  enableBuildMode(): void;
  login(formData: Record<string, any>): Promise<void>;
  refreshAuthToken(): Promise<string | null>;
  clearToken(): void;
  createUser(formData: Record<string, any>): Promise<void>;
  addComment(suggestionId: number, formData: Record<string, any>): Promise<void>;
  addChildComment(suggestionId: number, commentId: string, formData: Record<string, any>): Promise<void>;
  upvoteSuggestion(suggestionId: number): Promise<void>;
  createSuggestion(formData: Record<string, any>): Promise<number>;
  updateSuggestion(suggestionId: number, formData: Record<string, any>): Promise<number>;
  readSuggestions(params?: Record<string, any>): Promise<any>;
  getRoadmapCounts(): Promise<Record<string, number>>;
  TOKEN_COOKIE: string;
  TOKEN_EXPIRATION_COOKIE: string;
  updateCookiesAndStore(): void;
}

export interface SortOption {
  key: string;
  value: string;
};

export interface SuggestionApiParams {
  limit: number;
  skip: number;
  sort?: string;
  category?: string;
}

export interface RoadmapCounts {
  [key: string]: number;
}

export interface SuggestionCount {
  type: string;
  data: Record<string, number>;
}

export interface AuthenticationResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  username: string
}

export interface AuthCookies {
  tokenCookie: CookieRef<string | null | undefined>;
  expirationCookie: CookieRef<string | null | undefined>;
  userCookie: CookieRef<string | null | undefined>;
}

export interface EncryptedCookie {
  encryptedCookie: CookieRef<string | null | undefined>
}

export interface TokenData {
  token: string;
  userId: number;
  expiration: string;
}




// types/api.ts

import type { AxiosInstance } from 'axios';
import type { Suggestion, Comment } from '../types';

export interface Api {
  login(formData: Record<string, any>): Promise<void>;
  refreshAuthToken(): Promise<string | null>;
  createUser(formData: Record<string, any>): Promise<void>;
  createSuggestion(formData: Record<string, any>): Promise<number>;
  getSuggestion(suggestionId: number): Promise<Suggestion | null>;
  updateSuggestion(suggestionId: number, formData: Record<string, any>): Promise<number>;
  readSuggestionsByCategory(category: string, params?: Record<string, any>): Promise<any>;
  readSuggestionsByStatus(status: string, params?: Record<string, any>): Promise<any>;
  addComment(suggestionId: number, formData: Record<string, any>): Promise<void>;
  addChildComment(suggestionId: number, commentId: string, formData: Record<string, any>): Promise<void>;
  readCommentsBySuggestion(suggestionId: number, params?: Record<string, any>): Promise<any>;
  upvoteSuggestion(suggestionId: number): Promise<void>;
  readTopSuggestions(params?: Record<string, any>): Promise<any>;
  readAllSuggestions(params?: Record<string, any>): Promise<any>;
  apiClient: AxiosInstance;
  clearToken(): void;
  setApiClient(client: AxiosInstance): void;
  enableBuildMode(): void;
  TOKEN_COOKIE: string;
  TOKEN_EXPIRATION_COOKIE: string;
}

import type { AxiosInstance } from "axios";
import type { Suggestion, Comment } from "./";
export interface Api {
    login(formData: Record<string, any>): Promise<void>;
    refreshAuthToken(): Promise<string | null>;
    createUser(formData: Record<string, any>): Promise<void>;
    createSuggestion(formData: Record<string, any>): Promise<Number> 
    getSuggestion(suggestionId: number): Promise<Suggestion | null> 
    updateSuggestion(suggestionId: number, formData: Record<string, any>): Promise<Number>;
    readSuggestionsByCategory(category: string): Promise<any>;
    readSuggestionsByStatus(status: string): Promise<any>;
    addComment(suggestionId: number, formData: Record<string, any>): Promise<void>;
    addChildComment(suggestionId: number, commentId: string, formData: Record<string, any>): Promise<void>;
    readCommentsBySuggestion(suggestionId: number): Promise<any>;
    upvoteSuggestion(suggestionId: number): Promise<void>;
    readTopSuggestions(): Promise<any>;
    readAllSuggestions(): Promise<any>;
    apiClient: AxiosInstance;
    clearToken(): void 
  }
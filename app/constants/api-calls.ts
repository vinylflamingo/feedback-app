import { AuthApi, UserApi, SuggestionApi, CommentApi, UpvoteApi } from './enums';
import api from '@/services/api';

// Define the type for the API functions
export type ApiFunction = (...args: any[]) => Promise<any>;

export const AUTH_API_CALLS: Record<AuthApi, ApiFunction> = {
  [AuthApi.LOGIN]: api.login,
};

export const USER_API_CALLS: Record<UserApi, ApiFunction> = {
  [UserApi.CREATE_USER]: api.createUser,
};

export const SUGGESTION_API_CALLS: Record<SuggestionApi, ApiFunction> = {
  [SuggestionApi.CREATE_SUGGESTION]: api.createSuggestion,
  [SuggestionApi.UPDATE_SUGGESTION]: api.updateSuggestion,
  [SuggestionApi.READ_SUGGESTIONS]: api.readSuggestions,
};

export const COMMENT_API_CALLS: Record<CommentApi, ApiFunction> = {
  [CommentApi.ADD_COMMENT]: api.addComment,
  [CommentApi.ADD_CHILD_COMMENT]: api.addChildComment,
};

export const UPVOTE_API_CALLS: Record<UpvoteApi, ApiFunction> = {
  [UpvoteApi.UPVOTE_TOGGLE]: api.upvoteSuggestion,
};

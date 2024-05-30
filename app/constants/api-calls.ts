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
  [SuggestionApi.GET_SUGGESTION]: api.getSuggestion,
  [SuggestionApi.READ_TOP]: api.readTopSuggestions,
  [SuggestionApi.READ_ALL]: api.readAllSuggestions,
  [SuggestionApi.READ_BY_CATEGORY]: api.readSuggestionsByCategory,
  [SuggestionApi.READ_BY_STATUS]: api.readSuggestionsByStatus,
  [SuggestionApi.CREATE_SUGGESTION_V2]: api.createSuggestionV2,
  [SuggestionApi.UPDATE_SUGGESTION_V2]: api.updateSuggestionV2,
  [SuggestionApi.READ_SUGGESTIONS_V2]: api.readSuggestionsV2,
};

export const COMMENT_API_CALLS: Record<CommentApi, ApiFunction> = {
  [CommentApi.ADD_COMMENT]: api.addComment,
  [CommentApi.ADD_CHILD_COMMENT]: api.addChildComment,
  [CommentApi.READ_BY_SUGGESTION]: api.readCommentsBySuggestion,
};

export const UPVOTE_API_CALLS: Record<UpvoteApi, ApiFunction> = {
  [UpvoteApi.UPVOTE_TOGGLE]: api.upvoteSuggestion,
};

// src/types/enums.ts
export enum Category {
  FEATURE = 'Feature',
  BUG = 'Bug',
  ENHANCEMENT = 'Enhancement',
  UI = 'UI',
  UX = 'UX'
}

export enum Status {
  SUGGESTION = 'Suggestion',
  PLANNED = 'Planned',
  IN_PROGRESS = 'In Progress',
  LIVE = 'Live',
  COMPLETED = 'Completed',
  ON_HOLD = 'On Hold',
}

export enum AuthApi {
  LOGIN = 'LOGIN',
}

export enum SuggestionApi {
  CREATE_SUGGESTION = 'CREATE_SUGGESTION',
  GET_SUGGESTION = 'GET_SUGGESTION',
  READ_BY_CATEGORY = 'READ_BY_CATEGORY',
  READ_BY_STATUS = 'READ_BY_STATUS',
  UPDATE_SUGGESTION = 'UPDATE_SUGGESTION',
  READ_TOP = 'READ_TOP',
  READ_ALL = 'READ_ALL',
}

export enum UserApi {
  CREATE_USER = 'CREATE_USER',
}

export enum UpvoteApi {
  UPVOTE_TOGGLE = 'UPVOTE_TOGGLE',
}

export enum CommentApi {
  ADD_COMMENT = 'ADD_COMMENT',
  ADD_CHILD_COMMENT = 'ADD_CHILD_COMMENT',
  READ_BY_SUGGESTION = 'READ_BY_SUGGESTION',
}

export enum FormTextTypes {
  TEXT = 'text',
  PASSWORD = 'password',
  EMAIL = 'email',
  URL = 'url',
  TEL = 'tel',
  NUMBER = 'number',
  SEARCH = 'search',
}

export enum FormDropDownOptions {
  CATEGORY = 'CATEGORY',
  STATUS = 'STATUS'
}

export enum AuthStatus {
  Unauthorized, 
  Authorized
}
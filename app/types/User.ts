import type { Suggestion, Comment } from ".";

export interface User {
    id: number;
    username: string;
    password?: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
    role: string;
    suggestions: Suggestion[],
    comments: Comment[],
    upvotes: Upvote[]
}

export interface Upvote {
    suggestion_id: number;
    user_id: number;
    id: number;
    active: boolean
  }
  
  
  
import { type Comment } from "./Comment";

export interface Suggestion {
  title: string;
  detail: string;
  category: string;
  status: string;
  completed: boolean;
  id: number;
  owner_id: number;
  comments: Comment[];
  upvote_count: number;
}
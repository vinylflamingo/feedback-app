export interface Comment {
    text: string;
    parent_comment_id: number | null;
    id: number;
    suggestion_id: number;
    user_id: number;
    created_at: string;
    children: Comment[];
  }
  
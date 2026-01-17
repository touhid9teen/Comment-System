export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
}


export interface CommentType {
  id: string;
  userId: string;
  user: User; 
  content: string;
  createdAt: string; 
  parentId: string | null;
  likes: string[]; 
  dislikes: string[];
  replies?: CommentType[]; 
}

export type SortOption = 'newest' | 'most-liked' | 'most-disliked';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
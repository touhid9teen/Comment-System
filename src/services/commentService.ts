import api from "../config/axios";
import { API_ENDPOINTS } from "../config/api";
import type { CommentType, SortOption } from "../types";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface GetCommentsParams {
  page?: number;
  limit?: number;
  sortBy?: SortOption;
}

export interface CommentsResponse {
  comments: CommentType[];
  total: number;
  page: number;
  totalPages: number;
}

export interface RepliesResponse {
  replies: CommentType[];
  total: number;
  page: number;
  totalPages: number;
}

class CommentService {
  /**
   * Create a new comment
   */
  async createComment(
    content: string,
    parentId?: string,
  ): Promise<CommentType> {
    const response = await api.post<ApiResponse<CommentType>>(
      API_ENDPOINTS.COMMENTS.BASE,
      {
        content,
        parentId: parentId || undefined,
      },
    );
    return response.data.data;
  }

  /**
   * Get all comments with pagination and sorting
   */
  async getComments(params: GetCommentsParams = {}): Promise<CommentsResponse> {
    const response = await api.get<ApiResponse<CommentsResponse>>(
      API_ENDPOINTS.COMMENTS.BASE,
      { params },
    );
    return response.data.data;
  }

  /**
   * Get a single comment by ID
   */
  async getCommentById(id: string): Promise<CommentType> {
    const response = await api.get<ApiResponse<CommentType>>(
      API_ENDPOINTS.COMMENTS.BY_ID(id),
    );
    return response.data.data;
  }

  /**
   * Update a comment
   */
  async updateComment(id: string, content: string): Promise<CommentType> {
    const response = await api.patch<ApiResponse<CommentType>>(
      API_ENDPOINTS.COMMENTS.BY_ID(id),
      {
        content,
      },
    );
    return response.data.data;
  }

  /**
   * Delete a comment (soft delete)
   */
  async deleteComment(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.COMMENTS.BY_ID(id));
  }

  /**
   * Like or Dislike a comment
   */
  async reactToComment(
    id: string,
    type: "like" | "dislike",
  ): Promise<CommentType> {
    const response = await api.post<ApiResponse<CommentType>>(
      API_ENDPOINTS.COMMENTS.REACT(id),
      { type },
    );
    return response.data.data;
  }

  /**
   * Get replies for a specific comment
   */
  async getReplies(
    id: string,
    params: { page?: number; limit?: number } = {},
  ): Promise<RepliesResponse> {
    const response = await api.get<ApiResponse<RepliesResponse>>(
      API_ENDPOINTS.COMMENTS.REPLIES(id),
      {
        params,
      },
    );
    return response.data.data;
  }
}

export const commentService = new CommentService();

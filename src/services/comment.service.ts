import api from "../config/axios";
import { API_ENDPOINTS } from "../config/api";
import type { CommentType } from "../types";

export const commentService = {
  // Get all comments (top-level)
  getAll: async (sort: string = "newest") => {
    const response = await api.get<{ success: boolean; data: CommentType[] }>(
      API_ENDPOINTS.COMMENTS.BASE,
      { params: { sort } },
    );
    return response.data;
  },

  // Get replies for a specific comment
  getReplies: async (id: string) => {
    const response = await api.get<{ success: boolean; data: CommentType[] }>(
      API_ENDPOINTS.COMMENTS.REPLIES(id),
    );
    return response.data;
  },

  // Create a new comment
  create: async (content: string) => {
    const response = await api.post<{ success: boolean; data: CommentType }>(
      API_ENDPOINTS.COMMENTS.BASE,
      { content },
    );
    return response.data;
  },

  // Reply to a comment
  reply: async (parentId: string, content: string) => {
    // The backend likely handles replies via the same create endpoint with parentId,
    // OR a specific endpoint. Based on typical patterns and previous context:
    // If I use the BASE endpoint with a parentId field:
    const response = await api.post<{ success: boolean; data: CommentType }>(
      API_ENDPOINTS.COMMENTS.BASE,
      { content, parentId },
    );
    return response.data;
  },

  // Update a comment
  update: async (id: string, content: string) => {
    const response = await api.patch<{ success: boolean; data: CommentType }>(
      API_ENDPOINTS.COMMENTS.BY_ID(id),
      { content },
    );
    return response.data;
  },

  // Delete a comment
  delete: async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(
      API_ENDPOINTS.COMMENTS.BY_ID(id),
    );
    return response.data;
  },

  // React to a comment
  react: async (id: string, type: "like" | "dislike") => {
    const response = await api.post<{ success: boolean; data: CommentType }>(
      API_ENDPOINTS.COMMENTS.REACT(id),
      { type },
    );
    return response.data;
  },
};

import api from "../config/axios";
import { API_ENDPOINTS } from "../config/api";
import type { User } from "../types";

class AuthService {
  /**
   * Initiate Google Login flow
   */
  loginWithGoogle(): void {
    window.location.href = API_ENDPOINTS.AUTH.GOOGLE;
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ success: boolean; data: User }>(
      API_ENDPOINTS.AUTH.PROFILE,
    );
    return response.data.data;
  }

  /**
   * Logout the user
   */
  async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    window.location.href = "/"; // Redirect to home after logout
  }
}

export const authService = new AuthService();

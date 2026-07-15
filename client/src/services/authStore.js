import { create } from "zustand";
import authService from "./authService.js";

/**
 * Zustand global store for managing user authentication state.
 */
export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,

  /**
   * Handle user login request.
   * @param {string} email - User email
   * @param {string} password - User password
   */
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(email, password);
      const { token, user } = response;

      localStorage.setItem("token", token);
      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      return true;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Login failed. Please check your credentials.";
      set({ isLoading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  /**
   * Handle user registration request.
   * @param {string} name - User's full name
   * @param {string} email - User email
   * @param {string} password - User password
   */
  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register(name, email, password);
      set({ isLoading: false, error: null });
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed. Please try again.";
      set({ isLoading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  /**
   * Clear auth session.
   */
  logout: () => {
    localStorage.removeItem("token");
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null
    });
  },

  /**
   * Verify session token and retrieve user profile details.
   */
  checkAuth: async () => {
    const token = get().token;
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await authService.getProfile();
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false
      });
    } catch {
      // Token expired or invalid
      localStorage.removeItem("token");
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  },

  /**
   * Update user profile settings (including name, email, geminiApiKey).
   */
  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.updateProfile(profileData);
      set({
        user: response.data,
        isLoading: false
      });
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update profile settings.";
      set({ isLoading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  }
}));

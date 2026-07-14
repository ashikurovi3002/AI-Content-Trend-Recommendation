import api from "./api.js";

const authService = {
  /**
   * Register a new user.
   * @param {string} name - Full name of the user
   * @param {string} email - Email address
   * @param {string} password - User password
   * @returns {Promise<object>} Response data
   */
  register: async (name, email, password) => {
    const response = await api.post("/api/auth/register", { name, email, password });
    return response.data;
  },

  /**
   * Login an existing user.
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} Response data containing token and user profile
   */
  login: async (email, password) => {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  },

  /**
   * Fetch authenticated user profile.
   * @returns {Promise<object>} User profile details
   */
  getProfile: async () => {
    const response = await api.get("/api/auth/profile");
    return response.data;
  }
};

export default authService;

import api from "./api.js";

const sourceService = {
  /**
   * Fetch all content sources.
   * @returns {Promise<Array>} Array of sources
   */
  getSources: async () => {
    const response = await api.get("/api/sources");
    return response.data.data;
  },

  /**
   * Create a new content source.
   * @param {object} sourceData - Source details (name, type, url, category)
   * @returns {Promise<object>} Created source object
   */
  createSource: async (sourceData) => {
    const response = await api.post("/api/sources", sourceData);
    return response.data.data;
  },

  /**
   * Update details of an existing source.
   * @param {string} id - Source ID
   * @param {object} sourceData - Fields to update
   * @returns {Promise<object>} Updated source object
   */
  updateSource: async (id, sourceData) => {
    const response = await api.put(`/api/sources/${id}`, sourceData);
    return response.data.data;
  },

  /**
   * Delete a content source.
   * @param {string} id - Source ID
   * @returns {Promise<object>} Deletion response
   */
  deleteSource: async (id) => {
    const response = await api.delete(`/api/sources/${id}`);
    return response.data;
  },

  /**
   * Pause a monitored source.
   * @param {string} id - Source ID
   * @returns {Promise<object>} Updated source object
   */
  pauseSource: async (id) => {
    const response = await api.patch(`/api/sources/${id}/pause`);
    return response.data.data;
  },

  /**
   * Resume a paused source.
   * @param {string} id - Source ID
   * @returns {Promise<object>} Updated source object
   */
  resumeSource: async (id) => {
    const response = await api.patch(`/api/sources/${id}/resume`);
    return response.data.data;
  }
};

export default sourceService;

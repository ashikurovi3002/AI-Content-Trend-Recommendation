import Source from "../models/Source.js";

/**
 * Service to handle business logic for Content Sources.
 */
class SourceService {
  /**
   * Create a new content source.
   * @param {string} userId - ID of the creating user
   * @param {object} sourceData - Fields of the new source
   * @returns {Promise<object>} Created source document
   */
  async createSource(userId, sourceData) {
    const { name, type, url, category } = sourceData;

    // Check for duplicate sources for the same user (url match)
    const existingSource = await Source.findOne({
      userId,
      url: url.trim()
    });

    if (existingSource) {
      const error = new Error("Source with this URL already exists in your list");
      error.status = 409; // HTTP 409 Conflict
      throw error;
    }

    const source = new Source({
      userId,
      name,
      type,
      url: url.trim(),
      category,
      status: "active"
    });

    await source.save();
    return source;
  }

  /**
   * Retrieve all sources belonging to a user.
   * @param {string} userId - User's ID
   * @returns {Promise<Array>} Array of source documents
   */
  async getSources(userId) {
    return await Source.find({ userId }).sort({ createdAt: -1 });
  }

  /**
   * Update details of an existing source.
   * @param {string} userId - User's ID (for ownership confirmation)
   * @param {string} sourceId - ID of the source to update
   * @param {object} updateData - Updated source properties
   * @returns {Promise<object>} Updated source document
   */
  async updateSource(userId, sourceId, updateData) {
    const source = await Source.findOne({ _id: sourceId, userId });
    if (!source) {
      const error = new Error("Source not found or access denied");
      error.status = 404;
      throw error;
    }

    // If URL is being updated, check for duplicates (excluding current source)
    if (updateData.url !== undefined) {
      const trimmedUrl = updateData.url.trim();
      const duplicateSource = await Source.findOne({
        userId,
        url: trimmedUrl,
        _id: { $ne: sourceId }
      });

      if (duplicateSource) {
        const error = new Error("Source with this URL already exists in your list");
        error.status = 409; // HTTP 409 Conflict
        throw error;
      }
      source.url = trimmedUrl;
    }

    // Only allow updating editable fields
    const editableFields = ["name", "category", "status"];
    editableFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        source[field] = updateData[field];
      }
    });

    await source.save();
    return source;
  }

  /**
   * Delete a content source from the database.
   * @param {string} userId - User's ID (for ownership confirmation)
   * @param {string} sourceId - ID of the source to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteSource(userId, sourceId) {
    const result = await Source.deleteOne({ _id: sourceId, userId });
    if (result.deletedCount === 0) {
      const error = new Error("Source not found or access denied");
      error.status = 404;
      throw error;
    }
    return true;
  }

  /**
   * Pause a monitored source.
   * @param {string} userId - User's ID
   * @param {string} sourceId - Source ID
   * @returns {Promise<object>} Updated source document
   */
  async pauseSource(userId, sourceId) {
    return await this.updateSource(userId, sourceId, { status: "paused" });
  }

  /**
   * Resume a paused source.
   * @param {string} userId - User's ID
   * @param {string} sourceId - Source ID
   * @returns {Promise<object>} Updated source document
   */
  async resumeSource(userId, sourceId) {
    return await this.updateSource(userId, sourceId, { status: "active" });
  }
}

export default new SourceService();

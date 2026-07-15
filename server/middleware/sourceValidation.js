/**
 * Middleware to validate source creation requests.
 */
export const validateCreateSource = (req, res, next) => {
  const { name, type, url, category } = req.body;
  const errors = {};

  if (!name || typeof name !== "string" || name.trim() === "") {
    errors.name = "Source name is required";
  }

  if (!type || !["website", "youtube", "facebook"].includes(type)) {
    errors.type = "Source type must be 'website', 'youtube', or 'facebook'";
  }

  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .@+-]*)*\/?$/;
  if (!url || typeof url !== "string" || !urlRegex.test(url)) {
    errors.url = "A valid source URL is required (e.g., https://example.com)";
  }

  if (!category || typeof category !== "string" || category.trim() === "") {
    errors.category = "Category is required";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: errors
    });
  }

  next();
};

/**
 * Middleware to validate source update requests.
 */
export const validateUpdateSource = (req, res, next) => {
  const { name, type, url, category, status } = req.body;
  const errors = {};

  if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
    errors.name = "Source name cannot be empty";
  }

  if (type !== undefined && !["website", "youtube", "facebook"].includes(type)) {
    errors.type = "Source type must be 'website', 'youtube', or 'facebook'";
  }

  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .@+-]*)*\/?$/;
  if (url !== undefined && (typeof url !== "string" || !urlRegex.test(url))) {
    errors.url = "Please provide a valid source URL";
  }

  if (category !== undefined && (typeof category !== "string" || category.trim() === "")) {
    errors.category = "Category cannot be empty";
  }

  if (status !== undefined && !["active", "paused", "error"].includes(status)) {
    errors.status = "Status must be 'active', 'paused', or 'error'";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: errors
    });
  }

  next();
};

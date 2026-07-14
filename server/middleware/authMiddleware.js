import jwt from "jsonwebtoken";

/**
 * Middleware to protect routes using JWT authentication.
 */
export const protect = (req, res, next) => {
  let token;

  // Check authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token missing"
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallbacksecret");
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid or expired"
    });
  }
};

/**
 * Normalizes a URL to ensure consistent formatting for duplicate checking.
 * Cleans trailing slashes, lowercases the hostname, and strips common tracking parameters.
 * @param {string} urlStr - Raw URL string
 * @returns {string} Normalized URL
 */
export const normalizeUrl = (urlStr) => {
  if (!urlStr || typeof urlStr !== "string") return "";

  try {
    const url = new URL(urlStr.trim());

    // Normalize scheme and host (URL class automatically lowercases)
    let normalized = `${url.protocol}//${url.hostname}`;
    if (url.port) {
      normalized += `:${url.port}`;
    }

    // Normalize path (strip trailing slash)
    let pathname = url.pathname;
    if (pathname.length > 1 && pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }
    normalized += pathname;

    // Remove tracking query parameters (UTM, etc.)
    const searchParams = new URLSearchParams(url.search);
    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
      "gclid"
    ];
    trackingParams.forEach((param) => searchParams.delete(param));

    const searchStr = searchParams.toString();
    if (searchStr) {
      normalized += `?${searchStr}`;
    }

    return normalized;
  } catch {
    // Fallback normalization if URL parsing fails
    let fallback = urlStr.trim().toLowerCase();
    if (fallback.endsWith("/")) {
      fallback = fallback.slice(0, -1);
    }
    return fallback;
  }
};

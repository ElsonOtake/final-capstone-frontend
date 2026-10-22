// src/utils/auth.js

/**
 * Safely decodes the payload of a JWT without external libraries.
 * @param {string} token
 * @returns {object|null} Decoded JSON payload or null if invalid
 */
export const decodeTokenPayload = (token) => {
  try {
    if (!token || typeof token !== 'string') return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Decode Base64Url string
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(''),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT payload:', error);
    return null;
  }
};

/**
 * Checks if a JWT token string or decoded timestamp is expired.
 * @param {string|number} tokenOrExp - The JWT string OR the numeric 'exp' timestamp in seconds
 * @param {number} bufferSeconds - Safety margin in seconds
 * (default: 10s to prevent edge-case race conditions)
 * @returns {boolean} True if token is missing, malformed, or expired
 */
export const isTokenExpired = (tokenOrExp, bufferSeconds = 10) => {
  if (!tokenOrExp) return true;

  let expTimestamp = tokenOrExp;

  // If passed a full token string instead of a numeric timestamp
  if (typeof tokenOrExp === 'string') {
    const payload = decodeTokenPayload(tokenOrExp);
    if (!payload || !payload.exp) return true;
    expTimestamp = payload.exp;
  }

  const currentTimeInSeconds = Math.floor(Date.now() / 1000);

  // JWT 'exp' is in seconds, so compare against current unix timestamp (with safety buffer)
  return expTimestamp - bufferSeconds <= currentTimeInSeconds;
};

/**
 * Retrieves the stored user object from localStorage, verifies token expiration,
 * and automatically purges localStorage if the session is invalid or expired.
 *
 * @param {string} key - localStorage key (default: 'current_user')
 * @returns {object|null} Valid user object or null if expired/missing
 */
export const getValidAuthSession = (key = 'current_user') => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const userData = JSON.parse(item);

    // Verify token presence
    if (!userData || !userData.token) {
      localStorage.removeItem(key);
      return null;
    }

    // Check expiration using the embedded JWT payload or top-level 'exp' field
    const tokenPayload = decodeTokenPayload(userData.token);
    const exp = tokenPayload?.exp
      || (userData.exp ? new Date(userData.exp).getTime() / 1000 : null);

    if (isTokenExpired(exp)) {
      console.warn('Session expired. Purging stored credentials.');
      localStorage.removeItem(key);
      return null;
    }

    // Return authenticated session object
    return userData;
  } catch (error) {
    console.error('Error reading auth session from localStorage:', error);
    localStorage.removeItem(key);
    return null;
  }
};

/**
 * Clears stored auth session and redirects to login
 */
export const clearAuthSession = (key = 'current_user', redirectUrl = '/login') => {
  localStorage.removeItem(key);
  if (window.location.pathname !== redirectUrl) {
    window.location.href = redirectUrl;
  }
};

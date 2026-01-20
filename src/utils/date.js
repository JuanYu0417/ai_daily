/**
 * Date Utility
 *
 * Provides standardized date formatting functions
 */

/**
 * Get current date in YYYY-MM-DD format
 */
export function getCurrentDate() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

/**
 * Get current timestamp in ISO format
 */
export function getCurrentTimestamp() {
  return new Date().toISOString();
}

/**
 * Format a date object to YYYY-MM-DD
 * @param {Date|string} date
 */
export function formatDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().slice(0, 10);
}

/**
 * Format a date object to YYYY-MM-DD HH:mm:ss
 * @param {Date|string} date
 */
export function formatDateTime(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().replace("T", " ").split(".")[0];
}

export function getDateBefore(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}
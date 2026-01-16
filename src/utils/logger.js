/**
 * Logger Utility
 *
 * Unified logging for AI Daily Calendar
 * Supports levels: info, warn, error
 */

const LOG_LEVELS = ["info", "warn", "error"];
const CURRENT_LEVEL = process.env.LOG_LEVEL || "info";

/**
 * Check if a message should be logged based on current level
 */
function shouldLog(level) {
  const currentIndex = LOG_LEVELS.indexOf(CURRENT_LEVEL);
  const messageIndex = LOG_LEVELS.indexOf(level);
  return messageIndex >= currentIndex;
}

/**
 * Info log
 */
export function info(...args) {
  if (shouldLog("info")) {
    console.log("ℹ", ...args);
  }
}

/**
 * Warning log
 */
export function warn(...args) {
  if (shouldLog("warn")) {
    console.warn("⚠", ...args);
  }
}

/**
 * Error log
 */
export function error(...args) {
  if (shouldLog("error")) {
    console.error("❌", ...args);
  }
}

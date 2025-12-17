/**
 * Centralized logger utility for production-safe logging.
 * Respects NODE_ENV to suppress logs in production.
 */
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args) => {
    if (isDev) console.log(...args);
  },
  info: (...args) => {
    if (isDev) console.info(...args);
  },
  warn: (...args) => {
    if (isDev) console.warn(...args);
  },
  error: (...args) => {
    // We keep error logs in production as they are critical
    console.error(...args);
  },
  debug: (...args) => {
    if (isDev) (console.debug || console.log)(...args);
  }
};

export default logger;

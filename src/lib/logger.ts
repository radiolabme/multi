import log from 'loglevel';
// @ts-ignore - no types available for loglevel-plugin-remote
import remote from 'loglevel-plugin-remote';

// Store original console methods BEFORE any interception
const originalConsole = {
  log: console.log,
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

// Configure remote logging plugin with error handling
try {
  remote.apply(log, {
    url: '/api/client-logs',
    method: 'POST',
    level: 'trace',
    interval: 5000,
    capacity: 10,
    format: remote.json,
    headers: {
      'Content-Type': 'application/json',
    },
    onUnhandledError: (error: Error) => {
      // Silently fail if remote logging endpoint unavailable (e.g., in tests)
      // Use ORIGINAL console to avoid infinite loops
      if (error.message && !error.message.includes('Failed to fetch')) {
        originalConsole.warn('Remote logging error:', error.message);
      }
    },
  });
} catch (error) {
  // Remote plugin setup failed, continue with local logging only
  originalConsole.warn('Failed to setup remote logging:', error);
}

// Set default log level (can be changed based on environment)
log.setLevel(log.levels.TRACE);

// Intercept native console methods to send to remote logging

let isLogging = false;

console.log = (...args: any[]) => {
  originalConsole.log(...args);
  if (!isLogging) {
    isLogging = true;
    try {
      log.debug('[console.log]', ...args);
    } finally {
      isLogging = false;
    }
  }
};

console.debug = (...args: any[]) => {
  originalConsole.debug(...args);
  if (!isLogging) {
    isLogging = true;
    try {
      log.debug('[console.debug]', ...args);
    } finally {
      isLogging = false;
    }
  }
};

console.info = (...args: any[]) => {
  originalConsole.info(...args);
  if (!isLogging) {
    isLogging = true;
    try {
      log.info('[console.info]', ...args);
    } finally {
      isLogging = false;
    }
  }
};

console.warn = (...args: any[]) => {
  originalConsole.warn(...args);
  if (!isLogging) {
    isLogging = true;
    try {
      log.warn('[console.warn]', ...args);
    } finally {
      isLogging = false;
    }
  }
};

console.error = (...args: any[]) => {
  originalConsole.error(...args);
  if (!isLogging) {
    isLogging = true;
    try {
      log.error('[console.error]', ...args);
    } finally {
      isLogging = false;
    }
  }
};

// Setup global error handlers
window.addEventListener('error', (event) => {
  log.error('Unhandled error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error?.stack || event.error,
  });
});

window.addEventListener('unhandledrejection', (event) => {
  log.error('Unhandled promise rejection:', {
    reason: event.reason instanceof Error ? event.reason.stack : event.reason,
  });
});

export default log;

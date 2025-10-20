import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

// Plugin to handle client logging
function clientLoggingPlugin(): Plugin {
  const LOG_FILE = path.join(process.cwd(), 'logs', 'client-logs.txt');

  // Ensure log directory exists
  if (!fs.existsSync(path.dirname(LOG_FILE))) {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  }

  // Create log file if it doesn't exist
  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, `=== Client Logs Started at ${new Date().toISOString()} ===\n\n`);
  }

  return {
    name: 'client-logging',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/client-logs' && req.method === 'POST') {
          let body = '';

          req.on('data', (chunk) => {
            body += chunk.toString();
          });

          req.on('end', () => {
            try {
              const { logs } = JSON.parse(body);

              if (!logs || !Array.isArray(logs)) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid logs format' }));
                return;
              }

              // Format logs for console and file
              logs.forEach((log: any) => {
                const timestamp = log.timestamp || new Date().toISOString();
                const level = (log.level || 'log').toUpperCase();
                const message = log.message || '';
                const logger = log.logger ? `[${log.logger}] ` : '';
                const stacktrace = log.stacktrace ? `\n${log.stacktrace}` : '';

                const formattedLog = `[${timestamp}] [${level}] ${logger}${message}${stacktrace}\n`;

                // Log to console with color
                const colorMap: Record<string, string> = {
                  TRACE: '\x1b[90m', // Gray
                  DEBUG: '\x1b[37m', // White
                  INFO: '\x1b[36m', // Cyan
                  WARN: '\x1b[33m', // Yellow
                  ERROR: '\x1b[31m', // Red
                };
                const color = colorMap[level] || '\x1b[37m';
                const reset = '\x1b[0m';
                console.log(`${color}${formattedLog.trim()}${reset}`);

                // Append to file
                fs.appendFileSync(LOG_FILE, formattedLog);
              });

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, count: logs.length }));
            } catch (error) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Failed to process logs' }));
            }
          });
        } else {
          next();
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), clientLoggingPlugin()],
  server: {
    port: 3000,
    strictPort: false,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});

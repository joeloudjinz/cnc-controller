import express, { Request, Response } from 'express';
import path from 'path';
import { config } from './config/env';
import { limiter, sanitizeMongo, sanitizeXss, preventParamPollution, securityHeaders } from './middleware/security';
import { initializeDatabase } from './database/data-source';
import { globalErrorHandler } from './errors/AppError';

const app = express();

// Apply security middleware
app.use(securityHeaders); // Helmet security headers
app.use(limiter); // Rate limiting
app.use(sanitizeMongo); // Sanitize data against NoSQL injection
app.use(sanitizeXss); // Sanitize data against XSS
app.use(preventParamPollution); // Prevent parameter pollution

// Parse JSON bodies
app.use(express.json({ limit: '10mb' })); // Using express.json instead of body-parser

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Basic route
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'CNC Controller API is running!' });
});

// Error handling middleware
app.use(globalErrorHandler);

const PORT = config.PORT;

// Initialize database and start the server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${config.NODE_ENV} mode`);
  });
});

export default app;
export { app };

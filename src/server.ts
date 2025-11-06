import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { config } from './config/env';
import { limiter, sanitizeMongo, sanitizeXss, preventParamPollution, securityHeaders } from './middleware/security';

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
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = config.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${config.NODE_ENV} mode`);
});

export default app;
export { server };

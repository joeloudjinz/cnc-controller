import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import helmet from 'helmet';

// Rate limiting middleware
export const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per windowMs
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again later.',
});

// Data sanitization against NoSQL query injection
export const sanitizeMongo = mongoSanitize();

// Data sanitization against XSS
export const sanitizeXss = xss();

// Prevent parameter pollution
export const preventParamPollution = hpp();

// Enable CORS with options
export const corsOptions = cors({
  origin: (origin, callback) => {
    // In production, replace with your frontend domain
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:8080',
      'http://localhost:8081',
      process.env.FRONTEND_URL || '',
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});

// Enhanced security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://*.amazonaws.com'], // Allow connections to AWS services if needed
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for local development
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true,
  },
  frameguard: {
    action: 'deny',
  },
  referrerPolicy: {
    policy: 'no-referrer',
  },
});

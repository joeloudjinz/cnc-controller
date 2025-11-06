import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

// Generic validation middleware using Zod
export const validateWithZod = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((issue: any) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        res.status(400).json({
          message: 'Validation failed',
          errors,
        });
        return;
      }

      res.status(500).json({
        message: 'Internal server error',
      });
    }
  };
};

// Specific middleware for input sanitization
export const sanitizeInput = (_req: Request, _res: Response, next: NextFunction) => {
  // Sanitize specific fields if present
  // This function would have logic to sanitize fields in the request
  // For now, we just call next, but the logic would go here
  next();
};

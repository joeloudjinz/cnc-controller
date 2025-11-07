// Base custom error class
export abstract class AppError extends Error {
  public readonly errorName: string;
  public readonly httpCode: number;
  public readonly isOperational: boolean;

  constructor(name: string, httpCode: number, description: string, isOperational = true) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.errorName = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }

  override get name(): string {
    return this.errorName;
  }
}

// File-related errors
export class FileProcessingError extends AppError {
  constructor(description: string = 'Error processing file') {
    super('FILE_PROCESSING_ERROR', 500, description);
  }
}

export class FileUploadError extends AppError {
  constructor(description: string = 'Error uploading file') {
    super('FILE_UPLOAD_ERROR', 400, description);
  }
}

export class FileNotFoundError extends AppError {
  constructor(filePath: string) {
    super('FILE_NOT_FOUND_ERROR', 404, `File not found: ${filePath}`);
  }
}

export class FileConversionError extends AppError {
  constructor(description: string = 'Error converting file') {
    super('FILE_CONVERSION_ERROR', 500, description);
  }
}

// Authentication-related errors
export class InvalidCredentialsError extends AppError {
  constructor(description: string = 'Invalid credentials') {
    super('INVALID_CREDENTIALS_ERROR', 401, description);
  }
}

export class TokenExpiredError extends AppError {
  constructor(description: string = 'Token has expired') {
    super('TOKEN_EXPIRED_ERROR', 401, description);
  }
}

export class InvalidTokenError extends AppError {
  constructor(description: string = 'Invalid token') {
    super('INVALID_TOKEN_ERROR', 401, description);
  }
}

// Authorization-related errors
export class InsufficientPermissionsError extends AppError {
  constructor(description: string = 'Insufficient permissions') {
    super('INSUFFICIENT_PERMISSIONS_ERROR', 403, description);
  }
}

// Rate limiting errors
export class RateLimitError extends AppError {
  constructor(description: string = 'Rate limit exceeded') {
    super('RATE_LIMIT_ERROR', 429, description);
  }
}

// Database-related errors
export class DatabaseConnectionError extends AppError {
  constructor(description: string = 'Database connection failed') {
    super('DATABASE_CONNECTION_ERROR', 500, description);
  }
}

export class EntityNotFoundError extends AppError {
  constructor(entityName: string, id: number | string) {
    super('ENTITY_NOT_FOUND_ERROR', 404, `${entityName} with ID ${id} not found`);
  }
}

export class ValidationError extends AppError {
  constructor(description: string) {
    super('VALIDATION_ERROR', 400, description);
  }
}

export class DuplicateEntityError extends AppError {
  constructor(entityName: string, field: string, value: string) {
    super('DUPLICATE_ENTITY_ERROR', 409, `${entityName} with ${field} '${value}' already exists`);
  }
}

export class UnauthorizedError extends AppError {
  constructor(description: string = 'Unauthorized access') {
    super('UNAUTHORIZED_ERROR', 401, description);
  }
}

export class ForbiddenError extends AppError {
  constructor(description: string = 'Forbidden access') {
    super('FORBIDDEN_ERROR', 403, description);
  }
}

// Global error handler middleware
export const globalErrorHandler = (
  err: Error,
  _req: any,
  res: any,
  _next: any
) => {
  if (err instanceof AppError) {
    return res.status(err.httpCode).json({
      status: 'error',
      statusCode: err.httpCode,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Handle TypeORM errors
  if (err.name === 'QueryFailedError') {
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Database query failed',
      details: err.message,
    });
  }

  // Handle validation errors from Zod
  if ((err as any).name === 'ZodError') {
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Validation failed',
      details: (err as any).errors,
    });
  }

  // Default error
  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
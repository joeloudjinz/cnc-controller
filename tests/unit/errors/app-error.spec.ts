import { 
  FileProcessingError, 
  FileUploadError, 
  FileNotFoundError, 
  FileConversionError,
  InvalidCredentialsError,
  TokenExpiredError,
  InvalidTokenError,
  InsufficientPermissionsError,
  RateLimitError,
  DatabaseConnectionError,
  EntityNotFoundError,
  ValidationError,
  DuplicateEntityError,
  UnauthorizedError,
  ForbiddenError,
  globalErrorHandler
} from '../../../src/errors/AppError';

describe('AppError Extensions', () => {
  describe('Specific Error Classes', () => {
    it('should create FileProcessingError', () => {
      const error = new FileProcessingError();
      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('FileProcessingError');
      expect(error.message).toBe('Error processing file');
    });

    it('should create FileProcessingError with custom message', () => {
      const error = new FileProcessingError('Custom processing error');
      expect(error.message).toBe('Custom processing error');
    });

    it('should create FileUploadError', () => {
      const error = new FileUploadError();
      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('FileUploadError');
      expect(error.message).toBe('Error uploading file');
    });

    it('should create FileUploadError with custom message', () => {
      const error = new FileUploadError('Custom upload error');
      expect(error.message).toBe('Custom upload error');
    });

    it('should create FileNotFoundError', () => {
      const error = new FileNotFoundError('/path/to/file');
      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('FileNotFoundError');
      expect(error.message).toBe('File not found: /path/to/file');
    });

    it('should create FileConversionError', () => {
      const error = new FileConversionError();
      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('FileConversionError');
      expect(error.message).toBe('Error converting file');
    });

    it('should create InvalidCredentialsError', () => {
      const error = new InvalidCredentialsError();
      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('InvalidCredentialsError');
      expect(error.message).toBe('Invalid credentials');
    });

    it('should create TokenExpiredError', () => {
      const error = new TokenExpiredError();
      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('TokenExpiredError');
      expect(error.message).toBe('Token has expired');
    });

    it('should create InvalidTokenError', () => {
      const error = new InvalidTokenError();
      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('InvalidTokenError');
      expect(error.message).toBe('Invalid token');
    });

    it('should create InsufficientPermissionsError', () => {
      const error = new InsufficientPermissionsError();
      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('InsufficientPermissionsError');
      expect(error.message).toBe('Insufficient permissions');
    });

    it('should create RateLimitError', () => {
      const error = new RateLimitError();
      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('RateLimitError');
      expect(error.message).toBe('Rate limit exceeded');
    });

    it('should create DatabaseConnectionError', () => {
      const error = new DatabaseConnectionError();
      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('DatabaseConnectionError');
      expect(error.message).toBe('Database connection failed');
    });

    it('should create EntityNotFoundError', () => {
      const error = new EntityNotFoundError('User', 123);
      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('EntityNotFoundError');
      expect(error.message).toBe('User with ID 123 not found');
    });

    it('should create ValidationError', () => {
      const error = new ValidationError('Validation failed');
      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('ValidationError');
      expect(error.message).toBe('Validation failed');
    });

    it('should create DuplicateEntityError', () => {
      const error = new DuplicateEntityError('User', 'email', 'test@example.com');
      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('DuplicateEntityError');
      expect(error.message).toBe('User with email \'test@example.com\' already exists');
    });

    it('should create UnauthorizedError', () => {
      const error = new UnauthorizedError();
      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('UnauthorizedError');
      expect(error.message).toBe('Unauthorized access');
    });

    it('should create ForbiddenError', () => {
      const error = new ForbiddenError();
      expect(error).toBeInstanceOf(Error);
      expect(error.constructor.name).toBe('ForbiddenError');
      expect(error.message).toBe('Forbidden access');
    });
  });

  describe('Global Error Handler', () => {
    let mockReq: any;
    let mockRes: any;
    let mockNext: any;

    beforeEach(() => {
      mockReq = {};
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });

    it('should handle AppError correctly', () => {
      const appError = new ValidationError('Something went wrong');

      globalErrorHandler(appError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        statusCode: 400,
        message: 'Something went wrong',
      });
    });

    it('should handle TypeORM QueryFailedError', () => {
      const queryFailedError = new Error('Query failed');
      (queryFailedError as any).name = 'QueryFailedError';
      queryFailedError.message = 'Duplicate entry';

      globalErrorHandler(queryFailedError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        statusCode: 400,
        message: 'Database query failed',
        details: 'Duplicate entry',
      });
    });

    it('should handle ZodError', () => {
      const zodError = new Error('Zod validation failed');
      (zodError as any).name = 'ZodError';
      (zodError as any).errors = [
        { path: ['field'], message: 'Invalid value' },
        { path: ['anotherField'], message: 'Required' }
      ];

      globalErrorHandler(zodError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        statusCode: 400,
        message: 'Validation failed',
        details: [
          { path: ['field'], message: 'Invalid value' },
          { path: ['anotherField'], message: 'Required' }
        ],
      });
    });

    it('should handle generic errors', () => {
      const genericError = new Error('Generic error');

      globalErrorHandler(genericError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        statusCode: 500,
        message: 'Internal server error',
      });
    });

    it('should include stack trace in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      try {
        const genericError = new Error('Generic error');
        genericError.stack = 'Error stack trace';
        
        globalErrorHandler(genericError, mockReq, mockRes, mockNext);
        
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
          status: 'error',
          statusCode: 500,
          message: 'Internal server error',
          stack: 'Error stack trace',
        });
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });
  });
});
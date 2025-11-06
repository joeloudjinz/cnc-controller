import {
  AppError,
  DatabaseConnectionError,
  EntityNotFoundError,
  ValidationError,
  DuplicateEntityError,
  UnauthorizedError,
  ForbiddenError,
  globalErrorHandler
} from '../../../src/errors/AppError';

describe('Custom Error Classes', () => {
  describe('AppError', () => {
    it('should create an instance with the correct properties', () => {
      const error = new TestAppError('TEST_ERROR', 400, 'Test error message');
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.errorName).toBe('TEST_ERROR');
      expect(error.httpCode).toBe(400);
      expect(error.message).toBe('Test error message');
      expect(error.isOperational).toBe(true);
    });

    it('should set isOperational to false when specified', () => {
      const error = new TestAppError('TEST_ERROR', 400, 'Test error message', false);
      
      expect(error.isOperational).toBe(false);
    });

    it('should return the correct name', () => {
      const error = new TestAppError('TEST_ERROR', 400, 'Test error message');
      
      expect(error.name).toBe('TEST_ERROR');  // The name property returns errorName
    });
  });

  describe('DatabaseConnectionError', () => {
    it('should create with correct defaults', () => {
      const error = new DatabaseConnectionError();
      
      expect(error.errorName).toBe('DATABASE_CONNECTION_ERROR');
      expect(error.httpCode).toBe(500);
      expect(error.message).toBe('Database connection failed');
    });

    it('should accept custom message', () => {
      const error = new DatabaseConnectionError('Custom connection error');
      
      expect(error.message).toBe('Custom connection error');
    });
  });

  describe('EntityNotFoundError', () => {
    it('should format the message correctly', () => {
      const error = new EntityNotFoundError('User', 123);
      
      expect(error.errorName).toBe('ENTITY_NOT_FOUND_ERROR');
      expect(error.httpCode).toBe(404);
      expect(error.message).toBe('User with ID 123 not found');
    });

    it('should work with string IDs', () => {
      const error = new EntityNotFoundError('User', 'abc123');
      
      expect(error.message).toBe('User with ID abc123 not found');
    });
  });

  describe('ValidationError', () => {
    it('should create with correct properties', () => {
      const error = new ValidationError('Invalid field value');
      
      expect(error.errorName).toBe('VALIDATION_ERROR');
      expect(error.httpCode).toBe(400);
      expect(error.message).toBe('Invalid field value');
    });
  });

  describe('DuplicateEntityError', () => {
    it('should format the message correctly', () => {
      const error = new DuplicateEntityError('User', 'email', 'test@example.com');
      
      expect(error.errorName).toBe('DUPLICATE_ENTITY_ERROR');
      expect(error.httpCode).toBe(409);
      expect(error.message).toBe('User with email \'test@example.com\' already exists');
    });
  });

  describe('UnauthorizedError', () => {
    it('should create with correct defaults', () => {
      const error = new UnauthorizedError();
      
      expect(error.errorName).toBe('UNAUTHORIZED_ERROR');
      expect(error.httpCode).toBe(401);
      expect(error.message).toBe('Unauthorized access');
    });

    it('should accept custom message', () => {
      const error = new UnauthorizedError('Custom auth error');
      
      expect(error.message).toBe('Custom auth error');
    });
  });

  describe('ForbiddenError', () => {
    it('should create with correct defaults', () => {
      const error = new ForbiddenError();
      
      expect(error.errorName).toBe('FORBIDDEN_ERROR');
      expect(error.httpCode).toBe(403);
      expect(error.message).toBe('Forbidden access');
    });

    it('should accept custom message', () => {
      const error = new ForbiddenError('Custom forbidden error');
      
      expect(error.message).toBe('Custom forbidden error');
    });
  });

  describe('globalErrorHandler', () => {
    it('should handle AppError correctly', () => {
      const error = new ValidationError('Test validation error');
      const mockResponse: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const mockNext = jest.fn();

      globalErrorHandler(error, null, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        statusCode: 400,
        message: 'Test validation error'
      });
    });

    it('should handle TypeORM QueryFailedError correctly', () => {
      const error = new Error('Duplicate entry');
      error.name = 'QueryFailedError';
      const mockResponse: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const mockNext = jest.fn();

      globalErrorHandler(error, null, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        statusCode: 400,
        message: 'Database query failed',
        details: 'Duplicate entry'
      });
    });

    it('should handle generic errors correctly', () => {
      const error = new Error('Generic error');
      const mockResponse: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const mockNext = jest.fn();

      globalErrorHandler(error, null, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'error',
        statusCode: 500,
        message: 'Internal server error'
      });
    });
  });
});

// Helper class for testing base AppError
class TestAppError extends AppError {
  constructor(name: string, httpCode: number, description: string, isOperational = true) {
    super(name, httpCode, description, isOperational);
    Object.setPrototypeOf(this, TestAppError.prototype);
  }
}
import { BaseService } from '../../../src/services/base/BaseService';

// Create a concrete implementation of BaseService for testing
class TestService extends BaseService {
  // This allows us to access protected methods for testing
  public testSanitizeForResponse<T>(entity: T): T {
    return this.sanitizeForResponse(entity);
  }

  public testPrepareForResponse<T>(entity: T): Partial<T> {
    return this.prepareForResponse(entity);
  }

  public testPrepareCollectionForResponse<T>(entities: T[]): Partial<T>[] {
    return this.prepareCollectionForResponse(entities);
  }

  public testValidateId(id: number): void {
    this.validateId(id);
  }
}

describe('BaseService', () => {
  let baseService: TestService;

  beforeEach(() => {
    baseService = new TestService();
  });

  describe('sanitizeForResponse', () => {
    it('should remove sensitive fields from an entity', () => {
      const entity = {
        id: 1,
        name: 'Test User',
        password: 'secret123',
        refreshToken: 'refresh-token',
        email: 'test@example.com',
      };

      const sanitized = baseService.testSanitizeForResponse(entity);

      expect(sanitized).toBeDefined();
      expect(sanitized.id).toBe(1);
      expect(sanitized.name).toBe('Test User');
      expect(sanitized.email).toBe('test@example.com');
      expect(sanitized.password).toBeUndefined();
      expect(sanitized.refreshToken).toBeUndefined();
    });

    it('should handle null/undefined entities', () => {
      expect(baseService.testSanitizeForResponse(null)).toBeNull();
      expect(baseService.testSanitizeForResponse(undefined)).toBeUndefined();
    });

    it('should handle non-object entities', () => {
      expect(baseService.testSanitizeForResponse(42)).toBe(42);
      expect(baseService.testSanitizeForResponse('string')).toBe('string');
      expect(baseService.testSanitizeForResponse(true)).toBe(true);
    });
  });

  describe('prepareForResponse', () => {
    it('should sanitize an entity for response', () => {
      const entity = {
        id: 1,
        name: 'Test User',
        password: 'secret123',
        refreshToken: 'refresh-token',
        email: 'test@example.com',
      };

      const prepared = baseService.testPrepareForResponse(entity);

      expect(prepared).toBeDefined();
      expect(prepared.id).toBe(1);
      expect(prepared.name).toBe('Test User');
      expect(prepared.email).toBe('test@example.com');
      expect((prepared as any).password).toBeUndefined();
      expect((prepared as any).refreshToken).toBeUndefined();
    });
  });

  describe('prepareCollectionForResponse', () => {
    it('should sanitize a collection of entities for response', () => {
      const entities = [
        {
          id: 1,
          name: 'User 1',
          password: 'secret1',
          refreshToken: 'refresh-token1',
          email: 'user1@example.com',
        },
        {
          id: 2,
          name: 'User 2',
          password: 'secret2',
          refreshToken: 'refresh-token2',
          email: 'user2@example.com',
        }
      ];

      const prepared = baseService.testPrepareCollectionForResponse(entities);

      expect(prepared).toHaveLength(2);
      if (prepared[0]) {
        expect(prepared[0].id).toBe(1);
        expect(prepared[0].name).toBe('User 1');
        expect((prepared[0] as any).password).toBeUndefined();
        expect((prepared[0] as any).refreshToken).toBeUndefined();
      }
      
      if (prepared[1]) {
        expect(prepared[1].id).toBe(2);
        expect(prepared[1].name).toBe('User 2');
        expect((prepared[1] as any).password).toBeUndefined();
        expect((prepared[1] as any).refreshToken).toBeUndefined();
      }
    });
  });

  describe('validateId', () => {
    it('should not throw for a valid positive ID', () => {
      expect(() => {
        baseService.testValidateId(1);
      }).not.toThrow();
      
      expect(() => {
        baseService.testValidateId(100);
      }).not.toThrow();
    });

    it('should throw for zero or negative ID', () => {
      expect(() => {
        baseService.testValidateId(0);
      }).toThrow('Invalid ID: 0. ID must be a positive number.');

      expect(() => {
        baseService.testValidateId(-1);
      }).toThrow('Invalid ID: -1. ID must be a positive number.');
      
      expect(() => {
        baseService.testValidateId(-100);
      }).toThrow('Invalid ID: -100. ID must be a positive number.');
    });
  });
});
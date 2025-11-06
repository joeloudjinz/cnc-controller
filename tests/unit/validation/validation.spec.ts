import {
  createUserSchema,
  updateUserSchema,
  loginSchema,
  createConversionSchema,
  updateConversionSchema,
} from '../../../src/validation/userValidation';

describe('Validation Schemas', () => {
  describe('createUserSchema', () => {
    it('should validate valid user creation data', () => {
      const validData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      const result = createUserSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject username with less than 3 characters', () => {
      const invalidData = {
        username: 'ab',
        email: 'test@example.com',
        password: 'password123'
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.format();
        expect(errors.username?._errors).toContainEqual(
          expect.stringContaining('String must contain at least 3 character(s)')
        );
      }
    });

    it('should reject username with more than 30 characters', () => {
      const invalidData = {
        username: 'a'.repeat(31),
        email: 'test@example.com',
        password: 'password123'
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.format();
        expect(errors.username?._errors).toContainEqual(
          expect.stringContaining('String must contain at most 30 character(s)')
        );
      }
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.format();
        expect(errors.email?._errors).toContainEqual(
          expect.stringContaining('Invalid email')
        );
      }
    });

    it('should reject password with less than 8 characters', () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'pass'
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.format();
        expect(errors.password?._errors).toContainEqual(
          expect.stringContaining('String must contain at least 8 character(s)')
        );
      }
    });

    it('should allow optional firstName and lastName', () => {
      const validData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
        // firstName and lastName are omitted
      };

      const result = createUserSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject firstName with more than 100 characters', () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'a'.repeat(101)
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.format();
        expect(errors.firstName?._errors).toContainEqual(
          expect.stringContaining('String must contain at most 100 character(s)')
        );
      }
    });
  });

  describe('updateUserSchema', () => {
    it('should validate valid user update data', () => {
      const validData = {
        username: 'newusername',
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'Name'
      };

      const result = updateUserSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should allow partial updates', () => {
      const validData = {
        username: 'newusername'
        // Only username is provided
      };

      const result = updateUserSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid values when provided', () => {
      const invalidData = {
        username: 'ab',
        email: 'invalid-email'
      };

      const result = updateUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.format();
        expect(errors.username?._errors).toContainEqual(
          expect.stringContaining('String must contain at least 3 character(s)')
        );
        expect(errors.email?._errors).toContainEqual(
          expect.stringContaining('Invalid email')
        );
      }
    });
  });

  describe('loginSchema', () => {
    it('should validate valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123'
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.format();
        expect(errors.email?._errors).toContainEqual(
          expect.stringContaining('Invalid email')
        );
      }
    });

    it('should allow password with at least 1 character', () => {
      const validData = {
        email: 'test@example.com',
        password: 'p'
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('createConversionSchema', () => {
    it('should validate valid conversion creation data', () => {
      const validData = {
        originalFileName: 'input.png',
        description: 'Test conversion',
        conversionParams: { resolution: 300, threshold: 128 }
      };

      const result = createConversionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing originalFileName', () => {
      const invalidData = {
        description: 'Test conversion'
        // originalFileName is missing
      };

      const result = createConversionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.format();
        expect(errors.originalFileName?._errors).toContainEqual(
          expect.stringContaining('Required')
        );
      }
    });

    it('should allow optional description and conversionParams', () => {
      const validData = {
        originalFileName: 'input.png'
        // description and conversionParams are omitted
      };

      const result = createConversionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject description with more than 500 characters', () => {
      const invalidData = {
        originalFileName: 'input.png',
        description: 'a'.repeat(501)
      };

      const result = createConversionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.format();
        expect(errors.description?._errors).toContainEqual(
          expect.stringContaining('String must contain at most 500 character(s)')
        );
      }
    });
  });

  describe('updateConversionSchema', () => {
    it('should validate valid conversion update data', () => {
      const validData = {
        description: 'Updated description',
        status: 'completed'
      };

      const result = updateConversionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should allow partial updates', () => {
      const validData = {
        description: 'Updated description'
        // status is omitted
      };

      const result = updateConversionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should allow empty object', () => {
      const validData = {};

      const result = updateConversionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject description with more than 500 characters', () => {
      const invalidData = {
        description: 'a'.repeat(501)
      };

      const result = updateConversionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.format();
        expect(errors.description?._errors).toContainEqual(
          expect.stringContaining('String must contain at most 500 character(s)')
        );
      }
    });
  });
});
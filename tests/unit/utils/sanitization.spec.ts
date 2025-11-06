import {
  sanitizeString,
  sanitizeEmail,
  sanitizeUsername,
  sanitizePassword,
  sanitizeUrl,
  sanitizeId,
  sanitizeText,
  sanitizeObject
} from '../../../src/utils/sanitization';

describe('Sanitization Utilities', () => {
  describe('sanitizeString', () => {
    it('should trim whitespace', () => {
      const input = '  test string  ';
      const result = sanitizeString(input);
      expect(result).toBe('test string');
    });

    it('should remove null bytes', () => {
      const input = 'test\0string';
      const result = sanitizeString(input);
      expect(result).toBe('teststring');
    });

    it('should remove control characters', () => {
      const input = 'test\x01\x02\x03string';
      const result = sanitizeString(input);
      expect(result).toBe('teststring');
    });

    it('should handle normal strings correctly', () => {
      const input = 'normal string';
      const result = sanitizeString(input);
      expect(result).toBe('normal string');
    });

    it('should throw error for non-string input', () => {
      expect(() => {
        sanitizeString(123 as any);
      }).toThrow('Input must be a string');
    });
  });

  describe('sanitizeEmail', () => {
    it('should normalize email to lowercase', () => {
      const input = 'Test@Example.Com';
      const result = sanitizeEmail(input);
      expect(result).toBe('test@example.com');
    });

    it('should validate email format', () => {
      const input = 'invalid-email';
      expect(() => {
        sanitizeEmail(input);
      }).toThrow('Invalid email format');
    });

    it('should handle valid email correctly', () => {
      const input = 'test@example.com';
      const result = sanitizeEmail(input);
      expect(result).toBe('test@example.com');
    });
  });

  describe('sanitizeUsername', () => {
    it('should normalize username to lowercase', () => {
      const input = 'TestUser';
      const result = sanitizeUsername(input);
      expect(result).toBe('testuser');
    });

    it('should throw error for username with less than 3 characters', () => {
      const input = 'ab';
      expect(() => {
        sanitizeUsername(input);
      }).toThrow('Username must be between 3 and 30 characters');
    });

    it('should throw error for username with more than 30 characters', () => {
      const input = 'a'.repeat(31);
      expect(() => {
        sanitizeUsername(input);
      }).toThrow('Username must be between 3 and 30 characters');
    });

    it('should throw error for invalid characters in username', () => {
      const input = 'test user'; // contains space
      expect(() => {
        sanitizeUsername(input);
      }).toThrow('Username can only contain alphanumeric characters, underscores, and hyphens');
    });

    it('should allow valid username', () => {
      const input = 'test_user-123';
      const result = sanitizeUsername(input);
      expect(result).toBe('test_user-123');
    });
  });

  describe('sanitizePassword', () => {
    it('should throw error for password with less than 8 characters', () => {
      const input = 'pass';
      expect(() => {
        sanitizePassword(input);
      }).toThrow('Password must be at least 8 characters long');
    });

    it('should handle valid password correctly', () => {
      const input = 'password123';
      const result = sanitizePassword(input);
      expect(result).toBe('password123');
    });

    it('should trim password', () => {
      const input = '  password123  ';
      const result = sanitizePassword(input);
      expect(result).toBe('password123');
    });
  });

  describe('sanitizeUrl', () => {
    it('should validate URL format', () => {
      const input = 'http://example.com';
      const result = sanitizeUrl(input);
      expect(result).toBe('http://example.com');
    });

    it('should throw error for invalid URL format', () => {
      const input = 'not-a-url';
      expect(() => {
        sanitizeUrl(input);
      }).toThrow('Invalid URL format');
    });

    it('should require protocol', () => {
      const input = 'example.com';
      expect(() => {
        sanitizeUrl(input);
      }).toThrow('Invalid URL format');
    });

    it('should allow https URLs', () => {
      const input = 'https://secure.example.com';
      const result = sanitizeUrl(input);
      expect(result).toBe('https://secure.example.com');
    });
  });

  describe('sanitizeId', () => {
    it('should allow valid numeric ID', () => {
      const input = '12345';
      const result = sanitizeId(input);
      expect(result).toBe('12345');
    });

    it('should allow valid MongoDB ID', () => {
      const input = '507f1f77bcf86cd799439011';
      const result = sanitizeId(input);
      expect(result).toBe('507f1f77bcf86cd799439011');
    });

    it('should throw error for invalid ID format', () => {
      const input = 'invalid-id';
      expect(() => {
        sanitizeId(input);
      }).toThrow('Invalid ID format');
    });
  });

  describe('sanitizeText', () => {
    it('should escape HTML characters', () => {
      const input = '<script>alert("xss")</script>';
      const result = sanitizeText(input);
      expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });

    it('should trim whitespace', () => {
      const input = '  some text  ';
      const result = sanitizeText(input);
      expect(result).toBe('some text');
    });

    it('should throw error for text exceeding max length', () => {
      const input = 'a'.repeat(1001); // Default max is 1000
      expect(() => {
        sanitizeText(input);
      }).toThrow('Text exceeds maximum length of 1000 characters');
    });

    it('should allow text under max length', () => {
      const input = 'a'.repeat(500);
      const result = sanitizeText(input);
      expect(result).toBe(input);
    });

    it('should allow custom max length', () => {
      const input = 'a'.repeat(150);
      const result = sanitizeText(input, 200);
      expect(result).toBe(input);
    });
  });

  describe('sanitizeObject', () => {
    it('should sanitize object properties using provided sanitizers', () => {
      const obj = { username: '  TestUser  ', email: '  TEST@EXAMPLE.COM  ' };
      const sanitizers = { 
        username: sanitizeUsername, 
        email: (email: string) => sanitizeEmail(email.toLowerCase().trim()) // Pre-sanitize to ensure valid email
      };
      
      const result = sanitizeObject(obj, sanitizers);
      expect(result.username).toBe('testuser');
      expect(result.email).toBe('test@example.com');
    });

    it('should not modify properties without sanitizers', () => {
      const obj = { username: '  TestUser  ', otherProp: '  Other Value  ' };
      const sanitizers = { username: sanitizeUsername };
      
      const result = sanitizeObject(obj, sanitizers);
      expect(result.username).toBe('testuser');
      expect(result.otherProp).toBe('  Other Value  '); // Not sanitized
    });

    it('should handle empty object', () => {
      const obj = {};
      const sanitizers = {};
      
      const result = sanitizeObject(obj, sanitizers);
      expect(result).toEqual({});
    });

    it('should not modify original object', () => {
      const obj = { username: '  TestUser  ' };
      const sanitizers = { username: sanitizeUsername };
      
      const result = sanitizeObject(obj, sanitizers);
      expect(obj.username).toBe('  TestUser  '); // Original unchanged
      expect(result.username).toBe('testuser'); // Sanitized result
    });
  });
});
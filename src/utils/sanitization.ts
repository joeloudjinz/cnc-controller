import validator from 'validator';

/**
 * Utility functions for input sanitization
 */

// Sanitize a string input
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }

  // Remove null bytes and control characters by filtering them out
  let sanitized = '';
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    // Skip null byte and control characters (0-31) and delete (127)
    if ((charCode >= 32 && charCode <= 126) || charCode > 127) {
      sanitized += input[i];
    }
  }

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
};

// Sanitize an email input
export const sanitizeEmail = (email: string): string => {
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format');
  }

  return validator.normalizeEmail(email) || email;
};

// Sanitize a username input (alphanumeric, underscores, hyphens, 3-30 chars)
export const sanitizeUsername = (username: string): string => {
  const sanitized = sanitizeString(username);

  if (!validator.isLength(sanitized, { min: 3, max: 30 })) {
    throw new Error('Username must be between 3 and 30 characters');
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(sanitized)) {
    throw new Error('Username can only contain alphanumeric characters, underscores, and hyphens');
  }

  return sanitized.toLowerCase();
};

// Sanitize a password input (at least 8 chars, with special requirements)
export const sanitizePassword = (password: string): string => {
  const sanitized = sanitizeString(password);

  if (!validator.isLength(sanitized, { min: 8 })) {
    throw new Error('Password must be at least 8 characters long');
  }

  // Additional password requirements can be added here

  return sanitized;
};

// Sanitize a URL input
export const sanitizeUrl = (url: string): string => {
  if (
    !validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true,
    })
  ) {
    throw new Error('Invalid URL format');
  }

  return validator.blacklist(url, '<>"%{}|\\^`') || url;
};

// Sanitize an ID (for database IDs, etc.)
export const sanitizeId = (id: string): string => {
  if (!validator.isMongoId(id) && !validator.isNumeric(id)) {
    throw new Error('Invalid ID format');
  }

  return id;
};

// Sanitize text (remove potentially harmful HTML tags, etc.)
export const sanitizeText = (text: string, maxLength: number = 1000): string => {
  const sanitized = sanitizeString(text);

  if (!validator.isLength(sanitized, { max: maxLength })) {
    throw new Error(`Text exceeds maximum length of ${maxLength} characters`);
  }

  // Remove potentially harmful tags/characters
  return validator.escape(sanitized);
};

// Validate and sanitize object properties
export const sanitizeObject = <T extends Record<string, any>>(
  obj: T,
  sanitizers: { [K in keyof T]?: (_value: T[K]) => T[K] }, // Using underscore to mark as intentionally unused
): T => {
  const sanitizedObj = { ...obj } as T;

  for (const [key, sanitizer] of Object.entries(sanitizers)) {
    if (Object.prototype.hasOwnProperty.call(sanitizedObj, key) && sanitizer) {
      const typedKey = key as keyof T;
      (sanitizedObj[typedKey] as any) = sanitizer(sanitizedObj[typedKey]);
    }
  }

  return sanitizedObj;
};

export default {
  sanitizeString,
  sanitizeEmail,
  sanitizeUsername,
  sanitizePassword,
  sanitizeUrl,
  sanitizeId,
  sanitizeText,
  sanitizeObject,
};

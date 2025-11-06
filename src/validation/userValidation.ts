import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
});

export const updateUserSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  email: z.string().email().optional(),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Conversion validation schemas
export const createConversionSchema = z.object({
  originalFileName: z.string(),
  description: z.string().max(500).optional(),
  conversionParams: z.record(z.any()).optional(),
});

export const updateConversionSchema = z.object({
  description: z.string().max(500).optional(),
  status: z.string().optional(),
});

// Export a type for each schema
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type CreateConversionDto = z.infer<typeof createConversionSchema>;
export type UpdateConversionDto = z.infer<typeof updateConversionSchema>;

// User DTOs
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UserResponseDto {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
}

// Conversion DTOs
export interface CreateConversionDto {
  originalFileName: string;
  description?: string;
  conversionParams?: Record<string, any>;
}

export interface UpdateConversionDto {
  description?: string;
  status?: string;
}

export interface ConversionResponseDto {
  id: number;
  originalFileName: string;
  convertedFileName?: string;
  description?: string;
  status: string;
  conversionParams?: Record<string, any>;
  outputFilePath?: string;
  errorMessage?: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
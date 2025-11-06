import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface EnvironmentConfig {
  NODE_ENV: string;
  PORT: number;
  TOKEN_SECRET: string;
  DATABASE_HOST: string;
  DATABASE_NAME: string;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_ROOT_PASSWORD: string;
}

// Validate and provide default values for environment variables
const getConfig = (): EnvironmentConfig => {
  // Required environment variables
  const requiredEnvVars = ['TOKEN_SECRET', 'DATABASE_HOST', 'DATABASE_NAME', 'DATABASE_USERNAME', 'DATABASE_PASSWORD'];

  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }

  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    TOKEN_SECRET: process.env.TOKEN_SECRET!,
    DATABASE_HOST: process.env.DATABASE_HOST!,
    DATABASE_NAME: process.env.DATABASE_NAME!,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME!,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD!,
    DATABASE_ROOT_PASSWORD: process.env.DATABASE_ROOT_PASSWORD || '',
  };
};

export const config = getConfig();

export default config;

import { DataSource } from 'typeorm';

// Create a test-specific data source that doesn't require environment variables
export const TestDataSource = new DataSource({
  type: 'sqlite', // Use SQLite for testing
  database: ':memory:', // In-memory database for testing
  synchronize: true, // Automatically create tables
  logging: false,
  entities: ['src/models/**/*.ts'],
  migrations: [],
  subscribers: [],
});
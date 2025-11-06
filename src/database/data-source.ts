import { DataSource } from 'typeorm';
import { config } from '../config/env';
import { User } from '../models/User';
import { Conversion } from '../models/Conversion';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.DATABASE_HOST,
  port: 3306, // Default MySQL port
  username: config.DATABASE_USERNAME,
  password: config.DATABASE_PASSWORD,
  database: config.DATABASE_NAME,
  synchronize: false, // Set to false in production to avoid data loss
  logging: false,
  entities: [User, Conversion],
  migrations: ['./src/database/migrations/*.ts'],
  subscribers: [],
  extra: {
    // Add any additional MySQL-specific options here
    // For example, connection timeout settings
  },
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Data source has been initialized!');
  } catch (err) {
    console.error('Error during Data Source initialization:', err);
    process.exit(1);
  }
};

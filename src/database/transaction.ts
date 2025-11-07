import { QueryRunner, DataSource } from 'typeorm';

/**
 * Helper function to execute database operations within a transaction
 */
export const executeInTransaction = async <T>(
  dataSource: DataSource, 
  operation: (queryRunner: QueryRunner) => Promise<T>
): Promise<T> => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const result = await operation(queryRunner);
    await queryRunner.commitTransaction();
    return result;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

/**
 * Base service class that provides transaction support
 */
export abstract class TransactionalService {
  protected async executeInTransaction<T>(
    dataSource: DataSource,
    operation: (queryRunner: QueryRunner) => Promise<T>
  ): Promise<T> {
    return executeInTransaction(dataSource, operation);
  }
}
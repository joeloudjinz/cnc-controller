export abstract class BaseService {
  // Common functionality that can be reused across services
  protected sanitizeForResponse<T>(entity: T): T {
    // Remove sensitive information before sending response
    // Create a copy of the entity and remove sensitive fields
    if (entity && typeof entity === 'object') {
      const sanitized = { ...entity } as any;
      // Remove sensitive fields like password, tokens, etc.
      if (sanitized.password) {
        delete sanitized.password;
      }
      if (sanitized.refreshToken) {
        delete sanitized.refreshToken;
      }
      return sanitized;
    }
    return entity;
  }

  // Common validation method
  protected validateId(id: number): void {
    if (id <= 0) {
      throw new Error(`Invalid ID: ${id}. ID must be a positive number.`);
    }
  }

  // Common method for preparing entity for response
  protected prepareForResponse<T>(entity: T): Partial<T> {
    return this.sanitizeForResponse(entity);
  }

  // Common method for preparing entities for response
  protected prepareCollectionForResponse<T>(entities: T[]): Partial<T>[] {
    return entities.map(entity => this.prepareForResponse(entity));
  }
}
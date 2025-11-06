import { Repository, EntityManager } from 'typeorm';
import { User } from '../../src/models/User';
import { Conversion } from '../../src/models/Conversion';

// Mock Repository base class
export class MockRepository<T extends Record<string, any>> extends Repository<T> {
  constructor(private entities: T[] = []) {
    super(undefined as any, undefined as any);
  }

  override async find(): Promise<T[]> {
    return [...this.entities];
  }

  override async findOne(options?: any): Promise<T | null> {
    // Basic implementation that finds by ID if specified
    if (options?.where?.id) {
      const entity = this.entities.find(e => e.id === options.where.id);
      return entity || null;
    }
    return this.entities.length > 0 ? this.entities[0] as any : null;
  }

  override async save(entity: any): Promise<any> {
    // Check if the entity already exists (has an id)
    if (entity.id) {
      const index = this.entities.findIndex(e => e.id === entity.id);
      if (index !== -1) {
        this.entities[index] = entity;
        return entity;
      }
    }
    
    // If it's new, assign an ID and add to entities
    if (!entity.id) {
      entity.id = (this.entities.length > 0 ? Math.max(...this.entities.map(e => e.id)) : 0) + 1;
    }
    this.entities.push(entity);
    return entity;
  }

  override async remove(entity: any): Promise<any> {
    const index = this.entities.indexOf(entity);
    if (index > -1) {
      this.entities.splice(index, 1);
    }
    return entity;
  }

  override async delete(id: number): Promise<any> {
    const index = this.entities.findIndex(e => e.id === id);
    if (index !== -1) {
      this.entities.splice(index, 1);
      return { affected: 1 };
    }
    return { affected: 0 };
  }

  override create(entity?: any): any {
    if (entity) {
      return { ...entity };
    }
    return {};
  }
}

// Mock DataSource for testing
export class MockDataSource {
  private repositories: Map<string, MockRepository<any>> = new Map();

  constructor() {
    this.repositories.set('User', new MockRepository<User>([]));
    this.repositories.set('Conversion', new MockRepository<Conversion>([]));
  }

  getRepository<T extends Record<string, any>>(entity: new () => T): MockRepository<T> {
    const key = entity.name;
    if (!this.repositories.has(key)) {
      this.repositories.set(key, new MockRepository<T>([]));
    }
    return this.repositories.get(key) as MockRepository<T>;
  }

  createEntityManager(): EntityManager {
    return {
      getRepository: this.getRepository.bind(this),
    } as any as EntityManager;
  }
}
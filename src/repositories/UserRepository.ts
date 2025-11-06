import { Repository, DataSource, FindOptionsWhere } from 'typeorm';
import { User } from '../models/User';

export class UserRepository extends Repository<User> {
  private repository: Repository<User>;

  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
    this.repository = dataSource.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { username },
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async findAll(options?: FindOptionsWhere<User>): Promise<User[]> {
    return await this.repository.find({
      where: options,
    });
  }

  async createNew(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return await this.repository.save(user);
  }

  async updateById(id: number, userData: Partial<User>): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) {
      return null;
    }

    Object.assign(user, userData);
    return await this.repository.save(user);
  }

  async deleteById(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== undefined && result.affected! > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const user = await this.findByUsername(username);
    return user !== null;
  }
}

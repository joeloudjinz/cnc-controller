import { Repository, DataSource, FindOptionsWhere } from 'typeorm';
import { Conversion } from '../models/Conversion';

export class ConversionRepository extends Repository<Conversion> {
  private repository: Repository<Conversion>;

  constructor(dataSource: DataSource) {
    super(Conversion, dataSource.createEntityManager());
    this.repository = dataSource.getRepository(Conversion);
  }

  async findById(id: number): Promise<Conversion | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByUserId(userId: number): Promise<Conversion[]> {
    return await this.repository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findAll(options?: FindOptionsWhere<Conversion>): Promise<Conversion[]> {
    return await this.repository.find({
      where: options,
      relations: ['user'],
    });
  }

  async createNew(conversionData: Partial<Conversion>): Promise<Conversion> {
    const conversion = this.repository.create(conversionData);
    return await this.repository.save(conversion);
  }

  async updateById(id: number, conversionData: Partial<Conversion>): Promise<Conversion | null> {
    const conversion = await this.findById(id);
    if (!conversion) {
      return null;
    }

    Object.assign(conversion, conversionData);
    return await this.repository.save(conversion);
  }

  async deleteById(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== undefined && result.affected! > 0;
  }

  async findByOriginalFileName(originalFileName: string): Promise<Conversion | null> {
    return await this.repository.findOne({
      where: { originalFileName },
      relations: ['user'],
    });
  }

  async findByConvertedFileName(convertedFileName: string): Promise<Conversion | null> {
    return await this.repository.findOne({
      where: { convertedFileName },
      relations: ['user'],
    });
  }

  async findByStatus(status: string): Promise<Conversion[]> {
    return await this.repository.find({
      where: { status: status as any },
      relations: ['user'],
    });
  }
}

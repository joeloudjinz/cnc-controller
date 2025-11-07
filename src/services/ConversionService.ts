import { injectable } from 'inversify';
import { Conversion } from '../models/Conversion';
import { CreateConversionDto, UpdateConversionDto } from '../dto/UserDto';
import { IConversionService } from './interfaces/IConversionService';
import { ConversionRepository } from '../repositories/ConversionRepository';
import { EntityNotFoundError } from '../errors/AppError';
import { User } from '../models/User';
import { BaseService } from '../services/base/BaseService';

@injectable()
export class ConversionService extends BaseService implements IConversionService {
  constructor(private conversionRepository: ConversionRepository) {
    super();
  }

  async createConversion(createConversionDto: CreateConversionDto, userId: number): Promise<Conversion> {
    this.validateId(userId); // Using base class validation
    
    // Create the conversion with associated user
    const conversion = await this.conversionRepository.createNew({
      ...createConversionDto,
      user: { id: userId } as User, // Create a partial user object with just the ID
    });

    return this.prepareForResponse(conversion) as Conversion;
  }

  async findConversionById(id: number): Promise<Conversion | null> {
    this.validateId(id); // Using base class validation
    const conversion = await this.conversionRepository.findById(id);
    if (!conversion) {
      throw new EntityNotFoundError('Conversion', id);
    }
    return this.prepareForResponse(conversion) as Conversion;
  }

  async findConversionsByUserId(userId: number): Promise<Conversion[]> {
    this.validateId(userId); // Using base class validation
    const conversions = await this.conversionRepository.findByUserId(userId);
    return this.prepareCollectionForResponse(conversions) as Conversion[];
  }

  async updateConversion(id: number, updateConversionDto: Partial<UpdateConversionDto>): Promise<Conversion | null> {
    this.validateId(id); // Using base class validation
    
    const updatedConversion = await this.conversionRepository.updateById(id, updateConversionDto as Partial<Conversion>);
    
    if (!updatedConversion) {
      throw new EntityNotFoundError('Conversion', id);
    }

    return this.prepareForResponse(updatedConversion) as Conversion;
  }

  async deleteConversion(id: number): Promise<boolean> {
    this.validateId(id); // Using base class validation
    const result = await this.conversionRepository.deleteById(id);
    if (!result) {
      throw new EntityNotFoundError('Conversion', id);
    }
    return result;
  }

  async getAllConversions(): Promise<Conversion[]> {
    const conversions = await this.conversionRepository.findAll();
    return this.prepareCollectionForResponse(conversions) as Conversion[];
  }

  async findConversionsByStatus(status: string): Promise<Conversion[]> {
    const conversions = await this.conversionRepository.findByStatus(status);
    return this.prepareCollectionForResponse(conversions) as Conversion[];
  }
}
import { Conversion } from '../models/Conversion';
import { CreateConversionDto, UpdateConversionDto } from '../dto/UserDto';

export interface IConversionService {
  createConversion(createConversionDto: CreateConversionDto, userId: number): Promise<Conversion>;
  findConversionById(id: number): Promise<Conversion | null>;
  findConversionsByUserId(userId: number): Promise<Conversion[]>;
  updateConversion(id: number, updateConversionDto: UpdateConversionDto): Promise<Conversion | null>;
  deleteConversion(id: number): Promise<boolean>;
  getAllConversions(): Promise<Conversion[]>;
  findConversionsByStatus(status: string): Promise<Conversion[]>;
}
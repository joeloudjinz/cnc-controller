import { Conversion } from '../../../src/models/Conversion';
import { ConversionService } from '../../../src/services/ConversionService';
import { User } from '../../../src/models/User';
import { CreateConversionDto, UpdateConversionDto } from '../../../src/dto/UserDto';
import { EntityNotFoundError } from '../../../src/errors/AppError';

// Create a mock ConversionRepository for testing
class MockConversionRepository {
  private conversions: Conversion[] = [];
  
  async findById(id: number): Promise<Conversion | null> {
    return this.conversions.find(conv => conv.id === id) || null;
  }

  async findByUserId(userId: number): Promise<Conversion[]> {
    return this.conversions.filter(conv => conv.user?.id === userId);
  }

  async findByStatus(status: string): Promise<Conversion[]> {
    return this.conversions.filter(conv => conv.status === status);
  }

  async findAll(): Promise<Conversion[]> {
    return [...this.conversions];
  }

  async createNew(conversionData: Partial<Conversion>): Promise<Conversion> {
    const newConversion: Conversion = {
      id: this.conversions.length + 1,
      status: 'completed', // default status
      originalFileName: 'default.jpg', // default required field
      ...conversionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Conversion;
    this.conversions.push(newConversion);
    return newConversion;
  }

  async updateById(id: number, conversionData: Partial<Conversion>): Promise<Conversion | null> {
    const index = this.conversions.findIndex(conv => conv.id === id);
    if (index === -1) return null;
    
    const updatedConversion = {
      ...this.conversions[index],
      ...conversionData,
      updatedAt: new Date(),
    } as Conversion;
    
    this.conversions[index] = updatedConversion;
    return updatedConversion;
  }

  async deleteById(id: number): Promise<boolean> {
    const initialLength = this.conversions.length;
    this.conversions = this.conversions.filter(conv => conv.id !== id);
    return this.conversions.length < initialLength;
  }
}

describe('ConversionService', () => {
  let conversionService: ConversionService;
  let mockConversionRepository: MockConversionRepository;

  beforeEach(() => {
    mockConversionRepository = new MockConversionRepository();
    // Create a partial mock of ConversionService to bypass dependency injection
    conversionService = Object.create(ConversionService.prototype);
    Object.assign(conversionService, {
      conversionRepository: mockConversionRepository,
    });
  });

  describe('createConversion', () => {
    it('should create a new conversion successfully', async () => {
      const createConversionDto: CreateConversionDto = {
        originalFileName: 'test.jpg',
        conversionParams: { resolution: 100, threshold: 50 },
      };
      const userId = 1;

      const conversion = await conversionService.createConversion(createConversionDto, userId);

      expect(conversion).toBeDefined();
      expect(conversion.id).toBeDefined();
      expect(conversion.originalFileName).toBe('test.jpg');
      expect(conversion.status).toBe('completed');
      expect(conversion.conversionParams).toEqual({ resolution: 100, threshold: 50 });
    });

    it('should throw error for invalid user ID', async () => {
      const createConversionDto: CreateConversionDto = {
        originalFileName: 'test.jpg',
      };

      await expect(conversionService.createConversion(createConversionDto, -1))
        .rejects
        .toThrow('Invalid ID');
    });
  });

  describe('findConversionById', () => {
    it('should find a conversion by ID', async () => {
      const conversion = await mockConversionRepository.createNew({
        originalFileName: 'test.jpg',
        user: { id: 1 } as User,
      });

      const foundConversion = await conversionService.findConversionById(conversion.id);

      expect(foundConversion).toBeDefined();
      expect(foundConversion?.id).toBe(conversion.id);
      expect(foundConversion?.originalFileName).toBe('test.jpg');
    });

    it('should throw EntityNotFoundError if conversion does not exist', async () => {
      await expect(conversionService.findConversionById(999))
        .rejects
        .toThrow(EntityNotFoundError);
    });

    it('should throw error for invalid ID', async () => {
      await expect(conversionService.findConversionById(-1))
        .rejects
        .toThrow('Invalid ID');
    });
  });

  describe('findConversionsByUserId', () => {
    it('should find conversions by user ID', async () => {
      const user1 = { id: 1 } as User;
      const user2 = { id: 2 } as User;

      const conversion1 = await mockConversionRepository.createNew({
        originalFileName: 'test1.jpg',
        user: user1,
      });

      const conversion2 = await mockConversionRepository.createNew({
        originalFileName: 'test2.jpg',
        user: user1,
      });

      const conversion3 = await mockConversionRepository.createNew({
        originalFileName: 'test3.jpg',
        user: user2,
      });

      const userConversions = await conversionService.findConversionsByUserId(1);

      expect(userConversions).toHaveLength(2);
      expect(userConversions).toContainEqual(expect.objectContaining({ id: conversion1.id }));
      expect(userConversions).toContainEqual(expect.objectContaining({ id: conversion2.id }));
      expect(userConversions).not.toContainEqual(expect.objectContaining({ id: conversion3.id }));
    });

    it('should throw error for invalid user ID', async () => {
      await expect(conversionService.findConversionsByUserId(-1))
        .rejects
        .toThrow('Invalid ID');
    });
  });

  describe('updateConversion', () => {
    it('should update a conversion successfully', async () => {
      const conversion = await mockConversionRepository.createNew({
        originalFileName: 'test.jpg',
        user: { id: 1 } as User,
      });

      const updateData: UpdateConversionDto = {
        status: 'completed',
      };

      const updatedConversion = await conversionService.updateConversion(conversion.id, updateData);

      expect(updatedConversion).toBeDefined();
      expect(updatedConversion?.status).toBe('completed');
    });

    it('should throw EntityNotFoundError if conversion to update does not exist', async () => {
      const updateData: UpdateConversionDto = {
        status: 'completed',
      };

      await expect(conversionService.updateConversion(999, updateData))
        .rejects
        .toThrow(EntityNotFoundError);
    });

    it('should throw error for invalid ID', async () => {
      const updateData: UpdateConversionDto = {
        status: 'completed',
      };

      await expect(conversionService.updateConversion(-1, updateData))
        .rejects
        .toThrow('Invalid ID');
    });
  });

  describe('deleteConversion', () => {
    it('should delete a conversion successfully', async () => {
      const conversion = await mockConversionRepository.createNew({
        originalFileName: 'test.jpg',
        user: { id: 1 } as User,
      });

      const result = await conversionService.deleteConversion(conversion.id);

      expect(result).toBe(true);
      
      // Verify conversion was deleted
      const foundConversion = await mockConversionRepository.findById(conversion.id);
      expect(foundConversion).toBeNull();
    });

    it('should throw EntityNotFoundError if conversion to delete does not exist', async () => {
      await expect(conversionService.deleteConversion(999))
        .rejects
        .toThrow(EntityNotFoundError);
    });

    it('should throw error for invalid ID', async () => {
      await expect(conversionService.deleteConversion(-1))
        .rejects
        .toThrow('Invalid ID');
    });
  });

  describe('getAllConversions', () => {
    it('should return all conversions', async () => {
      await mockConversionRepository.createNew({
        originalFileName: 'test1.jpg',
        user: { id: 1 } as User,
      });

      await mockConversionRepository.createNew({
        originalFileName: 'test2.jpg',
        user: { id: 2 } as User,
      });

      const conversions = await conversionService.getAllConversions();

      expect(conversions).toHaveLength(2);
    });
  });

  describe('findConversionsByStatus', () => {
    it('should find conversions by status', async () => {
      const completedConv = await mockConversionRepository.createNew({
        originalFileName: 'test1.jpg',
        status: 'completed' as any,
        user: { id: 1 } as User,
      });

      await mockConversionRepository.createNew({
        originalFileName: 'test2.jpg',
        status: 'processing' as any,
        user: { id: 2 } as User,
      });

      await mockConversionRepository.createNew({
        originalFileName: 'test3.jpg',
        status: 'completed' as any,
        user: { id: 1 } as User,
      });

      const completedConversions = await conversionService.findConversionsByStatus('completed');

      expect(completedConversions).toHaveLength(2);
      expect(completedConversions).toContainEqual(expect.objectContaining({ id: completedConv.id }));
      expect(completedConversions).toContainEqual(expect.objectContaining({ id: expect.any(Number) }));
      completedConversions.forEach(conv => expect(conv.status).toBe('completed'));
    });
  });
});
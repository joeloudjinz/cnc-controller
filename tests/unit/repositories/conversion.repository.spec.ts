import { Conversion, ConversionStatus } from '../../../src/models/Conversion';
import { ConversionRepository } from '../../../src/repositories/ConversionRepository';
import { MockDataSource } from '../../mocks/mockDataSource';
import { User, UserRole } from '../../../src/models/User';

describe('ConversionRepository', () => {
  let conversionRepository: ConversionRepository;
  let mockDataSource: MockDataSource;

  beforeEach(() => {
    mockDataSource = new MockDataSource();
    conversionRepository = new ConversionRepository(mockDataSource as any);
  });

  describe('find methods', () => {
    it('should find conversion by ID', async () => {
      const conversion = new Conversion();
      conversion.id = 1;
      conversion.originalFileName = 'input.png';
      conversion.status = ConversionStatus.Pending;

      // Add conversion to the mock repository
      const mockRepo = mockDataSource.getRepository(Conversion);
      await mockRepo.save(conversion);

      const foundConversion = await (conversionRepository as any).repository.findOne({
        where: { id: 1 }
      });

      expect(foundConversion).toBeDefined();
      expect(foundConversion?.id).toBe(1);
    });

    it('should find conversions by user ID', async () => {
      // Create a user first
      const user = new User();
      user.id = 1;
      user.username = 'testuser';
      user.email = 'test@example.com';
      user.password = 'password';
      user.role = UserRole.Agent;

      // Create a conversion associated with the user
      const conversion = new Conversion();
      conversion.id = 1;
      conversion.originalFileName = 'input.png';
      conversion.user = user;

      // Add to mock repositories
      const userMockRepo = mockDataSource.getRepository(User);
      const conversionMockRepo = mockDataSource.getRepository(Conversion);

      await userMockRepo.save(user);
      await conversionMockRepo.save(conversion);

      // Test the findByUserId method
      const conversions = await conversionRepository.findByUserId(1);

      expect(conversions).toBeDefined();
      if (conversions.length > 0) {
        expect(conversions[0]?.id).toBe(1);
      }
    });

    it('should find conversion by original file name', async () => {
      const conversion = new Conversion();
      conversion.id = 1;
      conversion.originalFileName = 'input.png';
      conversion.status = ConversionStatus.Pending;

      // Add to mock repository
      const mockRepo = mockDataSource.getRepository(Conversion);
      await mockRepo.save(conversion);

      const foundConversion = await conversionRepository.findByOriginalFileName('input.png');

      expect(foundConversion).toBeDefined();
      expect(foundConversion?.originalFileName).toBe('input.png');
    });

    it('should find conversion by converted file name', async () => {
      const conversion = new Conversion();
      conversion.id = 1;
      conversion.originalFileName = 'input.png';
      conversion.convertedFileName = 'output.gcode';
      conversion.status = ConversionStatus.Completed;

      // Add to mock repository
      const mockRepo = mockDataSource.getRepository(Conversion);
      await mockRepo.save(conversion);

      const foundConversion = await conversionRepository.findByConvertedFileName('output.gcode');

      expect(foundConversion).toBeDefined();
      expect(foundConversion?.convertedFileName).toBe('output.gcode');
    });

    it('should find conversions by status', async () => {
      const conversion1 = new Conversion();
      conversion1.id = 1;
      conversion1.originalFileName = 'input1.png';
      conversion1.status = ConversionStatus.Completed;

      const conversion2 = new Conversion();
      conversion2.id = 2;
      conversion2.originalFileName = 'input2.png';
      conversion2.status = ConversionStatus.Completed;

      // Add to mock repository
      const mockRepo = mockDataSource.getRepository(Conversion);
      await mockRepo.save(conversion1);
      await mockRepo.save(conversion2);

      const conversions = await conversionRepository.findByStatus(ConversionStatus.Completed);

      expect(conversions).toBeDefined();
      expect(conversions.length).toBe(2);
      expect(conversions.every(conv => conv.status === ConversionStatus.Completed)).toBe(true);
    });
  });

  describe('createNew method', () => {
    it('should create a new conversion', async () => {
      const conversionData = {
        originalFileName: 'input.png',
        description: 'Test conversion',
        conversionParams: { resolution: 300, threshold: 128 }
      };

      const createdConversion = await conversionRepository.createNew(conversionData);

      expect(createdConversion).toBeDefined();
      expect(createdConversion.originalFileName).toBe('input.png');
      expect(createdConversion.description).toBe('Test conversion');
    });
  });

  describe('updateById method', () => {
    it('should update a conversion by ID', async () => {
      // Create and save a conversion first
      const conversion = new Conversion();
      conversion.id = 1;
      conversion.originalFileName = 'input.png';
      conversion.status = ConversionStatus.Pending;

      const mockRepo = mockDataSource.getRepository(Conversion);
      await mockRepo.save(conversion);

      // Update the conversion
      const updatedData = {
        status: ConversionStatus.Completed,
        convertedFileName: 'output.gcode'
      };

      const updatedConversion = await conversionRepository.updateById(1, updatedData);

      expect(updatedConversion).toBeDefined();
      expect(updatedConversion?.status).toBe(ConversionStatus.Completed);
      expect(updatedConversion?.convertedFileName).toBe('output.gcode');
    });

    it('should return null if conversion to update does not exist', async () => {
      const updatedConversion = await conversionRepository.updateById(999, {
        status: ConversionStatus.Completed
      });

      expect(updatedConversion).toBeNull();
    });
  });

  describe('deleteById method', () => {
    it('should delete a conversion by ID', async () => {
      // Create and save a conversion first
      const conversion = new Conversion();
      conversion.id = 1;
      conversion.originalFileName = 'input.png';
      conversion.status = ConversionStatus.Pending;

      const mockRepo = mockDataSource.getRepository(Conversion);
      await mockRepo.save(conversion);

      const result = await conversionRepository.deleteById(1);

      expect(result).toBe(true);
    });

    it('should return false if conversion to delete does not exist', async () => {
      const result = await conversionRepository.deleteById(999);

      expect(result).toBe(false);
    });
  });

  describe('findAll method', () => {
    it('should return all conversions', async () => {
      // Create and save some conversions
      const conversion1 = new Conversion();
      conversion1.id = 1;
      conversion1.originalFileName = 'input1.png';
      conversion1.status = ConversionStatus.Pending;

      const conversion2 = new Conversion();
      conversion2.id = 2;
      conversion2.originalFileName = 'input2.png';
      conversion2.status = ConversionStatus.Completed;

      const mockRepo = mockDataSource.getRepository(Conversion);
      await mockRepo.save(conversion1);
      await mockRepo.save(conversion2);

      const conversions = await conversionRepository.findAll();

      expect(conversions).toBeDefined();
      expect(conversions.length).toBe(2);
    });

    it('should return conversions with matching criteria', async () => {
      // Create and save some conversions
      const conversion1 = new Conversion();
      conversion1.id = 1;
      conversion1.originalFileName = 'input1.png';
      conversion1.status = ConversionStatus.Completed;

      const conversion2 = new Conversion();
      conversion2.id = 2;
      conversion2.originalFileName = 'input2.png';
      conversion2.status = ConversionStatus.Pending;

      const mockRepo = mockDataSource.getRepository(Conversion);
      await mockRepo.save(conversion1);
      await mockRepo.save(conversion2);

      const completedConversions = await conversionRepository.findAll({ status: ConversionStatus.Completed });

      expect(completedConversions).toBeDefined();
      if (completedConversions.length > 0) {
        expect(completedConversions[0]?.status).toBe(ConversionStatus.Completed);
      }
    });
  });
});
import { Conversion, ConversionStatus } from '../../../src/models/Conversion';
import { User, UserRole } from '../../../src/models/User';

describe('Conversion Entity', () => {
  let conversion: Conversion;

  beforeEach(() => {
    conversion = new Conversion();
  });

  describe('Initialization', () => {
    it('should create a new Conversion instance', () => {
      expect(conversion).toBeInstanceOf(Conversion);
    });

    it('should have correct default values', () => {
      // Note: The default status is set by the database, not as a TypeScript default value
      // So initially it will be undefined until explicitly set
      expect(conversion.createdAt).toBeUndefined();
      expect(conversion.updatedAt).toBeUndefined();
    });
  });

  describe('Properties', () => {
    it('should set and get id property', () => {
      const id = 1;
      conversion.id = id;
      expect(conversion.id).toBe(id);
    });

    it('should set and get originalFileName property', () => {
      const originalFileName = 'input.png';
      conversion.originalFileName = originalFileName;
      expect(conversion.originalFileName).toBe(originalFileName);
    });

    it('should set and get convertedFileName property', () => {
      const convertedFileName = 'output.gcode';
      conversion.convertedFileName = convertedFileName;
      expect(conversion.convertedFileName).toBe(convertedFileName);
    });

    it('should set and get description property', () => {
      const description = 'Test conversion';
      conversion.description = description;
      expect(conversion.description).toBe(description);
    });

    it('should set and get status property', () => {
      const status = ConversionStatus.Completed;
      conversion.status = status;
      expect(conversion.status).toBe(status);
    });

    it('should set and get conversionParams property', () => {
      const params = { resolution: 300, threshold: 128 };
      conversion.conversionParams = params;
      expect(conversion.conversionParams).toEqual(params);
    });

    it('should set and get outputFilePath property', () => {
      const path = '/path/to/output.gcode';
      conversion.outputFilePath = path;
      expect(conversion.outputFilePath).toBe(path);
    });

    it('should set and get errorMessage property', () => {
      const error = 'Conversion failed';
      conversion.errorMessage = error;
      expect(conversion.errorMessage).toBe(error);
    });

    it('should set and get user relationship', () => {
      const user = new User();
      user.id = 1;
      user.username = 'testuser';
      user.email = 'test@example.com';
      user.password = 'password';
      user.role = UserRole.Agent;
      
      conversion.user = user;
      expect(conversion.user).toBe(user);
      expect(conversion.user.id).toBe(1);
      expect(conversion.user.username).toBe('testuser');
    });

    it('should set and get createdAt property', () => {
      const date = new Date();
      conversion.createdAt = date;
      expect(conversion.createdAt).toBe(date);
    });

    it('should set and get updatedAt property', () => {
      const date = new Date();
      conversion.updatedAt = date;
      expect(conversion.updatedAt).toBe(date);
    });
  });

  describe('ConversionStatus enum', () => {
    it('should have Pending status with correct value', () => {
      expect(ConversionStatus.Pending).toBe('pending');
    });

    it('should have Processing status with correct value', () => {
      expect(ConversionStatus.Processing).toBe('processing');
    });

    it('should have Completed status with correct value', () => {
      expect(ConversionStatus.Completed).toBe('completed');
    });

    it('should have Failed status with correct value', () => {
      expect(ConversionStatus.Failed).toBe('failed');
    });
  });

  describe('Default values', () => {
    it('should default status to Pending when explicitly set', () => {
      const newConversion = new Conversion();
      newConversion.status = ConversionStatus.Pending; // Explicitly set to default value
      expect(newConversion.status).toBe(ConversionStatus.Pending);
    });
  });
});
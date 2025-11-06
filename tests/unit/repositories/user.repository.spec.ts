import { User } from '../../../src/models/User';
import { UserRepository } from '../../../src/repositories/UserRepository';
import { MockDataSource } from '../../mocks/mockDataSource';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockDataSource: MockDataSource;

  beforeEach(() => {
    mockDataSource = new MockDataSource();
    userRepository = new UserRepository(mockDataSource as any);
  });

  describe('find methods', () => {
    it('should find user by email', async () => {
      const user = new User();
      user.id = 1;
      user.email = 'test@example.com';
      user.username = 'testuser';
      user.password = 'password';

      // Add user to the mock repository
      const mockRepo = mockDataSource.getRepository(User);
      await mockRepo.save(user);

      const foundUser = await (userRepository as any).repository.findOne({
        where: { email: 'test@example.com' }
      });

      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe('test@example.com');
    });

    it('should find user by username', async () => {
      const user = new User();
      user.id = 1;
      user.email = 'test@example.com';
      user.username = 'testuser';
      user.password = 'password';

      // Add user to the mock repository
      const mockRepo = mockDataSource.getRepository(User);
      await mockRepo.save(user);

      const foundUser = await (userRepository as any).repository.findOne({
        where: { username: 'testuser' }
      });

      expect(foundUser).toBeDefined();
      expect(foundUser?.username).toBe('testuser');
    });

    it('should find user by ID', async () => {
      const user = new User();
      user.id = 1;
      user.email = 'test@example.com';
      user.username = 'testuser';
      user.password = 'password';

      // Add user to the mock repository
      const mockRepo = mockDataSource.getRepository(User);
      await mockRepo.save(user);

      const foundUser = await (userRepository as any).repository.findOne({
        where: { id: 1 }
      });

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(1);
    });
  });

  describe('createNew method', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      };

      const createdUser = await userRepository.createNew(userData);

      expect(createdUser).toBeDefined();
      expect(createdUser.username).toBe('newuser');
      expect(createdUser.email).toBe('newuser@example.com');
    });
  });

  describe('updateById method', () => {
    it('should update a user by ID', async () => {
      // Create and save a user first
      const user = new User();
      user.id = 1;
      user.email = 'old@example.com';
      user.username = 'olduser';
      user.password = 'password';

      const mockRepo = mockDataSource.getRepository(User);
      await mockRepo.save(user);

      // Update the user
      const updatedUserData = {
        email: 'updated@example.com',
        username: 'updatedUser'
      };

      const updatedUser = await userRepository.updateById(1, updatedUserData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser?.email).toBe('updated@example.com');
      expect(updatedUser?.username).toBe('updatedUser');
    });

    it('should return null if user to update does not exist', async () => {
      const updatedUser = await userRepository.updateById(999, {
        email: 'updated@example.com'
      });

      expect(updatedUser).toBeNull();
    });
  });

  describe('deleteById method', () => {
    it('should delete a user by ID', async () => {
      // Create and save a user first
      const user = new User();
      user.id = 1;
      user.email = 'todelete@example.com';
      user.username = 'userToDelete';
      user.password = 'password';

      const mockRepo = mockDataSource.getRepository(User);
      await mockRepo.save(user);

      const result = await userRepository.deleteById(1);

      expect(result).toBe(true);
    });

    it('should return false if user to delete does not exist', async () => {
      const result = await userRepository.deleteById(999);

      expect(result).toBe(false);
    });
  });

  describe('exists methods', () => {
    it('should return true if user exists by email', async () => {
      // Create and save a user first
      const user = new User();
      user.id = 1;
      user.email = 'exists@example.com';
      user.username = 'existsUser';
      user.password = 'password';

      const mockRepo = mockDataSource.getRepository(User);
      await mockRepo.save(user);

      const exists = await userRepository.existsByEmail('exists@example.com');

      expect(exists).toBe(true);
    });

    it('should return false if user does not exist by email', async () => {
      const exists = await userRepository.existsByEmail('nonexistent@example.com');

      expect(exists).toBe(false);
    });

    it('should return true if user exists by username', async () => {
      // Create and save a user first
      const user = new User();
      user.id = 1;
      user.email = 'test@example.com';
      user.username = 'existsUser';
      user.password = 'password';

      const mockRepo = mockDataSource.getRepository(User);
      await mockRepo.save(user);

      const exists = await userRepository.existsByUsername('existsUser');

      expect(exists).toBe(true);
    });

    it('should return false if user does not exist by username', async () => {
      const exists = await userRepository.existsByUsername('nonexistentUser');

      expect(exists).toBe(false);
    });
  });
});
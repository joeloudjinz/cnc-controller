import { User } from '../../../src/models/User';
import { UserService } from '../../../src/services/UserService';
import { CreateUserDto, UpdateUserDto } from '../../../src/dto/UserDto';
import { EntityNotFoundError, DuplicateEntityError } from '../../../src/errors/AppError';

// Create a mock UserRepository for testing
class MockUserRepository {
  private users: User[] = [];
  
  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.users.find(user => user.username === username) || null;
  }

  async findById(id: number): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async createNew(userData: Partial<User>): Promise<User> {
    const newUser = {
      id: this.users.length + 1,
      role: 'user', // default role
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userData,
    } as User;
    this.users.push(newUser);
    return newUser;
  }

  async updateById(id: number, userData: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return null;
    
    const updatedUser = {
      ...this.users[index],
      ...userData,
      updatedAt: new Date(),
    } as User;
    
    this.users[index] = updatedUser;
    return updatedUser;
  }

  async deleteById(id: number): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    return this.users.length < initialLength;
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.users.some(user => user.email === email);
  }

  async existsByUsername(username: string): Promise<boolean> {
    return this.users.some(user => user.username === username);
  }
}

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: MockUserRepository;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    // Create a partial mock of UserService to bypass dependency injection
    userService = Object.create(UserService.prototype);
    Object.assign(userService, {
      userRepository: mockUserRepository,
    });
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const user = await userService.createUser(createUserDto);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.firstName).toBe('Test');
      expect(user.lastName).toBe('User');
      expect(user.password).toBeUndefined(); // Password should be removed from response
    });

    it('should throw DuplicateEntityError if email already exists', async () => {
      const existingUser: CreateUserDto = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Existing',
        lastName: 'User',
      };

      await userService.createUser(existingUser);

      const newUser: CreateUserDto = {
        username: 'newuser',
        email: 'existing@example.com', // Same email
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      };

      await expect(userService.createUser(newUser))
        .rejects
        .toThrow(DuplicateEntityError);
    });

    it('should throw DuplicateEntityError if username already exists', async () => {
      const existingUser: CreateUserDto = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Existing',
        lastName: 'User',
      };

      await userService.createUser(existingUser);

      const newUser: CreateUserDto = {
        username: 'existinguser', // Same username
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      };

      await expect(userService.createUser(newUser))
        .rejects
        .toThrow(DuplicateEntityError);
    });
  });

  describe('findUserById', () => {
    it('should find a user by ID', async () => {
      const user = await mockUserRepository.createNew({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      });

      const foundUser = await userService.findUserById(user.id);

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(user.id);
      expect(foundUser?.username).toBe('testuser');
      expect(foundUser?.password).toBeUndefined(); // Password should be removed from response
    });

    it('should throw EntityNotFoundError if user does not exist', async () => {
      await expect(userService.findUserById(999))
        .rejects
        .toThrow(EntityNotFoundError);
    });

    it('should throw error for invalid ID', async () => {
      await expect(userService.findUserById(-1))
        .rejects
        .toThrow('Invalid ID');
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email', async () => {
      const user = await mockUserRepository.createNew({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      });

      const foundUser = await userService.findUserByEmail(user.email);

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(user.id);
      expect(foundUser?.email).toBe('test@example.com');
    });
  });

  describe('findUserByUsername', () => {
    it('should find a user by username', async () => {
      const user = await mockUserRepository.createNew({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      });

      const foundUser = await userService.findUserByUsername(user.username);

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(user.id);
      expect(foundUser?.username).toBe('testuser');
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const user = await mockUserRepository.createNew({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      });

      const updateData: UpdateUserDto = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const updatedUser = await userService.updateUser(user.id, updateData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser?.firstName).toBe('Updated');
      expect(updatedUser?.lastName).toBe('Name');
    });

    it('should throw error when trying to update to existing email', async () => {
      const user1 = await mockUserRepository.createNew({
        username: 'user1',
        email: 'user1@example.com',
        password: 'password',
        firstName: 'User',
        lastName: 'One',
      });

      const user2 = await mockUserRepository.createNew({
        username: 'user2',
        email: 'user2@example.com',
        password: 'password',
        firstName: 'User',
        lastName: 'Two',
      });

      const updateData: UpdateUserDto = {
        email: user1.email, // Try to update user2's email to user1's email
      };

      await expect(userService.updateUser(user2.id, updateData))
        .rejects
        .toThrow(DuplicateEntityError);
    });

    it('should throw error when trying to update to existing username', async () => {
      const user1 = await mockUserRepository.createNew({
        username: 'user1',
        email: 'user1@example.com',
        password: 'password',
        firstName: 'User',
        lastName: 'One',
      });

      const user2 = await mockUserRepository.createNew({
        username: 'user2',
        email: 'user2@example.com',
        password: 'password',
        firstName: 'User',
        lastName: 'Two',
      });

      const updateData: UpdateUserDto = {
        username: user1.username, // Try to update user2's username to user1's username
      };

      await expect(userService.updateUser(user2.id, updateData))
        .rejects
        .toThrow(DuplicateEntityError);
    });

    it('should throw EntityNotFoundError if user to update does not exist', async () => {
      const updateData: UpdateUserDto = {
        firstName: 'Updated',
      };

      await expect(userService.updateUser(999, updateData))
        .rejects
        .toThrow(EntityNotFoundError);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const user = await mockUserRepository.createNew({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      });

      const result = await userService.deleteUser(user.id);

      expect(result).toBe(true);
      
      // Verify user was deleted
      const foundUser = await mockUserRepository.findById(user.id);
      expect(foundUser).toBeNull();
    });

    it('should throw EntityNotFoundError if user to delete does not exist', async () => {
      await expect(userService.deleteUser(999))
        .rejects
        .toThrow(EntityNotFoundError);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      await mockUserRepository.createNew({
        username: 'user1',
        email: 'user1@example.com',
        password: 'password',
        firstName: 'User',
        lastName: 'One',
      });

      await mockUserRepository.createNew({
        username: 'user2',
        email: 'user2@example.com',
        password: 'password',
        firstName: 'User',
        lastName: 'Two',
      });

      const users = await userService.getAllUsers();

      expect(users).toHaveLength(2);
      expect((users[0] as any).password).toBeUndefined(); // Passwords should be removed from responses
      expect((users[1] as any).password).toBeUndefined();
    });
  });
});
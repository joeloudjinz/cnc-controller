import { User, UserRole } from '../../../src/models/User';

describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
  });

  describe('Initialization', () => {
    it('should create a new User instance', () => {
      expect(user).toBeInstanceOf(User);
    });

    it('should have correct default values', () => {
      expect(user.role).toBeUndefined(); // Role is not set by default
      expect(user.createdAt).toBeUndefined();
      expect(user.updatedAt).toBeUndefined();
    });
  });

  describe('Properties', () => {
    it('should set and get id property', () => {
      const id = 1;
      user.id = id;
      expect(user.id).toBe(id);
    });

    it('should set and get username property', () => {
      const username = 'testuser';
      user.username = username;
      expect(user.username).toBe(username);
    });

    it('should set and get email property', () => {
      const email = 'test@example.com';
      user.email = email;
      expect(user.email).toBe(email);
    });

    it('should set and get password property', () => {
      const password = 'password123';
      user.password = password;
      expect(user.password).toBe(password);
    });

    it('should set and get role property', () => {
      const role = UserRole.Admin;
      user.role = role;
      expect(user.role).toBe(role);
    });

    it('should set and get firstName property', () => {
      const firstName = 'John';
      user.firstName = firstName;
      expect(user.firstName).toBe(firstName);
    });

    it('should set and get lastName property', () => {
      const lastName = 'Doe';
      user.lastName = lastName;
      expect(user.lastName).toBe(lastName);
    });

    it('should set and get createdAt property', () => {
      const date = new Date();
      user.createdAt = date;
      expect(user.createdAt).toBe(date);
    });

    it('should set and get updatedAt property', () => {
      const date = new Date();
      user.updatedAt = date;
      expect(user.updatedAt).toBe(date);
    });
  });

  describe('fullName getter', () => {
    it('should return full name when both firstName and lastName are provided', () => {
      user.firstName = 'John';
      user.lastName = 'Doe';
      expect(user.fullName).toBe('John Doe');
    });

    it('should return only firstName when lastName is not provided', () => {
      user.firstName = 'John';
      expect(user.fullName).toBe('John');
    });

    it('should return only lastName when firstName is not provided', () => {
      user.lastName = 'Doe';
      expect(user.fullName).toBe('Doe');
    });

    it('should return empty string when both firstName and lastName are not provided', () => {
      expect(user.fullName).toBe('');
    });

    it('should handle names with internal spaces properly', () => {
      user.firstName = 'John Michael';
      user.lastName = 'Smith Johnson';
      expect(user.fullName).toBe('John Michael Smith Johnson');
    });
  });

  describe('UserRole enum', () => {
    it('should have Admin role with correct value', () => {
      expect(UserRole.Admin).toBe('admin');
    });

    it('should have Agent role with correct value', () => {
      expect(UserRole.Agent).toBe('agent');
    });
  });
});
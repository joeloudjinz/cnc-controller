import { injectable } from 'inversify';
import { User } from '../models/User';
import { CreateUserDto, UpdateUserDto } from '../dto/UserDto';
import { IUserService } from './interfaces/IUserService';
import { UserRepository } from '../repositories/UserRepository';
import { EntityNotFoundError, DuplicateEntityError } from '../errors/AppError';
import * as bcrypt from 'bcrypt';
import { BaseService } from './base/BaseService';

@injectable()
export class UserService extends BaseService implements IUserService {
  constructor(private userRepository: UserRepository) {
    super();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with email already exists
    const existingUserByEmail = await this.userRepository.existsByEmail(createUserDto.email);
    if (existingUserByEmail) {
      throw new DuplicateEntityError('User', 'email', createUserDto.email);
    }

    // Check if user with username already exists
    const existingUserByUsername = await this.userRepository.existsByUsername(createUserDto.username);
    if (existingUserByUsername) {
      throw new DuplicateEntityError('User', 'username', createUserDto.username);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create the user with hashed password
    const user = await this.userRepository.createNew({
      ...createUserDto,
      password: hashedPassword,
    });

    // Remove password from return object for security using base class method
    return this.prepareForResponse(user) as User;
  }

  async findUserById(id: number): Promise<User | null> {
    this.validateId(id); // Using base class validation
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new EntityNotFoundError('User', id);
    }
    return this.prepareForResponse(user) as User;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findByUsername(username);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    this.validateId(id); // Using base class validation
    
    // Check if a user with the new email already exists (if email is being updated)
    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findByEmail(updateUserDto.email);
      if (existingUser && existingUser.id !== id) {
        throw new DuplicateEntityError('User', 'email', updateUserDto.email);
      }
    }

    // Check if a user with the new username already exists (if username is being updated)
    if (updateUserDto.username) {
      const existingUser = await this.userRepository.findByUsername(updateUserDto.username);
      if (existingUser && existingUser.id !== id) {
        throw new DuplicateEntityError('User', 'username', updateUserDto.username);
      }
    }

    const updatedUser = await this.userRepository.updateById(id, updateUserDto);
    
    if (!updatedUser) {
      throw new EntityNotFoundError('User', id);
    }

    return this.prepareForResponse(updatedUser) as User;
  }

  async deleteUser(id: number): Promise<boolean> {
    this.validateId(id); // Using base class validation
    const result = await this.userRepository.deleteById(id);
    if (!result) {
      throw new EntityNotFoundError('User', id);
    }
    return result;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    return this.prepareCollectionForResponse(users) as User[];
  }
}
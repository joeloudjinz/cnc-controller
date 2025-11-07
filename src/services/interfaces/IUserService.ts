import { User } from '../models/User';
import { CreateUserDto, UpdateUserDto } from '../dto/UserDto';

export interface IUserService {
  createUser(createUserDto: CreateUserDto): Promise<User>;
  findUserById(id: number): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserByUsername(username: string): Promise<User | null>;
  updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User | null>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
}
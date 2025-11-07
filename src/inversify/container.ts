import { Container } from 'inversify';
import { TYPES } from './types';
import { UserService } from '../services/UserService';
import { ConversionService } from '../services/ConversionService';
import { IUserService } from '../services/interfaces/IUserService';
import { IConversionService } from '../services/interfaces/IConversionService';
import { UserRepository } from '../repositories/UserRepository';
import { ConversionRepository } from '../repositories/ConversionRepository';
import { AppDataSource } from '../database/data-source';

const container = new Container();

// Bind the DataSource
container.bind(TYPES.DataSource).toConstantValue(AppDataSource);

// Bind repositories
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind<ConversionRepository>(TYPES.ConversionRepository).to(ConversionRepository).inSingletonScope();

// Bind services and their interfaces
container.bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
container.bind<IConversionService>(TYPES.IConversionService).to(ConversionService).inSingletonScope();
container.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
container.bind<ConversionService>(TYPES.ConversionService).to(ConversionService).inSingletonScope();

// The dynamic value bindings are unnecessary since the services are already bound
// to their interfaces with proper constructor injection
// Just remove these redundant bindings

export { container };
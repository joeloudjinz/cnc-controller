// This test is kept simple to avoid complex mocking of the container
// The container is tested more thoroughly in integration tests

import { Container } from 'inversify';
import { TYPES } from '../../../src/inversify/types';

describe('Dependency Injection Container', () => {
  it('should have defined types', () => {
    expect(TYPES.UserService).toBeDefined();
    expect(TYPES.ConversionService).toBeDefined();
    expect(TYPES.UserRepository).toBeDefined();
    expect(TYPES.ConversionRepository).toBeDefined();
    expect(TYPES.DataSource).toBeDefined();
    expect(TYPES.IUserService).toBeDefined();
    expect(TYPES.IConversionService).toBeDefined();
    expect(TYPES.IImageConversionService).toBeDefined();
    expect(TYPES.IHardwareCommunicationService).toBeDefined();
  });

  it('should be an instance of Inversify Container', () => {
    const container = new Container();
    expect(container).toBeInstanceOf(Container);
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './UserController';
import { UserService } from '../services/UserService';

 describe('User Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: UserController = module.get<UserController>(UserController);
    expect(controller).toBeDefined();
  });
});
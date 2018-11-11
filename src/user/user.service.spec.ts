import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { BadGatewayException } from '@nestjs/common';

 describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    find() {
      return [
        { id: 1, email: 'test1@email.com', fullname: 'TestName1', password: 'root' },
        { id: 2, email: 'test2@email.com', fullname: 'TestName2', password: 'root' },
      ];
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return users', async () => {
    const users = await service.findAll();
    expect(users.length).toBe(2);
    expect(users[0].fullname).toEqual('TestName1');
  });
});
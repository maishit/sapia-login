import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Users } from './schemas/users.scheam';

const mockUser: Partial<Users> = {
  username: 'admin',
  password: '123456',
  attemptTimes: 0,
  lockUntil: 0,
};

describe('UsersService', () => {
  let userSrv: UsersService;
  let mockUserModel;
  let mockConfigService: {
    get: jest.Mock;
  };

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn().mockResolvedValue(mockUser),
      updateOne: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn((key) => {
        if (key === 'MAX_LOGIN_ATTEMPTS') return 5;
        if (key === 'LOGIN_LOCK_TIME') return 15;
      }),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(Users.name),
          useValue: mockUserModel,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    userSrv = moduleRef.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userSrv).toBeDefined();
  });

  it('getUserByUserName should return a user', async () => {
    const username = 'Hano';
    const mockUser = {
      username: username,
      password: '123',
      attemptTimes: 0,
      lockUntil: 0,
    };
    mockUserModel.findOne.mockReturnValue(Promise.resolve(mockUser));

    const user = await userSrv.getUserByUserName(username);
    // console.log(user);
    // console.log(mockUser);
    expect(user).toEqual(mockUser);
    expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: username });
  });

  it('should increase attempt times', async () => {
    await userSrv.incLoginAttemptTimes(mockUser as Users);

    expect(mockUserModel.updateOne).toHaveBeenCalledWith(
      { username: 'admin' },
      {
        $inc: { attemptTimes: 1 },
      },
    );
  });

  it('should lock the user when maximum attempts reached', async () => {
    const username = 'Hano';
    const user = { username: username, attemptTimes: 4, lockUntil: 0 } as Users;

    await userSrv.incLoginAttemptTimes(user);

    expect(mockUserModel.updateOne).toHaveBeenCalledWith(
      { username: username },
      {
        $inc: { attemptTimes: 1 },
        $set: { lockUntil: expect.any(Number) },
      },
    );
  });

  it('removeUserLock should reset user lock and attempt times', async () => {
    const mockUser: Partial<Users> = {
      username: 'Hano',
      attemptTimes: 4,
      lockUntil: 1713364378,
      save: jest.fn().mockResolvedValue({
        lockUntil: 0,
        attemptTimes: 0,
      }),
    };
    const result = await userSrv.removeUserLock(mockUser as Users);
    expect(result.lockUntil).toBe(0);
    expect(result.attemptTimes).toBe(0);
    expect(mockUser.save).toHaveBeenCalled();
  });
});

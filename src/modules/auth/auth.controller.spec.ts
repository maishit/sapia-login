import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-request.dto';
import { ResponseService } from '../common/response.service';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: AuthService;
  let mockResponseService: ResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({
              accessToken: 'mock-access-token',
            }),
          },
        },
        {
          provide: ResponseService,
          useValue: mockResponseService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    mockAuthService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call AuthService.login with correct parameters', async () => {
      const loginDto: LoginDto = { username: 'test', password: 'test123' };
      await controller.login(loginDto);
      expect(mockAuthService.login).toHaveBeenCalledWith('test', 'test123');
    });

    it('should return a valid login response', async () => {
      const loginDto: LoginDto = { username: 'test', password: 'test123' };
      const result = await controller.login(loginDto);
      expect(result).toEqual({ accessToken: 'mock-access-token' });
    });
  });
});

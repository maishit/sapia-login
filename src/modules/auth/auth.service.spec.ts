import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UtilsService } from '../common/utils.service';
import { PasswordService } from './password.service';
import { LoginResponse } from './response/login.response';
import { Users } from '../users/schemas/users.scheam';

jest.mock('../users/users.service');
jest.mock('../common/utils.service');
jest.mock('./password.service');
jest.mock('@nestjs/jwt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let utilsService: UtilsService;
  let passwordService: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        JwtService,
        UtilsService,
        PasswordService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    utilsService = module.get<UtilsService>(UtilsService);
    passwordService = module.get<PasswordService>(PasswordService);
  });

  it('should throw UnauthorizedException if user not found', async () => {
    jest.spyOn(usersService, 'getUserByUserName').mockResolvedValue(null);
    jest
      .spyOn(utilsService, 'getLangContent')
      .mockReturnValue('User not found');

    await expect(service.login('nonexistent', 'password')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if user is locked', async () => {
    const lockedUser = {
      username: 'hano',
      lockUntil: Date.now() + 1000,
    } as Users;
    jest.spyOn(usersService, 'getUserByUserName').mockResolvedValue(lockedUser);
    jest
      .spyOn(utilsService, 'getLangContent')
      .mockReturnValue('User is locked');

    await expect(service.login('john', 'password')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should unlock the user when lock has expired', async () => {
    const lockedUser = {
      username: 'hano',
      lockUntil: Date.now() - 1000,
    } as Users;
    jest.spyOn(usersService, 'getUserByUserName').mockResolvedValue(lockedUser);
    const removeUserLockSpy = jest
      .spyOn(usersService, 'removeUserLock')
      .mockImplementation();

    await service.login('hano', 'password').catch(() => {});
    expect(removeUserLockSpy).toHaveBeenCalledWith(lockedUser);
  });

  it('should throw UnauthorizedException for wrong password', async () => {
    const user = { username: 'hano', password: 'hashedPassword' } as Users;
    jest.spyOn(usersService, 'getUserByUserName').mockResolvedValue(user);
    jest.spyOn(passwordService, 'comparePasswords').mockResolvedValue(false);
    jest
      .spyOn(utilsService, 'getLangContent')
      .mockReturnValue('Invalid password');

    await expect(service.login('hano', 'wrongPassword')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should return a valid login response on successful login', async () => {
    const user = {
      _id: '123',
      username: 'hano',
      password: 'hashedPassword',
    } as Users;
    const expectedToken = 'token';
    jest.spyOn(usersService, 'getUserByUserName').mockResolvedValue(user);
    jest.spyOn(passwordService, 'comparePasswords').mockResolvedValue(true);
    jest.spyOn(jwtService, 'sign').mockReturnValue(expectedToken);
    LoginResponse.toResponse = jest
      .fn()
      .mockReturnValue({ accessToken: expectedToken });

    const result = await service.login('hano', 'correctPassword');
    expect(result).toEqual({ accessToken: expectedToken });
  });
});

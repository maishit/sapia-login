import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hashSync: jest.fn(),
  compare: jest.fn(),
}));

describe('PasswordService', () => {
  let service: PasswordService;
  let bcryptHashSyncSpy: jest.SpyInstance;
  let bcryptCompareSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
    bcryptHashSyncSpy = jest.spyOn(bcrypt, 'hashSync');
    bcryptCompareSpy = jest.spyOn(bcrypt, 'compare');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should hash a password correctly', () => {
    const password = 'helloworld666';
    const expectedHash = 'hashedPassword';
    bcryptHashSyncSpy.mockReturnValue(expectedHash);

    const result = service.hashPassword(password);

    expect(bcryptHashSyncSpy).toHaveBeenCalledWith(password, 10);
    expect(result).toEqual(expectedHash);
  });

  it('should return true when passwords match', async () => {
    const password = 'helloworld666';
    const storedPassword = 'storedHashedPassword';
    bcryptCompareSpy.mockResolvedValue(true);

    const result = await service.comparePasswords(password, storedPassword);

    expect(bcryptCompareSpy).toHaveBeenCalledWith(password, storedPassword);
    expect(result).toBeTruthy();
  });

  it('should return false when passwords do not match', async () => {
    const password = 'helloworld666';
    const storedPassword = 'storedHashedPassword';
    bcryptCompareSpy.mockResolvedValue(false);

    const result = await service.comparePasswords(password, storedPassword);

    expect(bcryptCompareSpy).toHaveBeenCalledWith(password, storedPassword);
    expect(result).toBeFalsy();
  });
});

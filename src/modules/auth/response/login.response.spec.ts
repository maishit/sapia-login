import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { LoginResponse } from './login.response';
import { LoginResponseDto } from '../dto/login-response.dto';

jest.mock('class-transformer', () => ({
  plainToInstance: jest.fn().mockImplementation((cls, obj, opts) => {
    return { ...obj };
  }),
  Expose: jest.fn(),
}));

jest.mock('class-validator', () => ({
  validateOrReject: jest.fn().mockResolvedValue(undefined),
  IsJWT: jest.fn(),
}));

describe('LoginResponse', () => {
  it('should correctly assign partial object to the instance via constructor', () => {
    const partialDto: Partial<LoginResponseDto> = {
      accessToken: 'access_token',
    };
    const instance = new LoginResponse(partialDto);
    expect(instance.accessToken).toBe(partialDto.accessToken);
  });

  it('should transform and validate data successfully', async () => {
    const mockData = { accessToken: 'valid.jwt.token' };

    const result = await LoginResponse.toResponse(mockData);

    expect(plainToInstance).toHaveBeenCalledWith(LoginResponseDto, mockData, {
      excludeExtraneousValues: true,
    });
    expect(validateOrReject).toHaveBeenCalledWith(result);
    expect(result).toEqual(mockData);
  });

  it('should throw an error if validation fails', async () => {
    const mockData = { accessToken: 'invalid.jwt.token' };
    const validationError = new Error('Validation failed');
    (validateOrReject as jest.Mock).mockRejectedValueOnce(validationError);
    expect(LoginResponse.toResponse(mockData)).rejects.toThrow(
      'Validation failed',
    );

    expect(plainToInstance).toHaveBeenCalledWith(LoginResponseDto, mockData, {
      excludeExtraneousValues: true,
    });
    expect(validateOrReject).toHaveBeenCalledWith(mockData);
  });
});

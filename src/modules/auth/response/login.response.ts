import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { LoginResponseDto } from '../dto/login-response.dto';

export class LoginResponse {
  accessToken?: string;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }

  static async toResponse(data: object) {
    const loginRespDto = plainToInstance(LoginResponseDto, data, {
      excludeExtraneousValues: true,
    });
    await validateOrReject(loginRespDto);
    return loginRespDto;
  }
}

import { Expose } from 'class-transformer';
import { IsJWT } from 'class-validator';

export class LoginResponseDto {
  @Expose()
  @IsJWT()
  accessToken: string;
}

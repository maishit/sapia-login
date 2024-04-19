import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginDto {
  @IsString({
    message: i18nValidationMessage('auth.fields.username_istring'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('auth.fields.username_required'),
  })
  readonly username: string;

  @IsString({
    message: i18nValidationMessage('auth.fields.password_istring'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('auth.fields.password_required'),
  })
  readonly password: string;
}

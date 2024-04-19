import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UtilsService } from '../common/utils.service';
import { PasswordService } from './password.service';
import { LoginResponse } from './response/login.response';

@Injectable()
export class AuthService {
  constructor(
    private usersSrv: UsersService,
    private jwtSrv: JwtService,
    private utilsSrv: UtilsService,
    private passwordSrv: PasswordService,
  ) {}

  /**
   * Login service
   * @param username
   * @param password
   * @returns
   */
  async login(username: string, password: string) {
    const user = await this.usersSrv.getUserByUserName(username);
    if (!user) {
      throw new UnauthorizedException(
        this.utilsSrv.getLangContent('auth.user_not_found'),
      );
    }
    if (user.lockUntil) {
      if (user.lockUntil > Date.now()) {
        throw new UnauthorizedException(
          this.utilsSrv.getLangContent('auth.user_locked'),
        );
      } else {
        this.usersSrv.removeUserLock(user);
      }
    }

    if (!(await this.passwordSrv.comparePasswords(password, user.password))) {
      this.usersSrv.incLoginAttemptTimes(user);
      throw new UnauthorizedException(
        this.utilsSrv.getLangContent('auth.invalid_password'),
      );
    }

    const payload = { sub: user._id.toString(), username: user.username };
    return LoginResponse.toResponse({
      accessToken: this.jwtSrv.sign(payload),
    });
  }
}

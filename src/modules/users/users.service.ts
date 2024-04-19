import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schemas/users.scheam';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private configSrv: ConfigService,
    @InjectModel(Users.name) private userModel: Model<Users>,
  ) {}

  /**
   * Get user by username
   * @param username
   * @returns
   */
  async getUserByUserName(username: string): Promise<Users | undefined> {
    return await this.userModel.findOne({ username: username });
  }

  /**
   * Increase the number of login attempts
   * @param user
   * @returns
   */
  async incLoginAttemptTimes(user: Users) {
    const update = {
      $inc: { attemptTimes: 1 },
    };
    if (user.attemptTimes >= this.configSrv.get('MAX_LOGIN_ATTEMPTS') - 1) {
      update['$set'] = {
        lockUntil:
          Date.now() + this.configSrv.get('LOGIN_LOCK_TIME') * 60 * 1000,
      };
    }

    return await this.userModel.updateOne({ username: user.username }, update);
  }

  /**
   * Remove user lock
   * @param user
   * @returns
   */
  async removeUserLock(user: Users) {
    user.lockUntil = 0;
    user.attemptTimes = 0;
    return await user.save();
  }
}

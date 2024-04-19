import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly saltRounds: number = 10;

  /**
   * Generate hash password
   * @param password
   * @returns
   */
  hashPassword(password: string): string {
    return bcrypt.hashSync(password, this.saltRounds);
  }

  /**
   * Compare user input password with stored password
   * @param password
   * @param storedPassword
   * @returns
   */
  async comparePasswords(
    password: string,
    storedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, storedPassword);
  }
}

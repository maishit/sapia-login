import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from 'src/modules/users/schemas/users.scheam';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { PasswordService } from 'src/modules/auth/password.service';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectModel(Users.name) private userModel: Model<Users>,
    private passwordSrv: PasswordService,
  ) {}

  async seed(): Promise<any> {
    // Generate 10 users.
    const users = DataFactory.createForClass(Users).generate(10, {
      passwordSrv: this.passwordSrv,
    });

    const hano = {
      username: 'hano',
      password: this.passwordSrv.hashPassword('123456'),
      lockUntil: 0,
      attemptTimes: 0,
    } as Users;
    await this.userModel.create(hano);

    // Insert into the database.
    return this.userModel.insertMany(users);
  }

  async drop(): Promise<any> {
    return this.userModel.deleteMany({});
  }
}

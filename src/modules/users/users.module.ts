import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users, UsersSchema } from './schemas/users.scheam';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
  ],
})
export class UsersModule {}

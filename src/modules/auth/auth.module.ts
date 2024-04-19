import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from '../users/schemas/users.scheam';
import { CommonModule } from '../common/common.module';
import { PasswordService } from './password.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordService],
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configSrv: ConfigService) => ({
        secret: configSrv.get('JWT_SECRET'),
        signOptions: { expiresIn: configSrv.get('JWT_TTL') },
        global: true,
      }),
    }),
    CommonModule,
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
  ],
})
export class AuthModule {}

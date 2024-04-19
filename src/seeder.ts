import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from 'src/modules/users/schemas/users.scheam';
import { UsersSeeder } from './seeders/users.seeder';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { parseEnv } from './config/env';
import { PasswordService } from './modules/auth/password.service';

seeder({
  providers: [PasswordService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [parseEnv().path],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configSrv: ConfigService) => ({
        uri: configSrv.get('MONGODB_CONNECTION'),
      }),
    }),
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
  ],
}).run([UsersSeeder]);

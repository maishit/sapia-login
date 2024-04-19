import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { parseEnv } from './config/env';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './modules/common/common.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception/http-exception.filter';
import { UsersModule } from './modules/users/users.module';
import {
  HeaderResolver,
  I18nJsonLoader,
  I18nModule,
  I18nValidationPipe,
} from 'nestjs-i18n';
import * as path from 'path';
import { I18nValidationExceptionFilterOptions } from './types/validation.type';
import { ParamValidationExceptionFilter } from './filters/param-validation-exception/param-validation-exception.filter';

@Module({
  imports: [
    AuthModule,
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
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configSrv: ConfigService) => ({
        fallbackLanguage: configSrv.get('SHOW_LANG', 'en'),
        loader: I18nJsonLoader,
        loaderOptions: {
          path: path.join(__dirname, '/lang/'),
          watch: true,
        },
      }),
      resolvers: [new HeaderResolver(['x-lang'])],
    }),
    CommonModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ParamValidationExceptionFilter,
    },
    {
      provide: 'I18nValidationExceptionFilterOptions',
      useValue: {
        detailedErrors: false,
      } as I18nValidationExceptionFilterOptions,
    },
    {
      provide: APP_PIPE,
      useClass: I18nValidationPipe,
    },
  ],
})
export class AppModule {}

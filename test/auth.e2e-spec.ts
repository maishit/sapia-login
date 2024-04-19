// file: test/auth.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  jest.spyOn(Date, 'now').mockImplementation(() => 1713401308000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return user not found', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'userNotFound', password: 'test123' })
      .expect(401)
      .then((response) => {
        expect(response.body).toEqual({
          data: {},
          message: 'User not found',
          code: 1001,
          cur_time: 1713401308,
        });
      });
  });

  it('should return a token', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'hano', password: '123456' })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          data: { accessToken: expect.any(String) },
          message: 'success',
          code: 1000,
          cur_time: 1713401308,
        });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});

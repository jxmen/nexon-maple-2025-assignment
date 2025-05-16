import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../../src/auth/auth.module';
import { UserCreateRequest } from '../../src/auth/dto/user.create-request';
import { AuthService } from '../../src/auth/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [AuthService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /auth/sign-up 요청은', () => {
    test('Auth Server로 요청이 바로 전달된다.', async () => {
      const userCreateRequest = new UserCreateRequest('박주영', 'password');

      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(JSON.stringify(userCreateRequest));

      expect(response.status).toBe(201);
    });
  });
});

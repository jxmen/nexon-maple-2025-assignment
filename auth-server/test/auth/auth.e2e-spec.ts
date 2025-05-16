import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';
import { AuthController } from '../../src/auth/auth.controller';
import UserCreateRequest from '../../src/user/user.create-request';
import { User, UserSchema } from '../../src/user/user.schema';
import { AuthModule } from '../../src/auth/auth.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongod.getUri()),
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
        ]),
        AuthModule,
      ],
      controllers: [AuthController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    if (mongod) await mongod.stop();
  });

  describe('POST /auth/sign-up 요청은', () => {
    describe('존재하지 않는 유저 id의 요청일 경우', () => {
      beforeEach(() => {
        // TODO: mongodb user collection 모두 삭제
      });

      it('201을 응답한다', async () => {
        const dto = new UserCreateRequest('jxmen', 'password');
        const res = await request(app.getHttpServer())
          .post('/auth/sign-up')
          .send(JSON.stringify(dto));

        expect(res.status).toBe(201);
      });
    });

    describe('존재하는 유저에 대한 요청일 경우', () => {
      // TODO

      it('400을 응답한다', () => {
        // TODO
      });
    });
  });
});

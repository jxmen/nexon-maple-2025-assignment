import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from '../../src/app.controller';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';

class UserCreateRequest {
  constructor(name: string, password: string) {
    this.name = name;
    this.password = password;
  }

  name: string;
  password: string;
}

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(mongod.getUri())],
      controllers: [AppController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    if (mongod) await mongod.stop();
  });

  describe('POST /auth/signup 요청은', () => {
    describe('존재하지 않는 유저 이름의 요청일 경우', () => {
      beforeEach(() => {
        mongod.cleanup();
      });

      it('201을 응답한다', async () => {
        const dto = new UserCreateRequest('박주영', 'password');
        const res = await request(app.getHttpServer())
          .post('/auth/signup')
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

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { UserCreateRequest } from '../../src/auth/dto/user.create-request';
import { UserCreateResponse } from '../../src/auth/dto/user.create-response';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: { signUp: jest.Mock };

  beforeEach(async () => {
    mockAuthService = { signUp: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('POST /auth/sign-up 요청은', () => {
    it('Auth Client Proxy가 호출된다.', async () => {
      mockAuthService.signUp.mockReturnValue(new UserCreateResponse());

      const dto = new UserCreateRequest('박주영', 'password');
      await controller.signUp(dto);

      expect(mockAuthService.signUp).toHaveBeenCalled();
    });
  });
});

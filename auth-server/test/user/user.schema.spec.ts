import { User } from '../../src/user/user.schema';
import { PasswordEncoder } from '../../src/password-encoder';
import { Promise } from 'mongoose';

class DummyPasswordEncoder implements PasswordEncoder {
  encode(password: string): string {
    return '';
  }

  verify(rawPassword: string, userPassword: string): Promise<boolean> {
    return Promise.resolve(false);
  }
}

describe('User', () => {
  describe('SingUp 메서드는', () => {
    it('생성 시 role이 user로 설정된다', () => {
      const user = User.signUp('jxmen', 'password', new DummyPasswordEncoder());

      expect(user.role).toBe('user');
    });
  });
});

import { BcryptPasswordEncoder } from '../../src/auth/bcrypt-password-encoder';
import { PasswordEncoder } from '../../src/password-encoder';

describe('BcryptPasswordEncoder', () => {
  let encoder: PasswordEncoder;

  beforeEach(() => {
    encoder = new BcryptPasswordEncoder();
  });

  describe('encode 메서드는', () => {
    it('암호화되고 기존 비밀번호와 다른 값을 리턴한다', () => {
      const rawPassword = 'password';
      const encoded = encoder.encode('password');

      expect(rawPassword).not.toBe(encoded);
      expect(encoded).toHaveLength(60);
    });
  });

  describe('verify 메서드는', () => {
    it.each(['', ' ', 'password ', 'password ', ' password', ' password '])(
      '다른 암호를 입력할 경우 false를 리턴한다: "%s"',
      async (rawPassword) => {
        const encoded = encoder.encode('password');
        const result = await encoder.verify(rawPassword, encoded);

        expect(result).toBeFalsy();
      },
    );

    it('암호화 전 비밀번호와 암호화 후 비밀번호를 넣으면 true를 리턴한다', async () => {
      const rawPassword = 'password';
      const encoded = encoder.encode('password');

      const result = await encoder.verify(rawPassword, encoded);

      expect(result).toBeTruthy();
    });
  });
});

import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async set(key: string, value: string, ttlSeconds: number = 3) {
    // EX - 1은 1초
    // NX - 키가 이미 있다면 동작하지 않음 (null 반환)
    return this.redis.set(key, value, 'EX', ttlSeconds, 'NX');
  }

  async del(key: string) {
    return this.redis.del(key);
  }
}

# test-files

API, 동시성 테스트를 위해 사용했던 파일들입니다.

- [user-api-test.http](./user-api-test.http): 유저 및 인증 관련 API 테스트 파일
- [event-api-test.http](./event-api-test.http): 이벤트/보상 관련 API 테스트 파일
- [concurrency-test.js](./concurrency-test.js): 유저 보상 API 동시 요청 테스트 파일 (K6 Script)

### K6 Script

k6가 설치되어 있다면, 다음 명령어로 테스트를 실행할 수 있습니다.

```shell
k6 run ./concurrency-test.js
```

# nexon-maple-2025-assignment

넥슨 메이플 집중채용 - 메이플스토리 PC 백엔드 과제입니다.

### 디렉토리 구조

- [ ] TODO

### 서버 실행 방법 및 유의사항

**Gateway Server PORT는 `3001`번으로 설정되어 있습니다.** API 테스트 시 `3001`번으로 요청을 보내야 합니다.

- Auth Server: `3002`
- Event Server: `3003`


```shell
$ docker-compose up -d
```

### 테스트 코드 실행

각 서버별 프로젝트 폴더로 이동하여, `npm test` 명령어를 실행합니다. npm 명령어가 있어야 합니다.

```shell
$ cd event-server/

$ npm test # 테스트 실행
```

### 서버 및 데이터베이스 구성

- [ ] TODO

### API 문서

- [ ] TODO

### 프로젝트 중점 사항

- 자주 변경될 수 있는 부분에 한하여 인터페이스 추출
- 핵심 도메인 로직에 대한 단위 테스트 케이스 작성 
  - [event-entity.spec.ts](./apps/event-server/test/event/event-entity.spec.ts)
- MongoDB 철학에 따른 데이터 중복 허용을 고려하여 스키마 설계
- [K6 Script](./concurrency-test.js)를 활용하여 동시성 이슈 테스트
- Redis로 스로틀링 기능 구현하여 중복 요청 방지 ([PR #18](https://github.com/jxmen/nexon-maple-2025-assignment/pull/18))
- [NestJS Interceptor](https://docs.nestjs.com/interceptors) 기능을 사용하여 관심사
  분리 ([PR #19](https://github.com/jxmen/nexon-maple-2025-assignment/pull/19))

### API 테스트 시 사용한 파일

제가 API 테스트 시 사용한 파일입니다. 필요 시 참고 부탁드립니다!

- 유저 및 인증 관련 API 테스트 파일 - ([user-api-test.http](./user-api-test.http))
- 이벤트/보상 관련 API 테스트 파일 - ([event-api-test.http](./event-api-test.http))

### 회고

- [ ] 좋았던 점
    - MSA 구조에 대해 어느 정도 익숙해진 점
- [ ] 아쉬운 점
    - monorepo 구조를 도입하지 못했던 것.
        - gateway <-> 타 서버 통신 시 서로 공유하는 코드를 가지고 있지 않아 중복 코드 발생. 
    - API 요청/응답 구조를 통일하지 못한 것.
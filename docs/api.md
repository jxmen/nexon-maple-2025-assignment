# API 문서

테스트 시에 사용한 파일은 [test-files](../test-files) 디렉토리에 있습니다.

## 회원가입(유저 등록)

회원가입을 진행합니다. 각 입력값의 검증은 따로 없습니다.

```
POST http://localhost:3001/auth/sign-up
Content-Type: application/json

{
    "id": "jxmen",
    "password": "password"
}
```

- id: 유저 고유 식별자
- password: 로그인 시 사용할 정보

### 응답 상태

- 201: 정상 수행 되었을경우
- 400: 이미 존재하는 아이디일경우

### 실패1 - id 이미 존재

```json
{
  "message": "아이디 'jxmen'는 이미 존재하여 회원가입을 진행할 수 없습니다.",
  "error": "Bad Request",
  "statusCode": 400
}
```

## 로그인

회원 가입 시 사용한 id, password를 사용하여 로그인합니다.

```
POST http://localhost:3001/auth/sign-in
Content-Type: application/json

{
    "id": "jxmen",
    "password": "password"
}
```

### 응답 상태

- 200: 로그인 성공
- 401: 비밀번호가 다르거나, 유저 정보를 찾을 수 없을 경우

### 응답 예제

```json
{
  "status": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqeG1lbiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ3NjkyNjgwLCJleHAiOjE3NDc2OTYyODB9.LYk2AoNJLvwHdR8IhS2jWJdIXgXmLphSvt3HSW5OiOQ",
    "accessTokenExpired": "2025-05-19T23:11:20.423Z"
  },
  "error": null
}
```

### 실패 예제

```json
{
  "message": "로그인에 실패하였습니다.",
  "error": "Unauthorized",
  "statusCode": 401
}
```

## 이벤트 생성

이벤트를 생성합니다.

- 권한: 관리자, 운영자

```
POST http://localhost:3001/events
Content-Type: application/json
Authorization: Bearer {{admin_access_token}}

{
    "name": "05/17 접속 이벤트 - 접속만 해도 보상이 와르르 (1회 한정)",
    "code": "20250517-check-in",
    "type": "check-in",
    "condition": {},
    "start_date": "2025-05-17T00:00:00Z",
    "end_date": "2025-06-02T23:59:59Z"
}
```

- name: 이벤트 이름
- code: **이벤트를 구별하는 고유 식별자**
- type: 이벤트 유형
    - check-in: 출석체크 (아무 조건 없이 바로 지급 가능)
- condition: 이벤트 충족 조건
    - type에 따라 값이 채워집니다. 예) type: invite_friends일 경우, { invite_friends: 3 }
- start_date: 이벤트 시작일
- end_date: 이벤트 종료일

### 응답 상태

- 201: 생성 완료
- 403: 권한이 없을 경우 (예: 유저가 이벤트 생성 시도)
- 409: 이미 존재하는 이벤트 코드

### 성공 응답 예제

```json
{
  "status": 201,
  "result": "success"
}
```

### 실패1: 이미 존재하는 이벤트 코드

```json
{
  "message": "이미 존재하는 이벤트 코드이므로 저장할 수 없습니다.",
  "error": "Conflict",
  "statusCode": 409
}
```

### 실패2: 권한이 없는 사용자가 생성 시도

```json
{
  "message": "Forbidden resource",
  "error": "Forbidden",
  "statusCode": 403
}
```

## 이벤트 목록 조회

전체 이벤트 목록을 조회합니다.

```
GET http://localhost:3001/events
```

### 응답 예시

```json
{
  "status": 200,
  "result": "success",
  "data": [
    {
      "name": "05/17 접속 이벤트 - 접속만 해도 보상이 와르르 (1회 한정)",
      "code": "20250517-check-in",
      "type": "check-in",
      "status": "activate",
      "start_date": "2025-05-17T00:00:00.000Z",
      "end_date": "2025-06-02T23:59:59.000Z"
    }
  ]
}
```

- data[]: 이벤트 정보

## 이벤트 상세 조회

이벤트 코드로 이벤트에 대한 정보를 조회합니다.

```
GET http://localhost:3001/events/{{event_code}}
```

### 응답 예제

```json
{
  "status": 200,
  "result": "success",
  "data": {
    "name": "05/17 접속 이벤트 - 접속만 해도 보상이 와르르 (1회 한정)",
    "code": "20250517-check-in",
    "type": "check-in",
    "status": "activate",
    "start_date": "2025-05-17T00:00:00.000Z",
    "end_date": "2025-06-02T23:59:59.000Z"
  }
}
```

- data: 이벤트 정보

## 이벤트 보상 등록

이벤트에 대한 보상을 추가합니다.

- 권한: 관리자/운영자

```
POST http://localhost:3001/events/{{event_code}}/rewards
Content-Type: application/json
Authorization: Bearer {{operator_access_token}}

{
  "items": {
    "meso": 1000,
    "exp": 30000,
    "event_coin": 5
  }
}
```

- items(필수): 보상에 대한 값들을 추가합니다. 어떤 키값이 와도 상관없으며, 값은 반드시 정수여야 합니다.
    - 한 개 이상이 반드시 있어야 합니다.

### 응답 상태

- 201: 생성 완료
- 409: 이미 생성됨

### 성공 예제

```
{
  "status": 201,
  "result": "success"
}
```

### 실패 예제 - 이미 보상 생성됨

```json
{
  "message": "이미 이벤트에 대한 보상이 생성되었습니다.",
  "error": "Conflict",
  "statusCode": 409
}
```

## 보상 목록 조회

이벤트 정보가 포함된 보상 목록을 조회합니다.

```
GET http://localhost:3001/rewards
```

### 응답 예제

```
{
  "status": 200,
  "result": "success",
  "data": [
    {
      "items": {
        "meso": 1000,
        "exp": 30000,
        "event_coin": 5
      },
      "event": {
        "code": "20250517-check-in",
        "name": "05/17 접속 이벤트 - 접속만 해도 보상이 와르르 (1회 한정)"
      }
    }
  ]
```

- data[].items: 보상
- data[].event: 이벤트 정보
- data[].event.code: 이벤트 식별자

## 보상 요청

이벤트에 할당된 보상을 요청합니다. 이벤트 조건, 사용자가 이벤트 조건 충족 여부 등을 검증합니다.

- 권한: 사용자

```
POST http://localhost:3001/events/{{event_code}}/reward-request
Content-Type: application/json
Authorization: Bearer {{user_access_token}}
```

- event_code: 이벤트 고유 식별자

### 성공 응답 예제

```json
{
  "status": 200,
  "result": "success",
  "message": "보상이 성공적으로 지급되었습니다.",
  "data": {
    "items": {
      "meso": 1000,
      "exp": 30000,
      "event_coin": 5
    }
  }
}
```

- data.items: 지급될 보상 정보

### 응답 상태

- 200: 보상 지급 완료
- 409: 이미 지급되었을 경우
  ```json
  {
    "message": "보상이 이미 지급되었습니다.",
    "error": "Conflict",
    "statusCode": 409
  }
  ```
- 429: 짧은 시간에 여러번 요청을 보낸 경우 (**중복 요청 방지**)
  ```json
    {
      "statusCode": 429,
      "message": "요청이 너무 빠릅니다. 잠시 후 다시 시도해주세요."
    }
  ```

### 보상 요청 내역 목록 조회 (사용자용)

보상을 요청한 내역을 조회합니다. **자기 자신의 내역만 조회됩니다.**

```
GET http://localhost:3001/me/reward-requests?event_code={{event_code}}
Authorization: Bearer {{user_access_token}}
```

- 권한: 사용자

### 응답 예제

```json
{
  "result": "success",
  "data": {
    "user_id": "jxmen",
    "requests": [
      {
        "event_code": "20250517-check-in",
        "status": "failed",
        "created_at": "2025-05-19T21:37:17.068Z"
      },
      {
        "event_code": "20250517-check-in",
        "status": "failed",
        "created_at": "2025-05-19T21:39:26.568Z"
      }
    ]
  }
}
```
- data.user_id: 유저 고유 식별자
- data.requests[].event_code: 이벤트 고유 식별자
- data.requests[].status: `'success'` | `'failed'`: 요청 상태
  - success: 지급 완료
  - failed: 지급 실패 (요청했으나 받아들여지지 않음) 
- data.requests[].created_at: 요청 생성일

## 보상 요청 내역 목록 조회 (관리자/감시자/운영자용)

**전체 유저**의 보상 요청 내역 목록을 조회합니다.

```
GET http://localhost:3001/reward-requests?event_code={{event_code}}&status=success
Authorization: Bearer {{admin_access_token}}
```
- event_code: 고유 식별자

### 응답 예제

```json
{
  "result": "success",
  "data": [
    {
      "event_code": "20250517-check-in",
      "user_id": "jxmen",
      "status": "success",
      "created_at": "2025-05-19T22:33:44.272Z"
    }
  ]
}
```
- data: 전체 유저의 보상 요청 내역



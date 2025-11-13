# OpenAPI 코드 자동 생성 통합 가이드

## 📋 개요

Backend의 OpenAPI(Swagger) 스펙으로부터 TypeScript 코드를 자동 생성하여 Frontend와 Backend 간의 타입 안정성을 보장합니다.

## 🔧 설정

### 1. 의존성
`package.json`에 다음이 추가되어 있습니다:

```json
{
  "devDependencies": {
    "openapi-typescript-codegen": "^0.29.0"
  },
  "scripts": {
    "generate:api": "openapi -i http://localhost:8080/api-docs -o src/api -c axios"
  }
}
```

### 2. OpenAPI 설정
`src/config/openapi.ts`:
- Base URL 설정 (환경 변수 또는 기본값)
- JWT 토큰 자동 주입 (공개 엔드포인트 제외)
- 공개 엔드포인트: `/api/auth/login`, `/api/auth/signup`
- Credentials 설정

## 🚀 사용 방법

### API 코드 생성
```bash
# Backend 서버가 실행 중이어야 합니다
npm run generate:api
```

이 명령어는:
1. `http://localhost:8080/api-docs`에서 OpenAPI JSON 다운로드
2. `src/api/` 디렉토리에 코드 생성:
   - `core/`: API 요청 핵심 로직
   - `models/`: TypeScript 타입 정의
   - `services/`: API 서비스 클래스
   - `index.ts`: 통합 export

### 생성된 코드 사용

#### 1. 인증 API (Service)
```typescript
import { Service } from '@/api'
import type { LoginRequest, SignupRequest } from '@/api'

// 로그인
const response = await Service.login({
  username: 'user',
  password: 'pass123'
})
const token = response.data?.token

// 회원가입
await Service.signup({
  username: 'newuser',
  email: 'user@example.com',
  password: 'pass123',
  name: 'User Name'
})
```

#### 2. TODO API (TodoService)
```typescript
import { TodoService } from '@/api'
import type { TodoRequest, TodoSearchRequest } from '@/api'

// TODO 목록 조회
const response = await TodoService.getTodos({
  status: 'TODO',
  priority: 'HIGH',
  page: 0,
  size: 20
})
const todos = response.data?.content

// TODO 생성
const newTodo: TodoRequest = {
  title: '새 할 일',
  description: '설명',
  status: TodoRequest.status.TODO,
  priority: TodoRequest.priority.HIGH,
  dueDate: '2025-12-31T23:59:59'
}
const created = await TodoService.createTodo(newTodo)

// TODO 상태 변경
await TodoService.updateTodoStatus('DONE')

// TODO 삭제
await TodoService.deleteTodo()

// 통계 조회
const statsResponse = await TodoService.getUserStats()
const stats = statsResponse.data
```

#### 3. Pinia Store에서 사용
```typescript
import { TodoService } from '@/api'
import type { TodoResponse, TodoRequest } from '@/api'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<TodoResponse[]>([])
  
  const fetchTodos = async () => {
    const response = await TodoService.getTodos({})
    todos.value = response.data?.content || []
  }
  
  return { todos, fetchTodos }
})
```

## 📦 생성된 타입들

### 인증 관련
- `LoginRequest`
- `SignupRequest`
- `AuthResponse`
- `ApiResponseAuthResponse`

### TODO 관련
- `TodoRequest` (with enum: status, priority)
- `TodoResponse`
- `TodoSearchRequest`
- `TodoStatsResponse`
- `ApiResponseTodoResponse`
- `ApiResponsePageTodoResponse`

### 페이지네이션
- `PageTodoResponse`
- `PageableObject`
- `SortObject`

## 🔐 인증 처리

### 자동 토큰 주입
OpenAPI 설정에서 요청 URL에 따라 자동으로 토큰을 처리합니다:

```typescript
// 공개 엔드포인트 (토큰 불필요)
const PUBLIC_ENDPOINTS = [
  '/api/auth/login',
  '/api/auth/signup'
]

OpenAPI.TOKEN = async (options: ApiRequestOptions): Promise<string> => {
  // 로그인/회원가입은 토큰 없이 요청 (빈 문자열 반환)
  if (PUBLIC_ENDPOINTS.includes(options.url)) {
    return ''
  }
  
  // 인증이 필요한 엔드포인트만 토큰 추가
  const token = localStorage.getItem('token')
  return token || ''
}
```

### 동작 방식
- **로그인/회원가입**: Authorization 헤더 없이 요청 (빈 문자열 → 헤더 미추가)
- **TODO API**: `Authorization: Bearer {token}` 자동 추가
- **토큰 만료**: 401 에러 시 로그인 페이지로 리다이렉트 (Router Guard)

### 내부 동작 (request.ts)
`getHeaders` 함수에서 토큰 처리:
```typescript
// src/api/core/request.ts (자동 생성)
if (isStringWithValue(token)) {  // 빈 문자열이 아닐 때만
  headers['Authorization'] = `Bearer ${token}`;
}
```
- `''` (빈 문자열) → Authorization 헤더 추가 안 됨
- `'abc123...'` (실제 토큰) → Authorization 헤더 추가됨

## 🎯 장점

### 1. 타입 안정성
```typescript
// ✅ 컴파일 타임에 에러 감지
const request: TodoRequest = {
  title: '제목',
  status: TodoRequest.status.TODO,  // enum 자동완성
  wrongField: 'value'  // ❌ 타입 에러!
}
```

### 2. IDE 자동완성
- 모든 필드, 메서드 자동완성
- JSDoc 코멘트 표시
- 매개변수 힌트

### 3. 자동 동기화
Backend API가 변경되면:
1. `npm run generate:api` 실행
2. TypeScript 컴파일러가 변경 감지
3. 에러가 있는 곳을 자동으로 표시

### 4. 유지보수성
- 수동으로 타입 정의 불필요
- API 문서와 코드가 항상 일치
- 리팩토링 시 안전성 보장

## ⚠️ 주의사항

### 1. Path Parameter 이슈
현재 생성된 코드에서 일부 Path Parameter가 제대로 인식되지 않습니다:

```typescript
// 문제: todoId를 파라미터로 받지 못함
TodoService.getTodo()  // todoId가 없음
TodoService.updateTodo(data)  // todoId가 없음
TodoService.deleteTodo()  // todoId가 없음
```

**원인**: Backend Controller의 `@PathVariable` 어노테이션이 OpenAPI 스펙에 제대로 노출되지 않음

**해결방법**:
1. Backend Controller에 `@Parameter` 어노테이션 추가
2. 또는 수동으로 URL 구성

### 2. 재생성 시 덮어쓰기
`src/api/` 디렉토리의 파일들은 재생성 시 덮어씌워집니다.
- 이 디렉토리에 커스텀 코드 작성 금지
- 필요시 `src/config/` 또는 다른 곳에 wrapper 작성

### 3. Backend 서버 필요
API 코드 생성 시 Backend가 실행 중이어야 합니다.

## 🔄 워크플로우

### 일반 개발
```bash
# 1. Backend API 개발
# 2. Swagger 문서 확인 (http://localhost:8080/swagger-ui.html)
# 3. Frontend 코드 생성
npm run generate:api
# 4. Frontend 개발 (자동완성, 타입 체크 활용)
```

### API 변경 시
```bash
# 1. Backend API 수정
# 2. API 재생성
npm run generate:api
# 3. TypeScript 에러 확인 및 수정
npm run build
```

## 📚 참고 문서

- [openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen)
- [OpenAPI Specification](https://swagger.io/specification/)
- [SpringDoc OpenAPI](https://springdoc.org/)


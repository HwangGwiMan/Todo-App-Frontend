# TodoApp Frontend

Vue 3 + TypeScript + Tailwind CSS로 구축된 TodoApp 프론트엔드입니다.

## 🚀 개발 서버 실행

```bash
# 패키지 설치
npm install

# Backend API 코드 생성 (Backend 서버 실행 후)
npm run generate:api

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 📁 프로젝트 구조

```
src/
├── api/                  # OpenAPI로 자동 생성된 API 코드
│   ├── core/            # API 요청 핵심 로직
│   ├── models/          # TypeScript 타입 정의
│   ├── services/        # API 서비스 클래스
│   │   ├── Service.ts   # Auth API
│   │   └── TodoService.ts # Todo API
│   └── index.ts         # 통합 export
│
├── config/              # 설정 파일
│   └── openapi.ts       # OpenAPI 설정 (Base URL, Token)
│
├── assets/              # CSS, 이미지 등
│   └── main.css         # Tailwind CSS + 커스텀 스타일
│
├── components/          # 재사용 가능한 컴포넌트 (Phase 1)
│
├── router/              # Vue Router 설정
│   └── index.ts         # 라우트 정의 + 네비게이션 가드
│
├── stores/              # Pinia 상태 관리
│   ├── auth.ts          # 인증 상태
│   └── todo.ts          # TODO 상태
│
├── types/               # 추가 타입 정의 및 재export
│   └── index.ts         # 타입 별칭 및 재export
│
├── views/               # 페이지 컴포넌트
│   ├── LoginView.vue
│   ├── SignupView.vue
│   ├── TodoListView.vue
│   ├── TodoDetailView.vue
│   └── NotFoundView.vue
│
├── App.vue              # 루트 컴포넌트
└── main.ts              # 앱 엔트리 포인트
```

## 🎨 스타일 가이드

### Tailwind CSS 유틸리티 클래스

프로젝트에서 정의한 커스텀 클래스:

```css
/* 버튼 */
.btn-primary     /* 주요 버튼 (Primary 색상) */
.btn-secondary   /* 보조 버튼 (Gray 색상) */

/* 입력 필드 */
.input-field     /* 텍스트 입력 필드 */

/* 카드 */
.card            /* 카드 컨테이너 */
```

## 🔑 인증 처리

### 토큰 저장
JWT 토큰은 `localStorage`에 저장됩니다:
- Key: `token`
- OpenAPI 설정을 통해 자동으로 요청 헤더에 포함

### 인증 가드
Vue Router에서 자동으로 인증 체크:
- 인증 필요 페이지: `/todos`, `/todos/:id`
- 비인증 페이지: `/login`, `/signup`

## 📡 API 연동 (OpenAPI 자동 생성)

### OpenAPI 설정
`src/config/openapi.ts`에서 설정:
- Base URL: 환경 변수 또는 기본값 `http://localhost:8080`
- 자동 JWT 토큰 주입
- TypeScript 완벽 지원

### API 코드 자동 생성
```bash
# Backend 서버를 먼저 실행한 후
npm run generate:api
```

이 명령어는:
1. `http://localhost:8080/api-docs`에서 OpenAPI 스펙 다운로드
2. `src/api/` 디렉토리에 TypeScript 코드 자동 생성
3. 모든 타입과 서비스 클래스 생성

### API 사용 예시

```typescript
import { TodoService } from '@/api'
import type { TodoRequest } from '@/api'

// TODO 목록 조회
const response = await TodoService.getTodos({ 
  status: 'TODO', 
  page: 0, 
  size: 50 
})
const todos = response.data?.content

// TODO 생성
const newTodo: TodoRequest = {
  title: '새 할 일',
  description: '설명',
  priority: TodoRequest.priority.HIGH
}
const result = await TodoService.createTodo(newTodo)
```

## 🏪 상태 관리 (Pinia)

### Auth Store
```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 로그인
await authStore.login({ username, password })

// 로그아웃
authStore.logout()

// 인증 상태 확인
if (authStore.isAuthenticated) {
  // ...
}
```

### Todo Store
```typescript
import { useTodoStore } from '@/stores/todo'

const todoStore = useTodoStore()

// TODO 목록 조회
await todoStore.fetchTodos({ status: 'TODO' })

// TODO 생성
await todoStore.createTodo(todoData)

// 상태 변경
await todoStore.updateTodoStatus(todoId, 'DONE')
```

## 🎯 다음 구현 사항 (Phase 1)

- [ ] TODO 카드 컴포넌트
- [ ] TODO 생성 모달
- [ ] TODO 수정 모달
- [ ] 필터/정렬 UI
- [ ] 검색 기능
- [ ] 페이지네이션 UI
- [ ] 로딩 스피너
- [ ] 에러 토스트 알림

## 🔧 환경 변수

`env.development.example` 파일을 복사하여 `.env.development` 파일을 생성하세요:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 📦 주요 패키지

- `vue`: ^3.4.0
- `vue-router`: ^4.2.5
- `pinia`: ^2.1.7
- `axios`: ^1.6.2
- `tailwindcss`: ^3.3.6
- `typescript`: ^5.3.0
- `vite`: ^5.0.0
- `openapi-typescript-codegen`: ^0.29.0 (devDependency)

## ✨ OpenAPI 코드 생성의 장점

1. **타입 안정성**: Backend API 스펙과 100% 일치하는 TypeScript 타입
2. **자동 동기화**: API 변경 시 `npm run generate:api`만 실행하면 자동 업데이트
3. **개발 생산성**: IDE 자동완성으로 빠른 개발
4. **에러 감소**: 컴파일 타임에 API 오류 발견
5. **문서화 불필요**: 코드 자체가 문서 역할

## 🐛 문제 해결

### 빌드 오류
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
```

### 타입 에러
```bash
# TypeScript 타입 체크
npm run vue-tsc --noEmit
```

### Lint 오류
```bash
# ESLint 자동 수정
npm run lint
```


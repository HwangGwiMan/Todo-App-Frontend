# TodoApp Frontend

Vue 3 + TypeScript + Tailwind CSS로 구축된 TodoApp 프론트엔드입니다.

## 📋 프로젝트 정보

이 프로젝트는 독립적인 Git 레포지토리로 관리됩니다. 백엔드와 별도로 버전 관리됩니다.

## 🚀 시작하기

### 사전 요구사항

- Node.js 20+ 
- npm 또는 yarn
- 백엔드 서버 실행 (http://localhost:8080)

### 설치 및 실행

```bash
# 패키지 설치
npm install

# API 클라이언트 코드 생성 (백엔드 서버 실행 후)
npx @hey-api/openapi-ts

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
├── client/                 # @hey-api/openapi-ts로 자동 생성된 API 클라이언트
│   ├── client/            # 클라이언트 구현
│   ├── core/              # 핵심 유틸리티
│   ├── sdk.gen.ts         # SDK 함수들 (login, signup, getTodos 등)
│   ├── types.gen.ts       # TypeScript 타입 정의
│   └── index.ts           # 통합 export
│
├── components/            # 재사용 가능한 컴포넌트
│   ├── TodoCard.vue       # TODO 카드 컴포넌트
│   ├── TodoCreateModal.vue # TODO 생성 모달
│   ├── TodoEditModal.vue  # TODO 수정 모달
│   ├── FilterSortBar.vue  # 필터/정렬 바
│   ├── Pagination.vue      # 페이지네이션
│   ├── LoadingSpinner.vue # 로딩 스피너
│   └── ToastNotification.vue # 토스트 알림
│
├── config/                # 설정 파일
│   └── client.ts          # API 클라이언트 설정 (인증 토큰 자동 주입)
│
├── assets/                # CSS, 이미지 등
│   └── main.css           # Tailwind CSS + 커스텀 스타일
│
├── composables/           # Vue 컴포저블
│   ├── useErrorHandler.ts # 에러 처리 컴포저블
│   └── useToast.ts        # 토스트 알림 컴포저블
│
├── router/                # Vue Router 설정
│   └── index.ts           # 라우트 정의 + 네비게이션 가드
│
├── stores/                # Pinia 상태 관리
│   ├── auth.ts            # 인증 상태
│   └── todo.ts            # TODO 상태
│
├── types/                 # 추가 타입 정의 및 재export
│   └── index.ts           # 타입 별칭 및 재export
│
├── utils/                 # 유틸리티 함수
│   └── errorHandler.ts    # 에러 처리 유틸리티
│
├── views/                 # 페이지 컴포넌트
│   ├── LoginView.vue      # 로그인 페이지
│   ├── SignupView.vue     # 회원가입 페이지
│   ├── TodoListView.vue   # TODO 목록 페이지
│   ├── TodoDetailView.vue # TODO 상세 페이지 (Phase 2 예정)
│   └── NotFoundView.vue  # 404 페이지
│
├── App.vue                # 루트 컴포넌트
└── main.ts                # 앱 엔트리 포인트
```

## 🎨 스타일 가이드

### Tailwind CSS 유틸리티 클래스

프로젝트에서 정의한 커스텀 클래스:

```css
/* 버튼 */
.btn-primary     /* 주요 버튼 (Blue 색상) */
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
- `src/config/client.ts`에서 자동으로 요청 헤더에 포함

### 인증 가드
Vue Router에서 자동으로 인증 체크:
- 인증 필요 페이지: `/todos`, `/todos/:id`
- 비인증 페이지: `/login`, `/signup`

## 📡 API 연동 (@hey-api/openapi-ts)

### OpenAPI 코드 생성

이 프로젝트는 [`@hey-api/openapi-ts`](https://github.com/hey-api/openapi-ts)를 사용하여 백엔드의 OpenAPI 스펙으로부터 TypeScript 클라이언트 코드를 자동 생성합니다.

#### 설정 파일
`openapi-ts.config.ts`에서 설정:
```typescript
export default defineConfig({
  input: 'http://localhost:8080/api-docs',
  output: 'src/client',
  plugins: ['@hey-api/client-axios']
})
```

#### API 코드 생성
```bash
# 백엔드 서버를 먼저 실행한 후
npx @hey-api/openapi-ts
```

이 명령어는:
1. `http://localhost:8080/api-docs`에서 OpenAPI 스펙 다운로드
2. `src/client/` 디렉토리에 TypeScript 코드 자동 생성
3. 모든 타입과 SDK 함수 생성

### 클라이언트 설정

`src/config/client.ts`에서 클라이언트를 초기화하고 인증 토큰을 자동으로 주입합니다:

```typescript
import { client } from '../client/client.gen';

const getAuthToken = async (): Promise<string | undefined> => {
  const token = localStorage.getItem('token');
  return token || undefined;
};

client.setConfig({
  auth: getAuthToken,
});
```

### API 사용 예시

```typescript
import { login, signup, getTodos, createTodo } from '@/client'
import type { LoginRequest, TodoRequest } from '@/client'

// 로그인
const response = await login({
  body: { username: 'user', password: 'pass123' },
  throwOnError: true
})
const token = response.data?.data?.token

// TODO 목록 조회
const todosResponse = await getTodos({
  query: {
    searchRequest: { status: 'TODO', page: 0, size: 50 }
  },
  throwOnError: true
})
const todos = todosResponse.data?.data?.content

// TODO 생성
const newTodo: TodoRequest = {
  title: '새 할 일',
  description: '설명',
  status: 'TODO',
  priority: 'HIGH'
}
const created = await createTodo({
  body: newTodo,
  throwOnError: true
})
```

### 쿼리 파라미터 평면화

Spring의 `@ModelAttribute`는 중첩 객체가 아닌 평면 쿼리 파라미터를 기대하므로, `todo.ts` store에서 `paramsSerializer`를 사용하여 쿼리 파라미터를 평면화합니다.

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

// TODO 수정
await todoStore.updateTodo(todoId, todoData)

// 상태 변경
await todoStore.updateTodoStatus(todoId, 'DONE')

// TODO 삭제
await todoStore.deleteTodo(todoId)

// 통계 조회
await todoStore.fetchStats()
```

## 🎯 개발 진행 상황

### ✅ Phase 1 완료 (2024)

**구현 완료된 기능:**
- [x] TODO 카드 컴포넌트 (`TodoCard.vue`)
  - 상태 배지, 우선순위 배지
  - 마감일 및 완료일 표시
  - 상태 변경 버튼
  - 수정/삭제 버튼
- [x] TODO 생성 모달 (`TodoCreateModal.vue`)
  - 제목, 설명, 상태, 우선순위, 마감일 입력
  - 유효성 검사 및 에러 처리
- [x] TODO 수정 모달 (`TodoEditModal.vue`)
  - 기존 데이터 로드 및 수정
  - 유효성 검사 및 에러 처리
- [x] 필터/정렬 UI (`FilterSortBar.vue`)
  - 검색 (제목, 설명)
  - 상태 필터 (TODO, IN_PROGRESS, DONE)
  - 우선순위 필터 (HIGH, MEDIUM, LOW)
  - 정렬 (생성일, 마감일, 우선순위, 제목)
  - 정렬 방향 (오름차순, 내림차순)
- [x] 검색 기능
  - 실시간 검색
  - 필터와 연동
- [x] 페이지네이션 UI (`Pagination.vue`)
  - 페이지 번호 표시
  - 이전/다음 버튼
  - 전체 개수 표시
- [x] 로딩 스피너 (`LoadingSpinner.vue`)
  - 비동기 작업 중 로딩 표시
- [x] 에러 토스트 알림 (`ToastNotification.vue`, `useToast.ts`)
  - 성공/에러/정보 알림
  - 자동 사라짐
  - 여러 알림 동시 표시

**추가 구현 사항:**
- [x] 인증 시스템 (로그인, 회원가입, 로그아웃)
- [x] API 클라이언트 자동 생성 및 연동
- [x] 에러 처리 시스템
- [x] 통계 대시보드 (전체, 할 일, 진행중, 완료 개수)
- [x] 반응형 디자인 (모바일, 태블릿, 데스크톱)

### 🚧 Phase 2 예정

**다음 단계 구현 예정:**
- [ ] TODO 상세 페이지 (`TodoDetailView.vue`)
  - 상세 정보 표시
  - 댓글 기능 (선택사항)
  - 히스토리 표시 (선택사항)
- [ ] 프로젝트 기능
  - 프로젝트 생성/수정/삭제
  - 프로젝트별 TODO 그룹화
  - 프로젝트 필터링
- [ ] 고급 기능
  - TODO 드래그 앤 드롭 (순서 변경)
  - TODO 복제
  - TODO 템플릿
  - 일괄 작업 (다중 선택, 일괄 삭제/상태 변경)
- [ ] 사용자 경험 개선
  - 키보드 단축키
  - 다크 모드
  - 애니메이션 효과
  - 접근성 개선

## 🔧 환경 변수

`env.development.example` 파일을 복사하여 `.env.development` 파일을 생성하세요:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 📦 주요 패키지

### 런타임 의존성
- `vue`: ^3.4.0
- `vue-router`: ^4.2.5
- `pinia`: ^2.1.7
- `axios`: ^1.6.2
- `date-fns`: ^3.0.0

### 개발 의존성
- `@hey-api/openapi-ts`: 0.87.4 - OpenAPI 클라이언트 코드 생성
- `typescript`: ^5.3.0
- `vite`: ^5.0.0
- `tailwindcss`: ^3.3.6
- `vue-tsc`: ^1.8.0
- `eslint`: ^8.55.0

## ✨ OpenAPI 코드 생성의 장점

1. **타입 안정성**: 백엔드 API 스펙과 100% 일치하는 TypeScript 타입
2. **자동 동기화**: API 변경 시 `npx @hey-api/openapi-ts`만 실행하면 자동 업데이트
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

### API 코드 생성 실패
```bash
# 백엔드 서버가 실행 중인지 확인
# http://localhost:8080/api-docs 접속 가능한지 확인
npx @hey-api/openapi-ts
```

### 쿼리 파라미터 에러
Spring의 `@ModelAttribute`는 평면 쿼리 파라미터를 기대합니다. `todo.ts` store의 `fetchTodos` 함수에서 `paramsSerializer`를 사용하여 쿼리 파라미터를 평면화합니다.

## 📚 참고 문서

- [@hey-api/openapi-ts 공식 문서](https://heyapi.dev/)
- [Vue 3 공식 문서](https://vuejs.org/)
- [Pinia 공식 문서](https://pinia.vuejs.org/)
- [Vite 공식 문서](https://vitejs.dev/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/)

## 🔄 Git 워크플로우

이 프로젝트는 독립적인 Git 레포지토리입니다.

```bash
# 초기 커밋 (이미 완료된 경우 생략)
git add .
git commit -m "Initial commit: Frontend setup"

# 원격 저장소 연결 (선택사항)
git remote add origin <프론트엔드-저장소-URL>
git branch -M main
git push -u origin main
```

## 📝 라이선스

이 프로젝트는 독립적으로 관리되며, 백엔드와 별도의 라이선스를 가질 수 있습니다.

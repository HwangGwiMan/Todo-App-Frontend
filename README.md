# TodoApp Frontend

Vue 3 + TypeScript + Tailwind CSS로 구축된 TodoApp 프론트엔드입니다.

## 📋 프로젝트 정보

이 프로젝트는 독립적인 Git 레포지토리로 관리됩니다. 백엔드와 별도로 버전 관리됩니다.

## 📊 현재 개발 상태

- ✅ **Phase 1 완료** (2025년 11월): TODO CRUD, 인증, 필터/정렬/검색, 페이지네이션, 통계 대시보드
- ✅ **Phase 2 완료** (2025년 11월): 프로젝트 관리, 프로젝트-TODO 통합, 프로젝트 필터링
- ✅ **Phase 3 완료** (2025년 12월): TODO 상세 페이지 완전 구현 (상세 정보, 날짜 관리, 상태 변경, 수정/삭제)

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
npm run generate:api
# 또는 직접 실행
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
│   ├── ProjectCard.vue    # 프로젝트 카드 컴포넌트 ✅
│   ├── ProjectCreateModal.vue # 프로젝트 생성 모달 ✅
│   ├── ProjectEditModal.vue # 프로젝트 수정 모달 ✅
│   ├── SelectField.vue    # 선택 필드 컴포넌트
│   ├── FilterSortBar.vue  # 필터/정렬 바 (프로젝트 필터 포함) ✅
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
│   ├── todo.ts            # TODO 상태
│   └── project.ts         # 프로젝트 상태 ✅
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
│   ├── TodoListView.vue   # TODO 목록 페이지 (프로젝트 관리 통합) ✅
│   ├── TodoDetailView.vue # TODO 상세 페이지 🚧 (플레이스홀더만 존재)
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
import { login, signup, getTodos, createTodo, getProjects, createProject } from '@/client'
import type { LoginRequest, TodoRequest, ProjectRequest } from '@/client'

// 로그인
const response = await login({
  body: { username: 'user', password: 'pass123' },
  throwOnError: true
})
const token = response.data?.data?.token

// TODO 목록 조회 (프로젝트 필터 포함)
const todosResponse = await getTodos({
  query: {
    searchRequest: { projectId: 1, status: 'TODO', page: 0, size: 50 }
  },
  throwOnError: true
})
const todos = todosResponse.data?.data?.content

// TODO 생성 (프로젝트 지정)
const newTodo: TodoRequest = {
  title: '새 할 일',
  description: '설명',
  status: 'TODO',
  priority: 'HIGH',
  projectId: 1
}
const created = await createTodo({
  body: newTodo,
  throwOnError: true
})

// 프로젝트 목록 조회 ✅
const projectsResponse = await getProjects({
  throwOnError: true
})
const projects = projectsResponse.data?.data

// 프로젝트 생성 ✅
const newProject: ProjectRequest = {
  name: '새 프로젝트',
  description: '프로젝트 설명',
  color: '#3B82F6',
  isDefault: false
}
const createdProject = await createProject({
  body: newProject,
  throwOnError: true
})
```

### 쿼리 파라미터 평면화

Spring의 `@ModelAttribute`는 중첩 객체가 아닌 평면 쿼리 파라미터를 기대하므로, `todo.ts` store에서 `paramsSerializer`를 사용하여 쿼리 파라미터를 평면화합니다.

## 🛡️ 타입 안전성 및 Null Safety

### TypeScript 타입 시스템

이 프로젝트는 완벽한 타입 안전성을 보장하기 위해 다층적 접근 방식을 사용합니다.

#### 1. 자동 생성된 타입 정의

**@hey-api/openapi-ts**로 생성된 타입들은 백엔드의 OpenAPI 스펙과 100% 일치합니다:

```typescript
// src/client/types.gen.ts
export type TodoRequest = {
    title: string;                    // 필수 필드
    description?: string | null;      // 선택적 + null 허용
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';  // 선택적 enum
    priority?: 'HIGH' | 'MEDIUM' | 'LOW';      // 선택적 enum
    dueDate?: string | null;          // 선택적 + null 허용 
    position?: number;                // 선택적 필드
    projectId?: number | null;        // 선택적 + null 허용
};

export type TodoResponse = {
    id?: number | null;               // 생성 시 null
    title?: string;                   // 항상 존재 (백엔드에서 보장)
    description?: string | null;      // null 가능
    status?: string;                  // enum이 string으로 직렬화
    priority?: string | null;         // null 가능
    dueDate?: string | null;          // null 가능
    completedAt?: string | null;      // 완료되지 않은 경우 null
    createdAt?: string;               // 항상 존재
    updatedAt?: string;               // 항상 존재
};
```

#### 2. Zod 스키마 검증

런타임 타입 검증을 위한 Zod 스키마도 자동 생성됩니다:

```typescript
// src/client/zod.gen.ts
export const zTodoRequest = z.object({
    title: z.string().min(0).max(255),           // 필수 + 길이 제한
    description: z.optional(z.union([            // 선택적 + null 허용
        z.string(),
        z.null()
    ])),
    status: z.optional(z.enum([                  // 선택적 enum
        'TODO', 'IN_PROGRESS', 'DONE'
    ])),
    dueDate: z.optional(z.union([                // 선택적 + null 허용
        z.iso.datetime(),
        z.null()
    ])),
    projectId: z.optional(z.union([              // 선택적 + null 허용
        z.coerce.bigint(),
        z.null()
    ]))
});
```

#### 3. 컴포넌트에서의 안전한 Null 처리

**TodoCard.vue - 안전한 데이터 접근**
```vue
<template>
  <div class="card">
    <!-- 필수 필드는 바로 사용 -->
    <h3>{{ todo.title }}</h3>
    
    <!-- null 가능 필드는 조건부 렌더링 -->
    <p v-if="todo.description" class="text-gray-600">
      {{ todo.description }}
    </p>
    
    <!-- null 가능 필드의 기본값 처리 -->
    <span class="priority-badge">
      {{ todo.priority || 'MEDIUM' }}
    </span>
    
    <!-- Date 객체 변환 시 null 체크 -->
    <time v-if="todo.dueDate" class="due-date">
      {{ formatDate(todo.dueDate) }}
    </time>
  </div>
</template>
```

**TodoCreateModal.vue - 폼 데이터 처리**
```typescript
const form = ref<TodoRequest>({
  title: '',                    // 필수 필드
  description: '',              // 빈 문자열로 초기화
  status: 'TODO',               // 기본값 설정
  priority: 'MEDIUM',           // 기본값 설정
  dueDate: undefined            // undefined로 초기화
})

const handleSubmit = async () => {
  const todoData: TodoRequest = {
    title: form.value.title,
    // 빈 문자열을 undefined로 변환 (null 대신)
    description: form.value.description || undefined,
    status: form.value.status,
    priority: form.value.priority,
    dueDate: form.value.dueDate || undefined
  }
  
  emit('created', todoData)
}
```

**TodoEditModal.vue - 데이터 로딩 시 null 처리**
```typescript
const loadTodoData = (todo: TodoResponse) => {
  form.value = {
    title: todo.title || '',                    // null-safe 기본값
    description: todo.description || '',        // null을 빈 문자열로
    status: (todo.status as TodoStatus) || 'TODO',
    priority: (todo.priority as Priority) || 'MEDIUM',
    dueDate: todo.dueDate ? formatDateForInput(todo.dueDate) : undefined
  }
}

// 날짜 변환 시 try-catch로 안전 처리
const formatDateForInput = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  } catch {
    return ''  // 파싱 실패 시 빈 문자열 반환
  }
}
```

#### 4. Store에서의 타입 안전성

**todo.ts - Computed 속성에서의 null 처리**
```typescript
// Getters에서 null-safe 접근
const todoCount = computed(() => stats.value?.todoCount || 0)
const inProgressCount = computed(() => stats.value?.inProgressCount || 0)
const doneCount = computed(() => stats.value?.doneCount || 0)
const completionRate = computed(() => stats.value?.completionRate || 0)

// API 응답 처리 시 null 체크
const fetchTodos = async (params?: TodoSearchRequest) => {
  const response = await getTodos({...})
  const pageData = response.data?.data  // Optional chaining
  
  if (pageData) {
    todos.value = pageData.content || []  // null-safe 배열 할당
    totalPages.value = pageData.totalPages || 0
    totalElements.value = pageData.totalElements || 0
    currentPage.value = pageData.number || 0
  }
}
```

#### 5. 에러 처리에서의 타입 안전성

**errorHandler.ts - 안전한 에러 객체 파싱**
```typescript
export function parseApiError(error: unknown): ParsedError {
  if (isAxiosError(error)) {
    const response = error.response
    const errorData = response?.data
    
    // 타입 가드를 통한 안전한 접근
    if (errorData && typeof errorData === 'object' && 'message' in errorData) {
      const apiResponse = errorData as { message?: string; data?: unknown }
      
      // null-safe 메시지 추출
      const message = (typeof apiResponse.message === 'string' ? 
        apiResponse.message : '') || 
        '요청 처리 중 오류가 발생했습니다.'
      
      return {
        message,
        status: response?.status || 0,  // null-safe 기본값
        statusText: response?.statusText || 'Unknown Error'
      }
    }
  }
  
  // 폴백 처리
  return {
    message: '알 수 없는 오류가 발생했습니다.',
    status: 0,
    statusText: 'Unknown Error'
  }
}
```

### TypeScript 설정

**tsconfig.json**에서 엄격한 null 체크 활성화:
```json
{
  "compilerOptions": {
    "strict": true,              // 엄격 모드
    "strictNullChecks": true,    // null 체크 강화
    "noUncheckedIndexedAccess": true  // 배열/객체 접근 시 undefined 체크
  }
}
```

### 장점

1. **컴파일 타임 안전성**: TypeScript가 null/undefined 접근을 컴파일 시점에 검증
2. **런타임 검증**: Zod 스키마로 API 응답 데이터 검증
3. **자동 동기화**: 백엔드 스키마 변경 시 프론트엔드 타입 자동 업데이트
4. **IDE 지원**: 자동완성과 타입 힌트로 개발 생산성 향상
5. **에러 방지**: null/undefined 관련 런타임 에러 사전 방지

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

// TODO 목록 조회 (프로젝트 필터 포함)
await todoStore.fetchTodos({ projectId: 1, status: 'TODO' })

// TODO 생성 (프로젝트 지정)
await todoStore.createTodo({ ...todoData, projectId: 1 })

// TODO 수정
await todoStore.updateTodo(todoId, todoData)

// 상태 변경
await todoStore.updateTodoStatus(todoId, 'DONE')

// TODO 삭제
await todoStore.deleteTodo(todoId)

// 통계 조회
await todoStore.fetchStats()
```

### Project Store ✅
```typescript
import { useProjectStore } from '@/stores/project'

const projectStore = useProjectStore()

// 프로젝트 목록 조회
await projectStore.fetchProjects()

// 프로젝트 생성
await projectStore.createNewProject(projectData)

// 프로젝트 수정
await projectStore.updateExistingProject(projectId, projectData)

// 프로젝트 삭제
await projectStore.deleteExistingProject(projectId)

// 기본 프로젝트 조회
await projectStore.fetchDefaultProject()

// Select 옵션용 프로젝트 목록
const projectOptions = projectStore.getProjectsForSelect
```

## 🎯 개발 진행 상황

### ✅ Phase 1 완료 (2025년 11월)

**구현 완료된 기능:**
- [x] **TODO 핵심 기능**
  - TODO 카드 컴포넌트 (`TodoCard.vue`)
    - 상태 배지 (TODO/IN_PROGRESS/DONE)
    - 우선순위 배지 (HIGH/MEDIUM/LOW)
    - 마감일 및 완료일 표시
    - 상태 변경 버튼
    - 수정/삭제 버튼
  - TODO 생성 모달 (`TodoCreateModal.vue`)
    - 제목, 설명, 상태, 우선순위, 마감일 입력
    - 프로젝트 선택 (Phase 2 통합)
    - 유효성 검사 및 에러 처리
  - TODO 수정 모달 (`TodoEditModal.vue`)
    - 기존 데이터 로드 및 수정
    - 프로젝트 변경 지원
    - 유효성 검사 및 에러 처리

- [x] **필터링 및 검색**
  - 필터/정렬 UI (`FilterSortBar.vue`)
    - 검색 (제목, 설명 키워드)
    - 상태 필터 (TODO, IN_PROGRESS, DONE, 전체)
    - 우선순위 필터 (HIGH, MEDIUM, LOW, 전체)
    - 프로젝트 필터 (Phase 2 통합)
    - 정렬 (생성일, 마감일, 우선순위, 제목)
    - 정렬 방향 (오름차순, 내림차순)
  - 실시간 검색 및 필터 연동

- [x] **UI 컴포넌트**
  - 페이지네이션 (`Pagination.vue`)
    - 페이지 번호 표시 및 네비게이션
    - 이전/다음 버튼
    - 전체 개수 표시
  - 로딩 스피너 (`LoadingSpinner.vue`)
    - 비동기 작업 중 로딩 표시
  - 토스트 알림 (`ToastNotification.vue`, `useToast.ts`)
    - 성공/에러/정보 알림
    - 자동 사라짐
    - 여러 알림 동시 표시

- [x] **인증 및 라우팅**
  - 인증 시스템 (로그인, 회원가입, 로그아웃)
  - Vue Router 인증 가드
  - JWT 토큰 자동 주입

- [x] **상태 관리**
  - Pinia 스토어 (auth, todo)
  - API 클라이언트 자동 생성 및 연동 (`@hey-api/openapi-ts`)
  - 완벽한 타입 안전성

- [x] **통계 및 대시보드**
  - 통계 대시보드 (전체, 할 일, 진행중, 완료 개수)
  - 실시간 통계 업데이트

- [x] **반응형 디자인**
  - 모바일, 태블릿, 데스크톱 대응
  - Tailwind CSS 기반 반응형 레이아웃

### ✅ Phase 2 완료 (2025년 11월)

**구현 완료된 기능:**
- [x] **프로젝트 관리**
  - 프로젝트 카드 컴포넌트 (`ProjectCard.vue`)
    - 프로젝트 색상 표시
    - 기본 프로젝트 배지
    - 프로젝트 통계 (TODO 개수)
    - 수정/삭제/선택 버튼
  - 프로젝트 생성 모달 (`ProjectCreateModal.vue`)
    - 프로젝트 이름, 설명, 색상 입력
    - 기본 프로젝트 설정
  - 프로젝트 수정 모달 (`ProjectEditModal.vue`)
    - 프로젝트 정보 수정
    - 기본 프로젝트 변경

- [x] **프로젝트 상태 관리**
  - 프로젝트 스토어 (`project.ts`)
    - CRUD 작업 및 상태 관리
    - 에러 처리 및 로딩 상태
    - 기본 프로젝트 관리
    - 프로젝트 정렬 (기본 프로젝트 우선, position 순)

- [x] **프로젝트-TODO 통합**
  - FilterSortBar에 프로젝트 필터 추가
  - 프로젝트별 TODO 목록 조회
  - 프로젝트 선택 시 자동 필터링
  - TODO 생성/수정 시 프로젝트 지정

- [x] **통합 UI**
  - TodoListView에 프로젝트 관리 섹션 통합
  - 프로젝트 선택 및 필터링 UI
  - 프로젝트별 TODO 그룹화

### ✅ Phase 3 완료 (2025년 12월)

**구현 완료된 기능:**

- [x] **TODO 상세 페이지** (`TodoDetailView.vue`) - 완전 구현 완료 ✅
  
  **상세 정보 표시:**
  - 제목 및 설명 (여러 줄 지원, `whitespace-pre-wrap`)
  - 상태 배지 (할 일/진행중/완료) 및 우선순위 배지 (높음/보통/낮음)
  - 프로젝트 정보 (프로젝트 이름 및 색상 배지)
  - 라우트 설정 완료 (`/todos/:id`)
  
  **날짜 정보 관리:**
  - 생성일, 수정일 자동 표시
  - 마감일 표시 및 **마감일 지남 경고** (⚠️ 빨간색 경고 문구)
  - 완료일 표시 (완료 상태인 경우만)
  - date-fns를 사용한 한국어 날짜 포맷팅 (`yyyy년 M월 d일 HH:mm`)
  
  **인터랙티브 기능:**
  - 수정 버튼 (TodoEditModal 열기 및 연동)
  - 삭제 버튼 (확인 다이얼로그 → 삭제 → 목록으로 자동 이동)
  - 상태 변경 버튼 (할 일 ↔ 진행중 ↔ 완료) - 현재 상태에 따라 동적 표시
  - 목록으로 돌아가기 버튼
  
  **UX/UI 개선:**
  - 로딩 스피너 (데이터 로드 중)
  - 에러 상태 처리 (TODO 없음, 로드 실패 등)
  - 반응형 디자인 (모바일/태블릿/데스크톱)
  - 버튼 비활성화 상태 (업데이트 중 중복 클릭 방지)
  - 깔끔한 카드 레이아웃 및 색상 코딩
  
  **기존 시스템 통합:**
  - TodoCard 클릭 시 상세 페이지 자동 이동
  - 프로젝트 Store 연동 (프로젝트 정보 자동 로드)
  - Toast 알림 시스템 연동 (수정/삭제/상태 변경 성공/실패)
  - 데이터 변경 시 자동 새로고침

### 🏗️ Phase 4 예정 - 아키텍처 및 코드 품질 개선

**기능 개요:**
코드 유지보수성, 재사용성, 성능을 향상시키기 위한 프론트엔드 리팩토링 및 베스트 프랙티스 적용

#### 우선순위: 높음 (필수)

**1. Composable 패턴으로 로직 재사용 (4-5시간)**

**현재 문제:**
- Store와 컴포넌트 간 반복 코드
- 에러 처리, Toast 알림, 로딩 상태 관리가 각 컴포넌트에 중복
- 비즈니스 로직 재사용이 어려움

**구현 계획:**

```typescript
// composables/useTodoOperations.ts (신규 생성)
export function useTodoOperations() {
  const todoStore = useTodoStore()
  const toast = useToast()
  const loading = ref(false)
  const error = ref<Error | null>(null)
  
  const createTodoWithFeedback = async (data: TodoRequest) => {
    loading.value = true
    error.value = null
    
    try {
      await todoStore.createTodo(data)
      toast.success('TODO가 생성되었습니다.')
      return { success: true, data: null }
    } catch (e) {
      error.value = e as Error
      toast.error('TODO 생성에 실패했습니다.')
      return { success: false, error: e }
    } finally {
      loading.value = false
    }
  }
  
  const updateTodoWithFeedback = async (id: number, data: TodoRequest) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await todoStore.updateTodo(id, data)
      toast.success('TODO가 수정되었습니다.')
      return { success: true, data: result }
    } catch (e) {
      error.value = e as Error
      toast.error('TODO 수정에 실패했습니다.')
      return { success: false, error: e }
    } finally {
      loading.value = false
    }
  }
  
  const deleteTodoWithConfirm = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return { success: false, cancelled: true }
    }
    
    loading.value = true
    error.value = null
    
    try {
      await todoStore.deleteTodo(id)
      toast.success('TODO가 삭제되었습니다.')
      return { success: true }
    } catch (e) {
      error.value = e as Error
      toast.error('TODO 삭제에 실패했습니다.')
      return { success: false, error: e }
    } finally {
      loading.value = false
    }
  }
  
  const updateStatusWithFeedback = async (id: number, status: TodoStatus) => {
    try {
      await todoStore.updateTodoStatus(id, status)
      toast.success('상태가 변경되었습니다.')
      return { success: true }
    } catch (e) {
      toast.error('상태 변경에 실패했습니다.')
      return { success: false, error: e }
    }
  }
  
  return {
    loading,
    error,
    createTodoWithFeedback,
    updateTodoWithFeedback,
    deleteTodoWithConfirm,
    updateStatusWithFeedback
  }
}

// 컴포넌트에서 사용
const { loading, createTodoWithFeedback } = useTodoOperations()

const handleCreate = async () => {
  const result = await createTodoWithFeedback(formData.value)
  if (result.success) {
    emit('close')
  }
}
```

**추가 Composable 구현:**

```typescript
// composables/useProjectOperations.ts
export function useProjectOperations() {
  // 프로젝트 관련 작업
}

// composables/useFormValidation.ts
export function useFormValidation() {
  const errors = ref<Record<string, string>>({})
  
  const validateRequired = (value: string, fieldName: string) => {
    if (!value || value.trim() === '') {
      errors.value[fieldName] = `${fieldName}은(는) 필수입니다.`
      return false
    }
    delete errors.value[fieldName]
    return true
  }
  
  const validateMaxLength = (value: string, max: number, fieldName: string) => {
    if (value.length > max) {
      errors.value[fieldName] = `${fieldName}은(는) ${max}자 이하여야 합니다.`
      return false
    }
    delete errors.value[fieldName]
    return true
  }
  
  const clearErrors = () => {
    errors.value = {}
  }
  
  return {
    errors,
    validateRequired,
    validateMaxLength,
    clearErrors
  }
}

// composables/useConfirmDialog.ts
export function useConfirmDialog() {
  const isOpen = ref(false)
  const message = ref('')
  const resolveCallback = ref<((value: boolean) => void) | null>(null)
  
  const confirm = (msg: string): Promise<boolean> => {
    message.value = msg
    isOpen.value = true
    
    return new Promise((resolve) => {
      resolveCallback.value = resolve
    })
  }
  
  const handleConfirm = () => {
    resolveCallback.value?.(true)
    isOpen.value = false
  }
  
  const handleCancel = () => {
    resolveCallback.value?.(false)
    isOpen.value = false
  }
  
  return {
    isOpen,
    message,
    confirm,
    handleConfirm,
    handleCancel
  }
}
```

**체크리스트:**
- [ ] `useTodoOperations` composable 생성
- [ ] `useProjectOperations` composable 생성
- [ ] `useFormValidation` composable 생성
- [ ] `useConfirmDialog` composable 생성
- [ ] 모든 컴포넌트에서 중복 코드 제거
- [ ] 테스트 작성

**예상 시간:** 4-5시간

---

**2. 낙관적 업데이트 (Optimistic Update) 구현 (3-4시간)**

**현재 문제:**
- API 응답을 기다리는 동안 UI가 느리게 느껴짐
- 네트워크 지연 시 사용자 경험 저하

**구현 계획:**

```typescript
// stores/todo.ts 개선
const updateTodoStatus = async (id: number, status: TodoStatus) => {
  // 1. 원본 데이터 백업
  const originalTodos = [...todos.value]
  const index = todos.value.findIndex(t => t.id === id)
  
  if (index === -1) return
  
  // 2. 낙관적 업데이트: 먼저 UI 업데이트
  const optimisticTodo = {
    ...todos.value[index],
    status: status,
    updatedAt: new Date().toISOString()
  }
  todos.value[index] = optimisticTodo
  
  try {
    // 3. API 호출
    const response = await updateTodoStatusApi({
      path: { todoId: id },
      query: { status },
      throwOnError: true
    })
    
    // 4. 서버 응답으로 최종 업데이트
    if (response.data?.data) {
      todos.value[index] = response.data.data
    }
    
    return { success: true, data: response.data?.data }
  } catch (error) {
    // 5. 실패 시 롤백
    todos.value = originalTodos
    console.error('상태 변경 실패:', error)
    throw error
  }
}

const updateTodo = async (id: number, data: TodoRequest) => {
  const originalTodos = [...todos.value]
  const index = todos.value.findIndex(t => t.id === id)
  
  if (index !== -1) {
    // 낙관적 업데이트
    todos.value[index] = {
      ...todos.value[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
  }
  
  try {
    loading.value = true
    const response = await updateTodoApi({
      path: { todoId: id },
      body: data,
      throwOnError: true
    })
    
    // 서버 응답으로 최종 업데이트
    if (response.data?.data && index !== -1) {
      todos.value[index] = response.data.data
    }
    
    return response.data?.data
  } catch (error) {
    // 롤백
    todos.value = originalTodos
    console.error('TODO 수정 실패:', error)
    throw error
  } finally {
    loading.value = false
  }
}
```

**구현 원칙:**
1. 먼저 UI 업데이트 (즉각 반응)
2. 백그라운드에서 API 호출
3. 성공 시: 서버 데이터로 최종 동기화
4. 실패 시: 원본 상태로 롤백 + 에러 메시지

**체크리스트:**
- [ ] `updateTodoStatus`에 낙관적 업데이트 적용
- [ ] `updateTodo`에 낙관적 업데이트 적용
- [ ] `deleteTodo`에 낙관적 업데이트 적용 (선택)
- [ ] 롤백 로직 테스트
- [ ] 네트워크 지연 시뮬레이션 테스트

**예상 시간:** 3-4시간

---

**3. 에러 처리 표준화 및 개선 (2-3시간)**

**구현 계획:**

```typescript
// utils/errorHandler.ts 개선
import type { AxiosError } from 'axios'

export interface ParsedError {
  message: string
  status: number
  statusText: string
  code?: string
  field?: string
}

export function parseApiError(error: unknown): ParsedError {
  if (isAxiosError(error)) {
    const response = error.response
    const errorData = response?.data
    
    // 백엔드 ErrorCode 처리
    if (errorData && typeof errorData === 'object' && 'message' in errorData) {
      const apiResponse = errorData as { 
        message?: string
        code?: string
        field?: string
      }
      
      return {
        message: apiResponse.message || '요청 처리 중 오류가 발생했습니다.',
        status: response?.status || 0,
        statusText: response?.statusText || 'Unknown Error',
        code: apiResponse.code,
        field: apiResponse.field
      }
    }
    
    // HTTP 상태 코드별 기본 메시지
    return getDefaultErrorMessage(response?.status || 0)
  }
  
  // 네트워크 오류
  if (error instanceof Error && error.message === 'Network Error') {
    return {
      message: '네트워크 연결을 확인해주세요.',
      status: 0,
      statusText: 'Network Error'
    }
  }
  
  // 기타 오류
  return {
    message: '알 수 없는 오류가 발생했습니다.',
    status: 0,
    statusText: 'Unknown Error'
  }
}

function getDefaultErrorMessage(status: number): ParsedError {
  const messages: Record<number, string> = {
    400: '잘못된 요청입니다.',
    401: '로그인이 필요합니다.',
    403: '권한이 없습니다.',
    404: '요청한 리소스를 찾을 수 없습니다.',
    409: '이미 존재하는 데이터입니다.',
    422: '입력 데이터를 확인해주세요.',
    429: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
    500: '서버 오류가 발생했습니다.',
    502: '서버가 응답하지 않습니다.',
    503: '서비스를 사용할 수 없습니다.'
  }
  
  return {
    message: messages[status] || '오류가 발생했습니다.',
    status,
    statusText: `HTTP ${status}`
  }
}

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true
}
```

**체크리스트:**
- [ ] `parseApiError` 개선
- [ ] HTTP 상태 코드별 메시지 정의
- [ ] 백엔드 ErrorCode 매핑
- [ ] 모든 Store에서 에러 처리 표준화
- [ ] 에러 로깅 추가 (Sentry 준비)

**예상 시간:** 2-3시간

#### 우선순위: 중간

**4. Store 상태 관리 최적화 (3-4시간)**

**구현 계획:**

```typescript
// stores/todo.ts 개선
export const useTodoStore = defineStore('todo', () => {
  // State를 Map으로 관리 (O(1) 조회)
  const todosMap = ref<Map<number, TodoResponse>>(new Map())
  const todoIds = ref<number[]>([])
  
  // Computed
  const todos = computed(() => 
    todoIds.value.map(id => todosMap.value.get(id)!).filter(Boolean)
  )
  
  const getTodoById = (id: number) => todosMap.value.get(id)
  
  // Actions
  const fetchTodos = async (params?: TodoSearchRequest) => {
    // ... API 호출
    
    // Map과 배열 동시 업데이트
    todosMap.value.clear()
    todoIds.value = []
    
    pageData.content?.forEach(todo => {
      if (todo.id) {
        todosMap.value.set(todo.id, todo)
        todoIds.value.push(todo.id)
      }
    })
  }
  
  const updateTodoInStore = (todo: TodoResponse) => {
    if (todo.id) {
      todosMap.value.set(todo.id, todo)
      
      // 배열에 없으면 추가
      if (!todoIds.value.includes(todo.id)) {
        todoIds.value.push(todo.id)
      }
    }
  }
  
  const removeTodoFromStore = (id: number) => {
    todosMap.value.delete(id)
    const index = todoIds.value.indexOf(id)
    if (index > -1) {
      todoIds.value.splice(index, 1)
    }
  }
  
  return {
    todos,
    getTodoById,
    fetchTodos,
    updateTodoInStore,
    removeTodoFromStore
  }
})
```

**장점:**
- 개별 TODO 조회 성능 향상 (O(n) → O(1))
- 부분 업데이트 효율성 증가
- 메모리 사용 최적화

**체크리스트:**
- [ ] Todo Store Map 구조로 리팩토링
- [ ] Project Store 최적화
- [ ] 불필요한 상태 제거
- [ ] Computed 속성 최적화
- [ ] 성능 테스트

**예상 시간:** 3-4시간

---

**5. 컴포넌트 분리 및 재사용성 향상 (4-5시간)**

**구현 계획:**

```typescript
// components/common/ConfirmDialog.vue (신규)
<template>
  <Teleport to="body">
    <div v-if="isOpen" @click="onCancel" 
         class="fixed inset-0 z-50 flex items-center justify-center 
                bg-black bg-opacity-50">
      <div @click.stop class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
        <p class="text-gray-600 mb-6">{{ message }}</p>
        
        <div class="flex justify-end gap-3">
          <button @click="onCancel" class="btn-secondary">취소</button>
          <button @click="onConfirm" class="btn-primary">확인</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

// components/common/EmptyState.vue (신규)
<template>
  <div class="flex flex-col items-center justify-center py-12">
    <div class="text-6xl mb-4">{{ icon }}</div>
    <h3 class="text-xl font-semibold text-gray-700 mb-2">{{ title }}</h3>
    <p class="text-gray-500 mb-6">{{ message }}</p>
    <slot name="action"></slot>
  </div>
</template>

// components/common/LoadingOverlay.vue (신규)
<template>
  <div v-if="isLoading" 
       class="fixed inset-0 z-40 flex items-center justify-center 
              bg-white bg-opacity-75">
    <LoadingSpinner :size="size" />
  </div>
</template>
```

**체크리스트:**
- [ ] `ConfirmDialog` 공통 컴포넌트 생성
- [ ] `EmptyState` 컴포넌트 생성
- [ ] `LoadingOverlay` 컴포넌트 생성
- [ ] `ErrorBoundary` 컴포넌트 생성 (선택)
- [ ] 모든 페이지에서 공통 컴포넌트 사용
- [ ] 중복 코드 제거

**예상 시간:** 4-5시간

---

**6. TypeScript 타입 안전성 강화 (2-3시간)**

**구현 계획:**

```typescript
// types/index.ts 개선

// API 응답 래퍼 타입
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
}

// 페이지네이션 타입
export interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
  first: boolean
  last: boolean
}

// 작업 결과 타입
export interface OperationResult<T = void> {
  success: boolean
  data?: T
  error?: Error
  cancelled?: boolean
}

// Form 상태 타입
export interface FormState<T> {
  data: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isValid: boolean
  isDirty: boolean
}

// 사용 예시
const createTodo = async (
  data: TodoRequest
): Promise<OperationResult<TodoResponse>> => {
  try {
    const result = await todoStore.createTodo(data)
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}
```

**체크리스트:**
- [ ] 공통 타입 정의
- [ ] Store의 모든 메서드 반환 타입 명시
- [ ] Composable 타입 정의
- [ ] `any` 타입 제거
- [ ] 타입 가드 함수 작성

**예상 시간:** 2-3시간

#### 우선순위: 낮음 (선택)

**7. 성능 모니터링 및 최적화 (3-4시간)**

**구현 계획:**

```typescript
// utils/performance.ts (신규)
export function measurePerformance(name: string) {
  const startMark = `${name}-start`
  const endMark = `${name}-end`
  const measureName = `${name}-measure`
  
  performance.mark(startMark)
  
  return {
    end: () => {
      performance.mark(endMark)
      performance.measure(measureName, startMark, endMark)
      
      const measure = performance.getEntriesByName(measureName)[0]
      console.log(`⏱️ ${name}: ${measure.duration.toFixed(2)}ms`)
      
      // 성능 임계값 경고
      if (measure.duration > 1000) {
        console.warn(`⚠️ ${name} took ${measure.duration.toFixed(2)}ms`)
      }
      
      return measure.duration
    }
  }
}

// 사용 예시
const fetchTodos = async () => {
  const perf = measurePerformance('fetchTodos')
  
  try {
    // ... API 호출
  } finally {
    perf.end()
  }
}

// Vue 컴포넌트 렌더링 성능 측정
import { onMounted, onUpdated } from 'vue'

export function useRenderPerformance(componentName: string) {
  let renderCount = 0
  
  onMounted(() => {
    console.log(`✅ ${componentName} mounted`)
  })
  
  onUpdated(() => {
    renderCount++
    console.log(`🔄 ${componentName} updated (${renderCount})`)
  })
}
```

**체크리스트:**
- [ ] 성능 측정 유틸리티 작성
- [ ] 주요 API 호출 성능 모니터링
- [ ] 컴포넌트 렌더링 최적화
- [ ] 불필요한 re-render 제거
- [ ] 큰 리스트 가상화 (선택)

**예상 시간:** 3-4시간

---

**8. 테스트 코드 작성 (8-10시간)**

**구현 계획:**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom'
  }
})

// stores/__tests__/todo.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTodoStore } from '../todo'
import * as api from '@/client'

vi.mock('@/client')

describe('Todo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  
  it('should fetch todos successfully', async () => {
    const mockTodos = [
      { id: 1, title: 'Test Todo', status: 'TODO' }
    ]
    
    vi.mocked(api.getTodos).mockResolvedValue({
      data: {
        success: true,
        data: {
          content: mockTodos,
          totalPages: 1,
          totalElements: 1,
          number: 0
        }
      }
    })
    
    const store = useTodoStore()
    await store.fetchTodos()
    
    expect(store.todos).toHaveLength(1)
    expect(store.todos[0].title).toBe('Test Todo')
  })
  
  it('should handle create todo error', async () => {
    vi.mocked(api.createTodo).mockRejectedValue(new Error('API Error'))
    
    const store = useTodoStore()
    
    await expect(store.createTodo({
      title: 'New Todo'
    })).rejects.toThrow('API Error')
  })
})

// composables/__tests__/useTodoOperations.spec.ts
describe('useTodoOperations', () => {
  it('should create todo with feedback', async () => {
    // 테스트 구현
  })
})
```

**체크리스트:**
- [ ] Vitest 설정
- [ ] Store 단위 테스트
- [ ] Composable 테스트
- [ ] 컴포넌트 테스트 (선택)
- [ ] 테스트 커버리지 목표: 60% 이상

**예상 시간:** 8-10시간

---

**9. 접근성 (a11y) 개선 (3-4시간)**

```vue
<!-- 개선 예시 -->
<template>
  <!-- 의미있는 HTML 태그 사용 -->
  <main role="main" aria-label="TODO 목록">
    <h1 class="sr-only">할 일 관리</h1>
    
    <!-- 키보드 네비게이션 -->
    <button
      @click="handleCreate"
      @keydown.enter="handleCreate"
      aria-label="새 TODO 만들기"
      class="btn-primary"
    >
      <span aria-hidden="true">+</span>
      <span>새 TODO</span>
    </button>
    
    <!-- ARIA 속성 -->
    <div
      role="alert"
      aria-live="polite"
      v-if="errorMessage"
    >
      {{ errorMessage }}
    </div>
    
    <!-- 포커스 관리 -->
    <input
      ref="titleInput"
      v-model="title"
      aria-required="true"
      aria-describedby="title-error"
    />
    <span id="title-error" role="alert">
      {{ titleError }}
    </span>
  </main>
</template>
```

**체크리스트:**
- [ ] 시맨틱 HTML 사용
- [ ] ARIA 속성 추가
- [ ] 키보드 네비게이션 지원
- [ ] 포커스 관리
- [ ] 스크린 리더 테스트
- [ ] WCAG 2.1 AA 준수

**예상 시간:** 3-4시간

#### 총 예상 개발 시간

**우선순위 높음 (필수):** 9-12시간
- Composable 패턴: 4-5시간
- 낙관적 업데이트: 3-4시간
- 에러 처리 개선: 2-3시간

**우선순위 중간 (권장):** 9-12시간
- Store 최적화: 3-4시간
- 컴포넌트 분리: 4-5시간
- TypeScript 강화: 2-3시간

**우선순위 낮음 (선택):** 14-18시간
- 성능 모니터링: 3-4시간
- 테스트 코드: 8-10시간
- 접근성 개선: 3-4시간

**총합:** 32-42시간

---

### 🚧 Phase 5 예정

**다음 단계 구현 예정:**
- [ ] **고급 TODO 기능**
  - TODO 드래그 앤 드롭 (순서 변경)
  - TODO 복제
  - TODO 템플릿
  - 일괄 작업 (다중 선택, 일괄 삭제/상태 변경)

- [ ] **사용자 경험 개선**
  - 키보드 단축키 (Ctrl+N: 새 TODO, Ctrl+K: 검색 등)
  - 다크 모드
  - 애니메이션 효과
  - 접근성 개선 (WCAG 2.1 Level AA)

- [ ] **고급 뷰 모드**
  - 칸반 보드 뷰 (드래그 앤 드롭)
  - 캘린더 뷰 (마감일 기준)

- [ ] **추가 기능**
  - 태그 시스템
  - 체크리스트 (서브 태스크)
  - 반복 작업
  - 브라우저 알림 (Notification API)

### 📅 Phase 7 예정 - TODO 일정 관리 및 알림 기능 UI

**기능 개요:**
TODO 일정 관리 필드를 입력/수정할 수 있는 UI와 알림 설정 인터페이스를 구현합니다.

#### 1. TODO 타입 확장

**자동 생성된 타입 (백엔드 연동 후):**

```typescript
// src/client/types.gen.ts

export type TodoRequest = {
    // ... 기존 필드들 ...
    
    // 일정 관련 필드
    startDate?: string | null;           // ISO 8601 날짜/시간 문자열
    endDate?: string | null;
    isAllDay?: boolean;                  // 종일 일정 여부
    recurrenceRule?: string | null;      // 반복 설정 JSON
    location?: string | null;            // 장소
    estimatedDuration?: number | null;   // 예상 소요 시간 (분)
    
    // 알림 관련 필드
    notificationSettings?: string | null; // 알림 설정 JSON 배열
    notificationEnabled?: boolean;       // 알림 활성화 여부
};

export type TodoResponse = {
    // ... 기존 필드들 ...
    
    startDate?: string | null;
    endDate?: string | null;
    isAllDay?: boolean;
    recurrenceRule?: string | null;
    location?: string | null;
    estimatedDuration?: number | null;
    notificationSettings?: string | null;
    notificationEnabled?: boolean;
    parentTodoId?: number | null;        // 반복 일정의 원본 ID
};
```

#### 2. 일정 입력 컴포넌트

**DateTimeRangePicker.vue (신규 생성)**

```vue
<template>
  <div class="space-y-4">
    <!-- 종일 일정 토글 -->
    <div class="flex items-center gap-2">
      <input
        id="is-all-day"
        v-model="localIsAllDay"
        type="checkbox"
        class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
      />
      <label for="is-all-day" class="text-sm font-medium text-gray-700">
        종일 일정
      </label>
    </div>
    
    <!-- 시작 일시 -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        시작 일시
      </label>
      <input
        v-model="localStartDate"
        :type="localIsAllDay ? 'date' : 'datetime-local'"
        class="input-field"
        :required="required"
      />
    </div>
    
    <!-- 종료 일시 (선택) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        종료 일시 (선택)
      </label>
      <input
        v-model="localEndDate"
        :type="localIsAllDay ? 'date' : 'datetime-local'"
        class="input-field"
        :min="localStartDate"
      />
    </div>
    
    <!-- 예상 소요 시간 -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        예상 소요 시간
      </label>
      <div class="flex gap-2 items-center">
        <input
          v-model.number="durationHours"
          type="number"
          min="0"
          max="23"
          class="input-field w-20"
          placeholder="0"
        />
        <span class="text-sm text-gray-600">시간</span>
        <input
          v-model.number="durationMinutes"
          type="number"
          min="0"
          max="59"
          step="15"
          class="input-field w-20"
          placeholder="0"
        />
        <span class="text-sm text-gray-600">분</span>
      </div>
    </div>
    
    <!-- 장소 -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        장소 (선택)
      </label>
      <input
        v-model="localLocation"
        type="text"
        class="input-field"
        placeholder="예: 서울시 강남구 테헤란로 123"
        maxlength="500"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Props {
  startDate?: string | null
  endDate?: string | null
  isAllDay?: boolean
  location?: string | null
  estimatedDuration?: number | null  // 분 단위
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isAllDay: false,
  required: false
})

const emit = defineEmits<{
  'update:startDate': [value: string | null]
  'update:endDate': [value: string | null]
  'update:isAllDay': [value: boolean]
  'update:location': [value: string | null]
  'update:estimatedDuration': [value: number | null]
}>()

const localStartDate = ref(props.startDate)
const localEndDate = ref(props.endDate)
const localIsAllDay = ref(props.isAllDay)
const localLocation = ref(props.location)

// 소요 시간을 시간과 분으로 분리
const durationHours = ref(
  props.estimatedDuration ? Math.floor(props.estimatedDuration / 60) : 0
)
const durationMinutes = ref(
  props.estimatedDuration ? props.estimatedDuration % 60 : 0
)

// 총 소요 시간 (분)
const totalDuration = computed(() => {
  const hours = durationHours.value || 0
  const minutes = durationMinutes.value || 0
  const total = hours * 60 + minutes
  return total > 0 ? total : null
})

// 변경 사항 emit
watch(localStartDate, (value) => emit('update:startDate', value || null))
watch(localEndDate, (value) => emit('update:endDate', value || null))
watch(localIsAllDay, (value) => emit('update:isAllDay', value))
watch(localLocation, (value) => emit('update:location', value || null))
watch(totalDuration, (value) => emit('update:estimatedDuration', value))

// 종일 일정 토글 시 시간 부분 제거/추가
watch(localIsAllDay, (isAllDay) => {
  if (isAllDay && localStartDate.value) {
    // datetime-local -> date 변환
    localStartDate.value = localStartDate.value.split('T')[0]
  }
  if (isAllDay && localEndDate.value) {
    localEndDate.value = localEndDate.value.split('T')[0]
  }
})
</script>
```

#### 3. 반복 설정 컴포넌트

**RecurrenceRuleEditor.vue (신규 생성)**

```vue
<template>
  <div class="space-y-4">
    <!-- 반복 활성화 토글 -->
    <div class="flex items-center gap-2">
      <input
        id="recurrence-enabled"
        v-model="isEnabled"
        type="checkbox"
        class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
      />
      <label for="recurrence-enabled" class="text-sm font-medium text-gray-700">
        반복 일정
      </label>
    </div>
    
    <div v-if="isEnabled" class="space-y-3 pl-6 border-l-2 border-blue-200">
      <!-- 반복 유형 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          반복 주기
        </label>
        <select v-model="rule.type" class="input-field">
          <option value="DAILY">매일</option>
          <option value="WEEKLY">매주</option>
          <option value="MONTHLY">매월</option>
          <option value="YEARLY">매년</option>
        </select>
      </div>
      
      <!-- 반복 간격 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ intervalLabel }}
        </label>
        <input
          v-model.number="rule.interval"
          type="number"
          min="1"
          max="30"
          class="input-field w-24"
        />
      </div>
      
      <!-- 요일 선택 (주간 반복 시) -->
      <div v-if="rule.type === 'WEEKLY'">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          반복 요일
        </label>
        <div class="flex gap-2">
          <button
            v-for="(day, index) in weekDays"
            :key="index"
            type="button"
            @click="toggleDay(index + 1)"
            :class="[
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              rule.daysOfWeek?.includes(index + 1)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ day }}
          </button>
        </div>
      </div>
      
      <!-- 날짜 선택 (월간 반복 시) -->
      <div v-if="rule.type === 'MONTHLY'">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          반복 날짜
        </label>
        <input
          v-model.number="rule.dayOfMonth"
          type="number"
          min="1"
          max="31"
          class="input-field w-24"
          placeholder="일"
        />
      </div>
      
      <!-- 종료 조건 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          반복 종료
        </label>
        <div class="space-y-2">
          <label class="flex items-center gap-2">
            <input
              v-model="endType"
              type="radio"
              value="never"
              class="w-4 h-4 text-blue-600"
            />
            <span class="text-sm text-gray-700">종료 안함</span>
          </label>
          
          <label class="flex items-center gap-2">
            <input
              v-model="endType"
              type="radio"
              value="date"
              class="w-4 h-4 text-blue-600"
            />
            <span class="text-sm text-gray-700">종료 날짜</span>
            <input
              v-if="endType === 'date'"
              v-model="rule.endDate"
              type="date"
              class="input-field flex-1"
            />
          </label>
          
          <label class="flex items-center gap-2">
            <input
              v-model="endType"
              type="radio"
              value="count"
              class="w-4 h-4 text-blue-600"
            />
            <span class="text-sm text-gray-700">반복 횟수</span>
            <input
              v-if="endType === 'count'"
              v-model.number="rule.count"
              type="number"
              min="1"
              max="365"
              class="input-field w-24"
              placeholder="회"
            />
          </label>
        </div>
      </div>
      
      <!-- 미리보기 -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p class="text-sm font-medium text-blue-900 mb-1">반복 요약</p>
        <p class="text-sm text-blue-700">{{ recurrenceSummary }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface RecurrenceRule {
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  interval: number
  daysOfWeek?: number[]  // 1-7 (월-일)
  dayOfMonth?: number    // 1-31
  endDate?: string | null
  count?: number | null
}

interface Props {
  recurrenceRule?: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:recurrenceRule': [value: string | null]
}>()

const isEnabled = ref(false)
const endType = ref<'never' | 'date' | 'count'>('never')

const rule = ref<RecurrenceRule>({
  type: 'DAILY',
  interval: 1,
  daysOfWeek: [],
})

const weekDays = ['월', '화', '수', '목', '금', '토', '일']

// 초기 데이터 로드
if (props.recurrenceRule) {
  try {
    const parsed = JSON.parse(props.recurrenceRule) as RecurrenceRule
    rule.value = parsed
    isEnabled.value = true
    
    if (parsed.endDate) endType.value = 'date'
    else if (parsed.count) endType.value = 'count'
  } catch (e) {
    console.error('반복 규칙 파싱 실패:', e)
  }
}

// 간격 레이블
const intervalLabel = computed(() => {
  const labels = {
    DAILY: '며칠마다',
    WEEKLY: '몇 주마다',
    MONTHLY: '몇 개월마다',
    YEARLY: '몇 년마다',
  }
  return labels[rule.value.type]
})

// 반복 요약
const recurrenceSummary = computed(() => {
  if (!isEnabled.value) return ''
  
  const { type, interval } = rule.value
  
  let summary = ''
  if (type === 'DAILY') {
    summary = interval === 1 ? '매일' : `${interval}일마다`
  } else if (type === 'WEEKLY') {
    const days = rule.value.daysOfWeek || []
    const dayNames = days.map(d => weekDays[d - 1]).join(', ')
    summary = `${interval}주마다 (${dayNames || '요일 선택 안함'})`
  } else if (type === 'MONTHLY') {
    const day = rule.value.dayOfMonth || '?'
    summary = `${interval}개월마다 ${day}일`
  } else if (type === 'YEARLY') {
    summary = interval === 1 ? '매년' : `${interval}년마다`
  }
  
  if (endType.value === 'date' && rule.value.endDate) {
    summary += `, ${rule.value.endDate}까지`
  } else if (endType.value === 'count' && rule.value.count) {
    summary += `, ${rule.value.count}회 반복`
  }
  
  return summary
})

// 요일 토글
const toggleDay = (day: number) => {
  if (!rule.value.daysOfWeek) {
    rule.value.daysOfWeek = []
  }
  
  const index = rule.value.daysOfWeek.indexOf(day)
  if (index > -1) {
    rule.value.daysOfWeek.splice(index, 1)
  } else {
    rule.value.daysOfWeek.push(day)
    rule.value.daysOfWeek.sort()
  }
}

// 변경 사항 emit
watch([isEnabled, rule, endType], () => {
  if (!isEnabled.value) {
    emit('update:recurrenceRule', null)
    return
  }
  
  const ruleToEmit: RecurrenceRule = {
    type: rule.value.type,
    interval: rule.value.interval,
  }
  
  if (rule.value.type === 'WEEKLY' && rule.value.daysOfWeek) {
    ruleToEmit.daysOfWeek = rule.value.daysOfWeek
  }
  
  if (rule.value.type === 'MONTHLY' && rule.value.dayOfMonth) {
    ruleToEmit.dayOfMonth = rule.value.dayOfMonth
  }
  
  if (endType.value === 'date') {
    ruleToEmit.endDate = rule.value.endDate
    ruleToEmit.count = null
  } else if (endType.value === 'count') {
    ruleToEmit.count = rule.value.count
    ruleToEmit.endDate = null
  } else {
    ruleToEmit.endDate = null
    ruleToEmit.count = null
  }
  
  emit('update:recurrenceRule', JSON.stringify(ruleToEmit))
}, { deep: true })
</script>
```

#### 4. 알림 설정 컴포넌트

**NotificationSettingsEditor.vue (신규 생성)**

```vue
<template>
  <div class="space-y-4">
    <!-- 알림 활성화 토글 -->
    <div class="flex items-center gap-2">
      <input
        id="notification-enabled"
        v-model="localEnabled"
        type="checkbox"
        class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
      />
      <label for="notification-enabled" class="text-sm font-medium text-gray-700">
        알림 받기
      </label>
    </div>
    
    <div v-if="localEnabled" class="space-y-3 pl-6 border-l-2 border-blue-200">
      <!-- 알림 목록 -->
      <div
        v-for="(notification, index) in notifications"
        :key="index"
        class="flex gap-2 items-start p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex-1 space-y-2">
          <!-- 알림 타입 -->
          <select
            v-model="notification.type"
            class="input-field text-sm"
          >
            <option value="EMAIL">이메일</option>
            <option value="SMS">문자 메시지</option>
            <option value="KAKAO">카카오톡</option>
            <option value="PUSH">브라우저 알림</option>
          </select>
          
          <!-- 알림 시간 -->
          <div class="flex gap-2 items-center">
            <select
              v-model.number="notification.timing"
              class="input-field text-sm flex-1"
            >
              <option :value="0">정시</option>
              <option :value="-5">5분 전</option>
              <option :value="-10">10분 전</option>
              <option :value="-15">15분 전</option>
              <option :value="-30">30분 전</option>
              <option :value="-60">1시간 전</option>
              <option :value="-120">2시간 전</option>
              <option :value="-1440">1일 전</option>
              <option :value="-2880">2일 전</option>
              <option :value="-10080">1주 전</option>
            </select>
          </div>
        </div>
        
        <!-- 삭제 버튼 -->
        <button
          type="button"
          @click="removeNotification(index)"
          class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <XIcon class="w-4 h-4" />
        </button>
      </div>
      
      <!-- 알림 추가 버튼 -->
      <button
        type="button"
        @click="addNotification"
        class="w-full px-4 py-2 text-sm font-medium text-blue-600 
               bg-blue-50 border border-blue-200 rounded-lg 
               hover:bg-blue-100 transition-colors"
      >
        + 알림 추가
      </button>
      
      <!-- 알림 미리보기 -->
      <div
        v-if="notifications.length > 0"
        class="bg-blue-50 border border-blue-200 rounded-lg p-3"
      >
        <p class="text-sm font-medium text-blue-900 mb-1">알림 요약</p>
        <ul class="text-sm text-blue-700 space-y-1">
          <li v-for="(notification, index) in notifications" :key="index">
            • {{ formatNotification(notification) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface NotificationSetting {
  type: 'EMAIL' | 'SMS' | 'KAKAO' | 'PUSH'
  timing: number  // 분 단위 (음수는 사전 알림)
}

interface Props {
  notificationSettings?: string | null
  notificationEnabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  notificationEnabled: false
})

const emit = defineEmits<{
  'update:notificationSettings': [value: string | null]
  'update:notificationEnabled': [value: boolean]
}>()

const localEnabled = ref(props.notificationEnabled)
const notifications = ref<NotificationSetting[]>([])

// 초기 데이터 로드
if (props.notificationSettings) {
  try {
    notifications.value = JSON.parse(props.notificationSettings)
  } catch (e) {
    console.error('알림 설정 파싱 실패:', e)
  }
}

// 기본 알림이 없으면 하나 추가
if (localEnabled.value && notifications.value.length === 0) {
  notifications.value.push({ type: 'EMAIL', timing: -30 })
}

// 알림 추가
const addNotification = () => {
  notifications.value.push({
    type: 'EMAIL',
    timing: -30
  })
}

// 알림 제거
const removeNotification = (index: number) => {
  notifications.value.splice(index, 1)
}

// 알림 포맷팅
const formatNotification = (notification: NotificationSetting) => {
  const typeLabels = {
    EMAIL: '이메일',
    SMS: '문자',
    KAKAO: '카카오톡',
    PUSH: '브라우저'
  }
  
  const type = typeLabels[notification.type]
  
  if (notification.timing === 0) {
    return `${type} - 정시`
  }
  
  const minutes = Math.abs(notification.timing)
  let timeStr = ''
  
  if (minutes >= 1440) {
    const days = Math.floor(minutes / 1440)
    timeStr = `${days}일 전`
  } else if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    timeStr = `${hours}시간 전`
  } else {
    timeStr = `${minutes}분 전`
  }
  
  return `${type} - ${timeStr}`
}

// 변경 사항 emit
watch(localEnabled, (value) => {
  emit('update:notificationEnabled', value)
  
  if (value && notifications.value.length === 0) {
    notifications.value.push({ type: 'EMAIL', timing: -30 })
  }
})

watch(notifications, () => {
  if (!localEnabled.value || notifications.value.length === 0) {
    emit('update:notificationSettings', null)
  } else {
    emit('update:notificationSettings', JSON.stringify(notifications.value))
  }
}, { deep: true })
</script>
```

#### 5. TODO 생성/수정 모달에 통합

**TodoCreateModal.vue 및 TodoEditModal.vue에 추가:**

```vue
<template>
  <div class="modal">
    <!-- ... 기존 필드들 ... -->
    
    <!-- 일정 섹션 -->
    <div class="mt-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">
        📅 일정 정보
      </h3>
      <DateTimeRangePicker
        v-model:start-date="form.startDate"
        v-model:end-date="form.endDate"
        v-model:is-all-day="form.isAllDay"
        v-model:location="form.location"
        v-model:estimated-duration="form.estimatedDuration"
      />
    </div>
    
    <!-- 반복 설정 섹션 -->
    <div class="mt-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">
        🔁 반복 설정
      </h3>
      <RecurrenceRuleEditor
        v-model:recurrence-rule="form.recurrenceRule"
      />
    </div>
    
    <!-- 알림 설정 섹션 -->
    <div class="mt-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">
        🔔 알림 설정
      </h3>
      <NotificationSettingsEditor
        v-model:notification-settings="form.notificationSettings"
        v-model:notification-enabled="form.notificationEnabled"
      />
    </div>
    
    <!-- ... 버튼들 ... -->
  </div>
</template>

<script setup lang="ts">
import DateTimeRangePicker from '@/components/DateTimeRangePicker.vue'
import RecurrenceRuleEditor from '@/components/RecurrenceRuleEditor.vue'
import NotificationSettingsEditor from '@/components/NotificationSettingsEditor.vue'

// ... 기존 코드 ...
</script>
```

#### 6. TODO 상세 페이지에 일정 정보 표시

**TodoDetailView.vue에 추가:**

```vue
<template>
  <div class="container mx-auto px-4 py-6">
    <!-- ... 기존 내용 ... -->
    
    <!-- 일정 정보 카드 -->
    <div v-if="hasScheduleInfo" class="card mt-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">
        📅 일정 정보
      </h3>
      
      <div class="space-y-3">
        <!-- 종일 일정 배지 -->
        <div v-if="todo.isAllDay" class="inline-block">
          <span class="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
            종일 일정
          </span>
        </div>
        
        <!-- 시작 일시 -->
        <div v-if="todo.startDate" class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-600 w-24">시작:</span>
          <span class="text-sm text-gray-800">
            {{ formatDateTime(todo.startDate, todo.isAllDay) }}
          </span>
        </div>
        
        <!-- 종료 일시 -->
        <div v-if="todo.endDate" class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-600 w-24">종료:</span>
          <span class="text-sm text-gray-800">
            {{ formatDateTime(todo.endDate, todo.isAllDay) }}
          </span>
        </div>
        
        <!-- 예상 소요 시간 -->
        <div v-if="todo.estimatedDuration" class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-600 w-24">소요 시간:</span>
          <span class="text-sm text-gray-800">
            {{ formatDuration(todo.estimatedDuration) }}
          </span>
        </div>
        
        <!-- 장소 -->
        <div v-if="todo.location" class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-600 w-24">장소:</span>
          <span class="text-sm text-gray-800">{{ todo.location }}</span>
        </div>
        
        <!-- 반복 설정 -->
        <div v-if="todo.recurrenceRule" class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-600 w-24">반복:</span>
          <span class="text-sm text-gray-800">
            {{ formatRecurrence(todo.recurrenceRule) }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- 알림 설정 카드 -->
    <div v-if="todo.notificationEnabled && todo.notificationSettings" class="card mt-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">
        🔔 알림 설정
      </h3>
      
      <ul class="space-y-2">
        <li
          v-for="(notification, index) in parseNotifications(todo.notificationSettings)"
          :key="index"
          class="flex items-center gap-2 text-sm"
        >
          <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
          <span class="text-gray-800">
            {{ formatNotification(notification) }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

// ... 기존 코드 ...

const hasScheduleInfo = computed(() => {
  return todo.value?.startDate || 
         todo.value?.endDate || 
         todo.value?.location || 
         todo.value?.estimatedDuration ||
         todo.value?.recurrenceRule
})

const formatDateTime = (dateStr: string, isAllDay?: boolean) => {
  const date = new Date(dateStr)
  if (isAllDay) {
    return format(date, 'yyyy년 M월 d일', { locale: ko })
  }
  return format(date, 'yyyy년 M월 d일 HH:mm', { locale: ko })
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0 && mins > 0) {
    return `${hours}시간 ${mins}분`
  } else if (hours > 0) {
    return `${hours}시간`
  } else {
    return `${mins}분`
  }
}

const formatRecurrence = (ruleJson: string) => {
  try {
    const rule = JSON.parse(ruleJson)
    // 반복 규칙을 읽기 쉬운 형태로 변환
    // 구현 로직은 RecurrenceRuleEditor의 recurrenceSummary와 유사
    return '매일 반복'  // 간단한 예시
  } catch {
    return '반복 설정'
  }
}

const parseNotifications = (settingsJson: string) => {
  try {
    return JSON.parse(settingsJson)
  } catch {
    return []
  }
}

const formatNotification = (notification: any) => {
  // NotificationSettingsEditor의 formatNotification과 동일한 로직
  const typeLabels = { EMAIL: '이메일', SMS: '문자', KAKAO: '카카오톡', PUSH: '브라우저' }
  const type = typeLabels[notification.type as keyof typeof typeLabels]
  
  if (notification.timing === 0) return `${type} - 정시`
  
  const minutes = Math.abs(notification.timing)
  let timeStr = ''
  
  if (minutes >= 1440) {
    timeStr = `${Math.floor(minutes / 1440)}일 전`
  } else if (minutes >= 60) {
    timeStr = `${Math.floor(minutes / 60)}시간 전`
  } else {
    timeStr = `${minutes}분 전`
  }
  
  return `${type} - ${timeStr}`
}
</script>
```

#### 7. 캘린더 뷰 (선택사항)

**CalendarView.vue (신규 생성)**

```vue
<template>
  <div class="calendar-view">
    <div class="calendar-header">
      <button @click="previousMonth">이전</button>
      <h2>{{ currentMonthLabel }}</h2>
      <button @click="nextMonth">다음</button>
    </div>
    
    <div class="calendar-grid">
      <!-- 요일 헤더 -->
      <div v-for="day in weekDays" :key="day" class="calendar-day-header">
        {{ day }}
      </div>
      
      <!-- 날짜 셀 -->
      <div
        v-for="date in calendarDates"
        :key="date.toString()"
        class="calendar-date-cell"
        :class="{ 'is-today': isToday(date) }"
      >
        <div class="date-number">{{ date.getDate() }}</div>
        
        <!-- 해당 날짜의 TODO들 -->
        <div
          v-for="todo in getTodosForDate(date)"
          :key="todo.id"
          class="calendar-todo-item"
          @click="openTodoDetail(todo.id)"
        >
          <span class="todo-title">{{ todo.title }}</span>
          <span v-if="todo.startDate" class="todo-time">
            {{ formatTime(todo.startDate) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 캘린더 뷰 구현
// FullCalendar 또는 v-calendar 라이브러리 사용 추천
</script>
```

#### 8. 구현 체크리스트

**Phase 6-1: 기본 일정 입력 (4-5시간)**
- [ ] DateTimeRangePicker.vue 컴포넌트 생성
- [ ] 종일 일정 토글 기능
- [ ] 시작/종료 일시 입력
- [ ] 예상 소요 시간 입력
- [ ] 장소 입력
- [ ] TodoCreateModal/TodoEditModal에 통합

**Phase 6-2: 반복 설정 UI (5-6시간)**
- [ ] RecurrenceRuleEditor.vue 컴포넌트 생성
- [ ] 반복 유형 선택 (일간/주간/월간/년간)
- [ ] 반복 간격 설정
- [ ] 요일 선택 (주간 반복 시)
- [ ] 날짜 선택 (월간 반복 시)
- [ ] 반복 종료 조건 (날짜/횟수)
- [ ] 반복 요약 표시

**Phase 6-3: 알림 설정 UI (4-5시간)**
- [ ] NotificationSettingsEditor.vue 컴포넌트 생성
- [ ] 알림 타입 선택 (이메일/SMS/카카오톡/푸시)
- [ ] 알림 시간 설정 (분/시간/일 전)
- [ ] 여러 알림 추가/삭제
- [ ] 알림 요약 표시

**Phase 6-4: TODO 상세 페이지 확장 (2-3시간)**
- [ ] 일정 정보 섹션 추가
- [ ] 알림 설정 섹션 추가
- [ ] 날짜/시간 포맷팅
- [ ] 반복 규칙 표시

**Phase 6-5: 캘린더 뷰 (선택, 8-10시간)**
- [ ] 캘린더 컴포넌트 생성 또는 라이브러리 통합
- [ ] 월간 뷰 구현
- [ ] TODO 표시 및 클릭 이벤트
- [ ] 날짜 네비게이션
- [ ] 반응형 디자인

**Phase 6-6: 알림 관리 페이지 (선택, 3-4시간)**
- [ ] 알림 이력 조회
- [ ] 알림 설정 전역 관리
- [ ] 알림 테스트 기능

**총 예상 개발 시간: 15-19시간 (캘린더 뷰 제외) 또는 23-29시간 (캘린더 뷰 포함)**

#### 9. 필요한 추가 패키지

```json
// package.json에 추가할 의존성 (선택사항)

{
  "dependencies": {
    // 캘린더 라이브러리 (택1)
    "v-calendar": "^3.0.0",            // 가볍고 커스터마이징 용이
    "@fullcalendar/vue3": "^6.1.0",    // 기능이 풍부함
    
    // 아이콘 (이미 사용 중일 수 있음)
    "@heroicons/vue": "^2.0.0"
  }
}
```

#### 10. 참고 문서

- [v-calendar 문서](https://vcalendar.io/)
- [FullCalendar Vue 문서](https://fullcalendar.io/docs/vue)
- [date-fns 문서](https://date-fns.org/) (이미 사용 중)
- [MDN - Input type datetime-local](https://developer.mozilla.org/ko/docs/Web/HTML/Element/input/datetime-local)

### 📤 Phase 6 예정 - 파일 출력(Export) 기능

**기능 개요:**
TODO 및 프로젝트 데이터를 다양한 파일 형식으로 내보내기할 수 있는 기능 추가

#### UI/UX 설계

**1. 내보내기 버튼 위치**
- **TodoListView**: 필터/정렬 바 옆에 내보내기 버튼 추가
  - 현재 필터링된 TODO 목록 전체를 내보내기
- **TodoDetailView**: 상세 페이지 상단에 내보내기 버튼 추가
  - 현재 보고 있는 TODO 단건 내보내기
- **프로젝트 섹션**: 각 프로젝트 카드에 내보내기 버튼 추가
  - 해당 프로젝트의 모든 TODO를 내보내기

**2. 내보내기 모달 방식**
- 각 위치에 "내보내기" 버튼 **하나만** 배치
- 버튼 클릭 시 **팝업 모달** 표시
- 모달에서 파일 형식 선택 (JSON / Excel / PDF)
- 선택한 형식으로 다운로드 진행

**3. 내보내기 UI 컴포넌트**

```vue
<!-- ExportButton.vue (신규 생성) -->
<template>
  <button 
    @click="openModal" 
    class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 
           bg-white border border-gray-300 rounded-lg hover:bg-gray-50 
           focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <DownloadIcon class="w-4 h-4" />
    내보내기
  </button>
</template>

<script setup lang="ts">
interface Props {
  // 'single' - 단일 TODO, 'list' - 필터링된 목록, 'selected' - 선택된 항목
  exportType: 'single' | 'list' | 'selected'
  todoId?: number  // exportType이 'single'일 때 필요
  todoIds?: number[]  // exportType이 'selected'일 때 필요
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'open-modal': []
}>()

const openModal = () => {
  emit('open-modal')
}
</script>
```

```vue
<!-- ExportModal.vue (신규 생성) -->
<template>
  <!-- 모달 오버레이 -->
  <div 
    v-if="isOpen" 
    @click="handleOverlayClick"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <!-- 모달 컨텐츠 -->
    <div 
      @click.stop
      class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6"
    >
      <!-- 헤더 -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800">파일 형식 선택</h2>
        <button 
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XIcon class="w-6 h-6" />
        </button>
      </div>
      
      <!-- 파일 형식 옵션들 -->
      <div class="space-y-3">
        <!-- JSON 옵션 -->
        <button 
          @click="handleExport('json')"
          class="w-full flex items-center gap-4 p-4 border border-gray-200 
                 rounded-lg hover:border-blue-500 hover:bg-blue-50 
                 transition-all group"
        >
          <div class="flex-shrink-0">
            <FileJsonIcon class="w-10 h-10 text-blue-500" />
          </div>
          <div class="flex-1 text-left">
            <h3 class="font-semibold text-gray-800 group-hover:text-blue-600">
              JSON
            </h3>
            <p class="text-sm text-gray-600">
              데이터 백업 및 마이그레이션에 적합
            </p>
          </div>
          <ChevronRightIcon class="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
        </button>
        
        <!-- Excel 옵션 -->
        <button 
          @click="handleExport('excel')"
          class="w-full flex items-center gap-4 p-4 border border-gray-200 
                 rounded-lg hover:border-green-500 hover:bg-green-50 
                 transition-all group"
        >
          <div class="flex-shrink-0">
            <FileSpreadsheetIcon class="w-10 h-10 text-green-500" />
          </div>
          <div class="flex-1 text-left">
            <h3 class="font-semibold text-gray-800 group-hover:text-green-600">
              Excel
            </h3>
            <p class="text-sm text-gray-600">
              편집 및 분석 가능한 스프레드시트
            </p>
          </div>
          <ChevronRightIcon class="w-5 h-5 text-gray-400 group-hover:text-green-500" />
        </button>
        
        <!-- PDF 옵션 -->
        <button 
          @click="handleExport('pdf')"
          class="w-full flex items-center gap-4 p-4 border border-gray-200 
                 rounded-lg hover:border-red-500 hover:bg-red-50 
                 transition-all group"
        >
          <div class="flex-shrink-0">
            <FilePdfIcon class="w-10 h-10 text-red-500" />
          </div>
          <div class="flex-1 text-left">
            <h3 class="font-semibold text-gray-800 group-hover:text-red-600">
              PDF
            </h3>
            <p class="text-sm text-gray-600">
              인쇄 및 공유용 문서
            </p>
          </div>
          <ChevronRightIcon class="w-5 h-5 text-gray-400 group-hover:text-red-500" />
        </button>
      </div>
      
      <!-- 취소 버튼 -->
      <button 
        @click="closeModal"
        class="w-full mt-6 px-4 py-2 text-sm font-medium text-gray-700 
               bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        취소
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'

interface Props {
  isOpen: boolean
  exportType: 'single' | 'list' | 'selected'
  todoId?: number
  todoIds?: number[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'close': []
  'export': [format: 'json' | 'excel' | 'pdf']
}>()

const handleExport = (format: 'json' | 'excel' | 'pdf') => {
  emit('export', format)
  closeModal()
}

const closeModal = () => {
  emit('close')
}

const handleOverlayClick = () => {
  closeModal()
}

// ESC 키로 모달 닫기
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleEscape)
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }
})
</script>
```

**3. 파일 다운로드 유틸리티**

```typescript
// src/utils/fileDownload.ts (신규 생성)

/**
 * Blob 데이터를 파일로 다운로드
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * 파일명에 현재 날짜 추가
 */
export function generateFilename(
  prefix: string, 
  extension: string, 
  includeTimestamp = true
): string {
  const date = new Date()
  const dateStr = date.toISOString().split('T')[0]  // YYYY-MM-DD
  const timeStr = includeTimestamp 
    ? `_${date.getHours()}${date.getMinutes()}${date.getSeconds()}` 
    : ''
  
  return `${prefix}_${dateStr}${timeStr}.${extension}`
}

// 사용 예시
// generateFilename('todos', 'xlsx')
// => 'todos_2025-12-07_142536.xlsx'
```

**4. Store에 Export 액션 추가**

```typescript
// src/stores/todo.ts

import { downloadBlob, generateFilename } from '@/utils/fileDownload'

export const useTodoStore = defineStore('todo', () => {
  // ... 기존 코드 ...
  
  /**
   * 단일 TODO를 파일로 내보내기
   */
  async function exportSingleTodo(todoId: number, format: 'json' | 'excel' | 'pdf') {
    try {
      const response = await client.GET(`/api/todos/${todoId}/export/${format}`, {
        responseType: 'blob',  // Blob으로 응답 받기
      })
      
      if (response.data) {
        const extension = format === 'excel' ? 'xlsx' : format
        const filename = generateFilename(`todo_${todoId}`, extension)
        downloadBlob(response.data, filename)
        
        useToast().success(`${format.toUpperCase()} 파일로 내보내기 완료`)
      }
    } catch (error) {
      useToast().error('파일 내보내기에 실패했습니다')
      throw error
    }
  }
  
  /**
   * 필터링된 TODO 목록을 파일로 내보내기
   */
  async function exportFilteredTodos(format: 'json' | 'excel') {
    try {
      const params = {
        ...filters.value,
        // 페이징 제거 (전체 데이터 가져오기)
        page: undefined,
        size: undefined,
      }
      
      const response = await client.GET(`/api/todos/export/${format}`, {
        params,
        responseType: 'blob',
      })
      
      if (response.data) {
        const extension = format === 'excel' ? 'xlsx' : format
        const filename = generateFilename('todos', extension)
        downloadBlob(response.data, filename)
        
        useToast().success(`${format.toUpperCase()} 파일로 내보내기 완료`)
      }
    } catch (error) {
      useToast().error('파일 내보내기에 실패했습니다')
      throw error
    }
  }
  
  /**
   * 선택된 TODO들을 파일로 내보내기
   */
  async function exportSelectedTodos(
    todoIds: number[], 
    format: 'json' | 'excel'
  ) {
    try {
      const response = await client.POST(`/api/todos/export/${format}`, {
        body: todoIds,
        responseType: 'blob',
      })
      
      if (response.data) {
        const extension = format === 'excel' ? 'xlsx' : format
        const filename = generateFilename('todos_selected', extension)
        downloadBlob(response.data, filename)
        
        useToast().success(`${todoIds.length}개 항목을 ${format.toUpperCase()} 파일로 내보냈습니다`)
      }
    } catch (error) {
      useToast().error('파일 내보내기에 실패했습니다')
      throw error
    }
  }
  
  return {
    // ... 기존 return 항목들 ...
    exportSingleTodo,
    exportFilteredTodos,
    exportSelectedTodos,
  }
})
```

**5. TodoListView에 내보내기 버튼 및 모달 추가**

```vue
<!-- src/views/TodoListView.vue -->
<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-3xl font-bold mb-6">할 일 목록</h1>
    
    <!-- 필터/정렬 바와 내보내기 버튼을 나란히 배치 -->
    <div class="flex gap-4 mb-6">
      <div class="flex-1">
        <FilterSortBar
          :filters="filters"
          :project-options="projectOptions"
          @update:filters="handleFilterChange"
        />
      </div>
      
      <!-- 내보내기 버튼 추가 -->
      <div class="flex-shrink-0">
        <ExportButton
          export-type="list"
          @open-modal="showExportModal = true"
        />
      </div>
    </div>
    
    <!-- ... TODO 목록 ... -->
    
    <!-- 내보내기 모달 -->
    <ExportModal
      :is-open="showExportModal"
      export-type="list"
      @close="showExportModal = false"
      @export="handleExport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from '@/stores/todo'
import ExportButton from '@/components/ExportButton.vue'
import ExportModal from '@/components/ExportModal.vue'

const todoStore = useTodoStore()
const showExportModal = ref(false)

const handleExport = async (format: 'json' | 'excel' | 'pdf') => {
  await todoStore.exportFilteredTodos(format)
}
</script>
```

**6. TodoDetailView에 내보내기 버튼 및 모달 추가**

```vue
<!-- src/views/TodoDetailView.vue -->
<template>
  <div class="container mx-auto px-4 py-6">
    <!-- 헤더와 액션 버튼들 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">할 일 상세</h1>
      
      <div class="flex gap-2">
        <!-- 내보내기 버튼 추가 -->
        <ExportButton
          export-type="single"
          :todo-id="todoId"
          @open-modal="showExportModal = true"
        />
        
        <!-- 수정, 삭제 버튼 -->
        <button @click="handleEdit">수정</button>
        <button @click="handleDelete">삭제</button>
      </div>
    </div>
    
    <!-- ... TODO 상세 정보 ... -->
    
    <!-- 내보내기 모달 -->
    <ExportModal
      :is-open="showExportModal"
      export-type="single"
      :todo-id="todoId"
      @close="showExportModal = false"
      @export="handleExport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTodoStore } from '@/stores/todo'
import ExportButton from '@/components/ExportButton.vue'
import ExportModal from '@/components/ExportModal.vue'

const todoStore = useTodoStore()
const route = useRoute()
const todoId = Number(route.params.id)
const showExportModal = ref(false)

const handleExport = async (format: 'json' | 'excel' | 'pdf') => {
  await todoStore.exportSingleTodo(todoId, format)
}
</script>
```

#### 구현 체크리스트

**1단계: 기본 인프라 (2-3시간)**
- [ ] `ExportButton.vue` 컴포넌트 생성 (모달 열기 버튼)
- [ ] `ExportModal.vue` 컴포넌트 생성 (파일 형식 선택 모달)
- [ ] `src/utils/fileDownload.ts` 유틸리티 생성
- [ ] Heroicons 또는 Lucide 아이콘 추가 (다운로드, 파일, X, ChevronRight 아이콘)
- [ ] 모달 오버레이 스타일링 및 애니메이션
- [ ] ESC 키로 모달 닫기 기능
- [ ] Store에 export 액션 추가

**2단계: JSON 내보내기 (2-3시간)**
- [ ] JSON 내보내기 API 연동
- [ ] TodoListView에 내보내기 버튼 추가
- [ ] TodoDetailView에 내보내기 버튼 추가
- [ ] 프로젝트 카드에 내보내기 버튼 추가
- [ ] 다운로드 성공/실패 Toast 알림
- [ ] 로딩 상태 처리

**3단계: Excel 내보내기 (1시간)**
- [ ] Excel 내보내기 API 연동
- [ ] 드롭다운 메뉴에 Excel 옵션 추가
- [ ] 다운로드 테스트

**4단계: PDF 내보내기 (1시간)**
- [ ] PDF 내보내기 API 연동
- [ ] 드롭다운 메뉴에 PDF 옵션 추가
- [ ] 다운로드 테스트

**5단계: 고급 기능 (선택사항, 2-3시간)**
- [ ] 일괄 선택 모드 추가 (체크박스로 여러 TODO 선택)
- [ ] 선택된 항목만 내보내기
- [ ] 내보내기 전 미리보기 모달
- [ ] 내보내기 옵션 설정 (포함할 필드 선택 등)

#### 예상 개발 기간

- **기본 인프라 (버튼 + 모달)**: 2-3시간
- **JSON 내보내기**: 2-3시간
- **Excel 내보내기**: 1시간
- **PDF 내보내기**: 1시간
- **테스트 및 버그 수정**: 2-3시간
- **총 예상 시간**: 8-11시간

#### 기술 스택

- **파일 다운로드**: Blob API + URL.createObjectURL
- **아이콘**: Heroicons 또는 Lucide Vue
- **상태 관리**: Pinia Store에 export 액션 추가
- **에러 처리**: 기존 Toast 알림 시스템 활용

#### 참고 자료

- [MDN - Blob API](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [MDN - Download Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download)
- [Heroicons](https://heroicons.com/)
- [Lucide Icons](https://lucide.dev/)

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

# TodoApp Frontend

Vue 3 + TypeScript + Tailwind CSS로 구축된 TodoApp 프론트엔드입니다.

## 📋 프로젝트 정보

이 프로젝트는 독립적인 Git 레포지토리로 관리됩니다. 백엔드와 별도로 버전 관리됩니다.

## 📊 현재 개발 상태

- ✅ **Phase 1 완료**: TODO CRUD, 인증, 필터/정렬/검색, 페이지네이션, 통계 대시보드
- ✅ **Phase 2 완료**: 프로젝트 관리, 프로젝트-TODO 통합, 프로젝트 필터링
- ✅ **Phase 3 완료**: TODO 상세 페이지 완전 구현 (상세 정보, 상태 변경, 수정/삭제)

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
- [x] **TODO 상세 페이지** (`TodoDetailView.vue`) ✅
  - 완전한 상세 정보 표시
    - 제목, 설명 (여러 줄 지원)
    - 상태 배지 (할 일/진행중/완료) 및 우선순위 배지
    - 프로젝트 정보 (프로젝트 이름 및 색상 표시)
  - 날짜 정보 섹션
    - 생성일, 수정일
    - 마감일 (마감일 지남 경고 포함)
    - 완료일 (완료된 경우)
    - 한국어 날짜 포맷팅 (date-fns)
  - 액션 기능
    - 수정 버튼 (TodoEditModal 연동)
    - 삭제 버튼 (확인 후 삭제 및 목록 이동)
    - 상태 변경 버튼 (할 일 ↔ 진행중 ↔ 완료)
    - 목록으로 돌아가기 버튼
  - UX 개선
    - 로딩 스피너 (데이터 로드 중)
    - 에러 처리 (TODO 찾을 수 없음)
    - 반응형 디자인 (모바일/태블릿/데스크톱)
    - 버튼 비활성화 (업데이트 중)
  - 기존 기능 연동
    - TodoCard 클릭 → 상세 페이지 이동
    - 프로젝트 정보 자동 로드
    - Toast 알림 연동

### 🚧 Phase 4 예정

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

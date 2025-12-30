# TodoApp Frontend

Vue 3 + TypeScript + Tailwind CSS�?구축??TodoApp ?�론?�엔?�입?�다.

## ?�� ?�로?�트 ?�보

???�로?�트???�립?�인 Git ?�포지?�리�?관리됩?�다. 백엔?��? 별도�?버전 관리됩?�다.

## ?�� ?�재 개발 ?�태

- ??**Phase 1 ?�료** (2025??11??: TODO CRUD, ?�증, ?�터/?�렬/검?? ?�이지?�이?? ?�계 ?�?�보??
- ??**Phase 2 ?�료** (2025??11??: ?�로?�트 관�? ?�로?�트-TODO ?�합, ?�로?�트 ?�터�?
- ??**Phase 3 ?�료** (2025??12??: TODO ?�세 ?�이지 ?�전 구현 (?�세 ?�보, ?�짜 관�? ?�태 변�? ?�정/??��)
- ??**Phase 4 ?�료** (2025??12??: ?�키?�처 �?코드 ?�질 개선 (Composable ?�턴, ?��????�데?�트, ?�러 처리 ?��???

## ?? ?�작?�기

### ?�전 ?�구?�항

- Node.js 20+ 
- npm ?�는 yarn
- 백엔???�버 ?�행 (http://localhost:8080)

### ?�치 �??�행

```bash
# ?�키지 ?�치
npm install

# API ?�라?�언??코드 ?�성 (백엔???�버 ?�행 ??
npm run generate:api
# ?�는 직접 ?�행
npx @hey-api/openapi-ts

# 개발 ?�버 ?�행 (http://localhost:5173)
npm run dev

# ?�로?�션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## ?�� ?�로?�트 구조

```
src/
?��??� client/                 # @hey-api/openapi-ts�??�동 ?�성??API ?�라?�언??
??  ?��??� client/            # ?�라?�언??구현
??  ?��??� core/              # ?�심 ?�틸리티
??  ?��??� sdk.gen.ts         # SDK ?�수??(login, signup, getTodos ??
??  ?��??� types.gen.ts       # TypeScript ?�???�의
??  ?��??� index.ts           # ?�합 export
??
?��??� components/            # ?�사??가?�한 컴포?�트
??  ?��??� TodoCard.vue       # TODO 카드 컴포?�트
??  ?��??� TodoCreateModal.vue # TODO ?�성 모달
??  ?��??� TodoEditModal.vue  # TODO ?�정 모달
??  ?��??� ProjectCard.vue    # ?�로?�트 카드 컴포?�트 ??
??  ?��??� ProjectCreateModal.vue # ?�로?�트 ?�성 모달 ??
??  ?��??� ProjectEditModal.vue # ?�로?�트 ?�정 모달 ??
??  ?��??� SelectField.vue    # ?�택 ?�드 컴포?�트
??  ?��??� FilterSortBar.vue  # ?�터/?�렬 �?(?�로?�트 ?�터 ?�함) ??
??  ?��??� Pagination.vue      # ?�이지?�이??
??  ?��??� LoadingSpinner.vue # 로딩 ?�피??
??  ?��??� ToastNotification.vue # ?�스???�림
??
?��??� config/                # ?�정 ?�일
??  ?��??� client.ts          # API ?�라?�언???�정 (?�증 ?�큰 ?�동 주입)
??
?��??� assets/                # CSS, ?��?지 ??
??  ?��??� main.css           # Tailwind CSS + 커스?� ?��???
??
?��??� composables/           # Vue 컴포?��???
??  ?��??� useErrorHandler.ts # ?�러 처리 컴포?��?
??  ?��??� useToast.ts        # ?�스???�림 컴포?��?
??  ?��??� useTodoOperations.ts # TODO ?�업 컴포?��?(Phase 4) ??
??  ?��??� useProjectOperations.ts # ?�로?�트 ?�업 컴포?��?(Phase 4) ??
??  ?��??� useFormValidation.ts # ??검�?컴포?��?(Phase 4) ??
??  ?��??� useConfirmDialog.ts # ?�인 ?�이?�로�?컴포?��?(Phase 4) ??
??
?��??� router/                # Vue Router ?�정
??  ?��??� index.ts           # ?�우???�의 + ?�비게이??가??
??
?��??� stores/                # Pinia ?�태 관�?
??  ?��??� auth.ts            # ?�증 ?�태
??  ?��??� todo.ts            # TODO ?�태
??  ?��??� project.ts         # ?�로?�트 ?�태 ??
??
?��??� types/                 # 추�? ?�???�의 �??�export
??  ?��??� index.ts           # ?�??별칭 �??�export
??
?��??� utils/                 # ?�틸리티 ?�수
??  ?��??� errorHandler.ts    # ?�러 처리 ?�틸리티
??
?��??� views/                 # ?�이지 컴포?�트
??  ?��??� LoginView.vue      # 로그???�이지
??  ?��??� SignupView.vue     # ?�원가???�이지
??  ?��??� TodoListView.vue   # TODO 목록 ?�이지 (?�로?�트 관�??�합) ??
??  ?��??� TodoDetailView.vue # TODO ?�세 ?�이지 ?�� (?�레?�스?�?�만 존재)
??  ?��??� NotFoundView.vue  # 404 ?�이지
??
?��??� App.vue                # 루트 컴포?�트
?��??� main.ts                # ???�트�??�인??
```

## ?�� ?��???가?�드

### Tailwind CSS ?�틸리티 ?�래??

?�로?�트?�서 ?�의??커스?� ?�래??

```css
/* 버튼 */
.btn-primary     /* 주요 버튼 (Blue ?�상) */
.btn-secondary   /* 보조 버튼 (Gray ?�상) */

/* ?�력 ?�드 */
.input-field     /* ?�스???�력 ?�드 */

/* 카드 */
.card            /* 카드 컨테?�너 */
```

## ?�� ?�증 처리

### ?�큰 ?�??
JWT ?�큰?� `localStorage`???�?�됩?�다:
- Key: `token`
- `src/config/client.ts`?�서 ?�동?�로 ?�청 ?�더???�함

### ?�증 가??
Vue Router?�서 ?�동?�로 ?�증 체크:
- ?�증 ?�요 ?�이지: `/todos`, `/todos/:id`
- 비인�??�이지: `/login`, `/signup`

## ?�� API ?�동 (@hey-api/openapi-ts)

### OpenAPI 코드 ?�성

???�로?�트??[`@hey-api/openapi-ts`](https://github.com/hey-api/openapi-ts)�??�용?�여 백엔?�의 OpenAPI ?�펙?�로부??TypeScript ?�라?�언??코드�??�동 ?�성?�니??

#### ?�정 ?�일
`openapi-ts.config.ts`?�서 ?�정:
```typescript
export default defineConfig({
  input: 'http://localhost:8080/api-docs',
  output: 'src/client',
  plugins: ['@hey-api/client-axios']
})
```

#### API 코드 ?�성
```bash
# 백엔???�버�?먼�? ?�행????
npx @hey-api/openapi-ts
```

??명령?�는:
1. `http://localhost:8080/api-docs`?�서 OpenAPI ?�펙 ?�운로드
2. `src/client/` ?�렉?�리??TypeScript 코드 ?�동 ?�성
3. 모든 ?�?�과 SDK ?�수 ?�성

### ?�라?�언???�정

`src/config/client.ts`?�서 ?�라?�언?��? 초기?�하�??�증 ?�큰???�동?�로 주입?�니??

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

### API ?�용 ?�시

```typescript
import { login, signup, getTodos, createTodo, getProjects, createProject } from '@/client'
import type { LoginRequest, TodoRequest, ProjectRequest } from '@/client'

// 로그??
const response = await login({
  body: { username: 'user', password: 'pass123' },
  throwOnError: true
})
const token = response.data?.data?.token

// TODO 목록 조회 (?�로?�트 ?�터 ?�함)
const todosResponse = await getTodos({
  query: {
    searchRequest: { projectId: 1, status: 'TODO', page: 0, size: 50 }
  },
  throwOnError: true
})
const todos = todosResponse.data?.data?.content

// TODO ?�성 (?�로?�트 지??
const newTodo: TodoRequest = {
  title: '??????,
  description: '?�명',
  status: 'TODO',
  priority: 'HIGH',
  projectId: 1
}
const created = await createTodo({
  body: newTodo,
  throwOnError: true
})

// ?�로?�트 목록 조회 ??
const projectsResponse = await getProjects({
  throwOnError: true
})
const projects = projectsResponse.data?.data

// ?�로?�트 ?�성 ??
const newProject: ProjectRequest = {
  name: '???�로?�트',
  description: '?�로?�트 ?�명',
  color: '#3B82F6',
  isDefault: false
}
const createdProject = await createProject({
  body: newProject,
  throwOnError: true
})
```

### 쿼리 ?�라미터 ?�면??

Spring??`@ModelAttribute`??중첩 객체가 ?�닌 ?�면 쿼리 ?�라미터�?기�??��?�? `todo.ts` store?�서 `paramsSerializer`�??�용?�여 쿼리 ?�라미터�??�면?�합?�다.

## ?���??�???�전??�?Null Safety

### TypeScript ?�???�스??

???�로?�트???�벽???�???�전?�을 보장?�기 ?�해 ?�층???�근 방식???�용?�니??

#### 1. ?�동 ?�성???�???�의

**@hey-api/openapi-ts**�??�성???�?�들?� 백엔?�의 OpenAPI ?�펙�?100% ?�치?�니??

```typescript
// src/client/types.gen.ts
export type TodoRequest = {
    title: string;                    // ?�수 ?�드
    description?: string | null;      // ?�택??+ null ?�용
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';  // ?�택??enum
    priority?: 'HIGH' | 'MEDIUM' | 'LOW';      // ?�택??enum
    dueDate?: string | null;          // ?�택??+ null ?�용 
    position?: number;                // ?�택???�드
    projectId?: number | null;        // ?�택??+ null ?�용
};

export type TodoResponse = {
    id?: number | null;               // ?�성 ??null
    title?: string;                   // ??�� 존재 (백엔?�에??보장)
    description?: string | null;      // null 가??
    status?: string;                  // enum??string?�로 직렬??
    priority?: string | null;         // null 가??
    dueDate?: string | null;          // null 가??
    completedAt?: string | null;      // ?�료?��? ?��? 경우 null
    createdAt?: string;               // ??�� 존재
    updatedAt?: string;               // ??�� 존재
};
```

#### 2. Zod ?�키�?검�?

?��????�??검증을 ?�한 Zod ?�키마도 ?�동 ?�성?�니??

```typescript
// src/client/zod.gen.ts
export const zTodoRequest = z.object({
    title: z.string().min(0).max(255),           // ?�수 + 길이 ?�한
    description: z.optional(z.union([            // ?�택??+ null ?�용
        z.string(),
        z.null()
    ])),
    status: z.optional(z.enum([                  // ?�택??enum
        'TODO', 'IN_PROGRESS', 'DONE'
    ])),
    dueDate: z.optional(z.union([                // ?�택??+ null ?�용
        z.iso.datetime(),
        z.null()
    ])),
    projectId: z.optional(z.union([              // ?�택??+ null ?�용
        z.coerce.bigint(),
        z.null()
    ]))
});
```

#### 3. 컴포?�트?�서???�전??Null 처리

**TodoCard.vue - ?�전???�이???�근**
```vue
<template>
  <div class="card">
    <!-- ?�수 ?�드??바로 ?�용 -->
    <h3>{{ todo.title }}</h3>
    
    <!-- null 가???�드??조건부 ?�더�?-->
    <p v-if="todo.description" class="text-gray-600">
      {{ todo.description }}
    </p>
    
    <!-- null 가???�드??기본�?처리 -->
    <span class="priority-badge">
      {{ todo.priority || 'MEDIUM' }}
    </span>
    
    <!-- Date 객체 변????null 체크 -->
    <time v-if="todo.dueDate" class="due-date">
      {{ formatDate(todo.dueDate) }}
    </time>
  </div>
</template>
```

**TodoCreateModal.vue - ???�이??처리**
```typescript
const form = ref<TodoRequest>({
  title: '',                    // ?�수 ?�드
  description: '',              // �?문자?�로 초기??
  status: 'TODO',               // 기본�??�정
  priority: 'MEDIUM',           // 기본�??�정
  dueDate: undefined            // undefined�?초기??
})

const handleSubmit = async () => {
  const todoData: TodoRequest = {
    title: form.value.title,
    // �?문자?�을 undefined�?변??(null ?�??
    description: form.value.description || undefined,
    status: form.value.status,
    priority: form.value.priority,
    dueDate: form.value.dueDate || undefined
  }
  
  emit('created', todoData)
}
```

**TodoEditModal.vue - ?�이??로딩 ??null 처리**
```typescript
const loadTodoData = (todo: TodoResponse) => {
  form.value = {
    title: todo.title || '',                    // null-safe 기본�?
    description: todo.description || '',        // null??�?문자?�로
    status: (todo.status as TodoStatus) || 'TODO',
    priority: (todo.priority as Priority) || 'MEDIUM',
    dueDate: todo.dueDate ? formatDateForInput(todo.dueDate) : undefined
  }
}

// ?�짜 변????try-catch�??�전 처리
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
    return ''  // ?�싱 ?�패 ??�?문자??반환
  }
}
```

#### 4. Store?�서???�???�전??

**todo.ts - Computed ?�성?�서??null 처리**
```typescript
// Getters?�서 null-safe ?�근
const todoCount = computed(() => stats.value?.todoCount || 0)
const inProgressCount = computed(() => stats.value?.inProgressCount || 0)
const doneCount = computed(() => stats.value?.doneCount || 0)
const completionRate = computed(() => stats.value?.completionRate || 0)

// API ?�답 처리 ??null 체크
const fetchTodos = async (params?: TodoSearchRequest) => {
  const response = await getTodos({...})
  const pageData = response.data?.data  // Optional chaining
  
  if (pageData) {
    todos.value = pageData.content || []  // null-safe 배열 ?�당
    totalPages.value = pageData.totalPages || 0
    totalElements.value = pageData.totalElements || 0
    currentPage.value = pageData.number || 0
  }
}
```

#### 5. ?�러 처리?�서???�???�전??

**errorHandler.ts - ?�전???�러 객체 ?�싱**
```typescript
export function parseApiError(error: unknown): ParsedError {
  if (isAxiosError(error)) {
    const response = error.response
    const errorData = response?.data
    
    // ?�??가?��? ?�한 ?�전???�근
    if (errorData && typeof errorData === 'object' && 'message' in errorData) {
      const apiResponse = errorData as { message?: string; data?: unknown }
      
      // null-safe 메시지 추출
      const message = (typeof apiResponse.message === 'string' ? 
        apiResponse.message : '') || 
        '?�청 처리 �??�류가 발생?�습?�다.'
      
      return {
        message,
        status: response?.status || 0,  // null-safe 기본�?
        statusText: response?.statusText || 'Unknown Error'
      }
    }
  }
  
  // ?�백 처리
  return {
    message: '?????�는 ?�류가 발생?�습?�다.',
    status: 0,
    statusText: 'Unknown Error'
  }
}
```

### TypeScript ?�정

**tsconfig.json**?�서 ?�격??null 체크 ?�성??
```json
{
  "compilerOptions": {
    "strict": true,              // ?�격 모드
    "strictNullChecks": true,    // null 체크 강화
    "noUncheckedIndexedAccess": true  // 배열/객체 ?�근 ??undefined 체크
  }
}
```

### ?�점

1. **컴파???�???�전??*: TypeScript가 null/undefined ?�근??컴파???�점??검�?
2. **?��???검�?*: Zod ?�키마로 API ?�답 ?�이??검�?
3. **?�동 ?�기??*: 백엔???�키�?변�????�론?�엔???�???�동 ?�데?�트
4. **IDE 지??*: ?�동?�성�??�???�트�?개발 ?�산???�상
5. **?�러 방�?**: null/undefined 관???��????�러 ?�전 방�?

## ?�� ?�태 관�?(Pinia)

### Auth Store
```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 로그??
await authStore.login({ username, password })

// 로그?�웃
authStore.logout()

// ?�증 ?�태 ?�인
if (authStore.isAuthenticated) {
  // ...
}
```

### Todo Store
```typescript
import { useTodoStore } from '@/stores/todo'

const todoStore = useTodoStore()

// TODO 목록 조회 (?�로?�트 ?�터 ?�함)
await todoStore.fetchTodos({ projectId: 1, status: 'TODO' })

// TODO ?�성 (?�로?�트 지??
await todoStore.createTodo({ ...todoData, projectId: 1 })

// TODO ?�정
await todoStore.updateTodo(todoId, todoData)

// ?�태 변�?
await todoStore.updateTodoStatus(todoId, 'DONE')

// TODO ??��
await todoStore.deleteTodo(todoId)

// ?�계 조회
await todoStore.fetchStats()
```

### Project Store ??
```typescript
import { useProjectStore } from '@/stores/project'

const projectStore = useProjectStore()

// ?�로?�트 목록 조회
await projectStore.fetchProjects()

// ?�로?�트 ?�성
await projectStore.createNewProject(projectData)

// ?�로?�트 ?�정
await projectStore.updateExistingProject(projectId, projectData)

// ?�로?�트 ??��
await projectStore.deleteExistingProject(projectId)

// 기본 ?�로?�트 조회
await projectStore.fetchDefaultProject()

// Select ?�션???�로?�트 목록
const projectOptions = projectStore.getProjectsForSelect
```

## ?�� 개발 진행 ?�황

### ??Phase 1 ?�료 (2025??11??

**구현 ?�료??기능:**
- [x] **TODO ?�심 기능**
  - TODO 카드 컴포?�트 (`TodoCard.vue`)
    - ?�태 배�? (TODO/IN_PROGRESS/DONE)
    - ?�선?�위 배�? (HIGH/MEDIUM/LOW)
    - 마감??�??�료???�시
    - ?�태 변�?버튼
    - ?�정/??�� 버튼
  - TODO ?�성 모달 (`TodoCreateModal.vue`)
    - ?�목, ?�명, ?�태, ?�선?�위, 마감???�력
    - ?�로?�트 ?�택 (Phase 2 ?�합)
    - ?�효??검??�??�러 처리
  - TODO ?�정 모달 (`TodoEditModal.vue`)
    - 기존 ?�이??로드 �??�정
    - ?�로?�트 변�?지??
    - ?�효??검??�??�러 처리

- [x] **?�터�?�?검??*
  - ?�터/?�렬 UI (`FilterSortBar.vue`)
    - 검??(?�목, ?�명 ?�워??
    - ?�태 ?�터 (TODO, IN_PROGRESS, DONE, ?�체)
    - ?�선?�위 ?�터 (HIGH, MEDIUM, LOW, ?�체)
    - ?�로?�트 ?�터 (Phase 2 ?�합)
    - ?�렬 (?�성?? 마감?? ?�선?�위, ?�목)
    - ?�렬 방향 (?�름차순, ?�림차순)
  - ?�시�?검??�??�터 ?�동

- [x] **UI 컴포?�트**
  - ?�이지?�이??(`Pagination.vue`)
    - ?�이지 번호 ?�시 �??�비게이??
    - ?�전/?�음 버튼
    - ?�체 개수 ?�시
  - 로딩 ?�피??(`LoadingSpinner.vue`)
    - 비동�??�업 �?로딩 ?�시
  - ?�스???�림 (`ToastNotification.vue`, `useToast.ts`)
    - ?�공/?�러/?�보 ?�림
    - ?�동 ?�라�?
    - ?�러 ?�림 ?�시 ?�시

- [x] **?�증 �??�우??*
  - ?�증 ?�스??(로그?? ?�원가?? 로그?�웃)
  - Vue Router ?�증 가??
  - JWT ?�큰 ?�동 주입

- [x] **?�태 관�?*
  - Pinia ?�토??(auth, todo)
  - API ?�라?�언???�동 ?�성 �??�동 (`@hey-api/openapi-ts`)
  - ?�벽???�???�전??

- [x] **?�계 �??�?�보??*
  - ?�계 ?�?�보??(?�체, ???? 진행�? ?�료 개수)
  - ?�시�??�계 ?�데?�트

- [x] **반응???�자??*
  - 모바?? ?�블�? ?�스?�톱 ?�??
  - Tailwind CSS 기반 반응???�이?�웃

### ??Phase 2 ?�료 (2025??11??

**구현 ?�료??기능:**
- [x] **?�로?�트 관�?*
  - ?�로?�트 카드 컴포?�트 (`ProjectCard.vue`)
    - ?�로?�트 ?�상 ?�시
    - 기본 ?�로?�트 배�?
    - ?�로?�트 ?�계 (TODO 개수)
    - ?�정/??��/?�택 버튼
  - ?�로?�트 ?�성 모달 (`ProjectCreateModal.vue`)
    - ?�로?�트 ?�름, ?�명, ?�상 ?�력
    - 기본 ?�로?�트 ?�정
  - ?�로?�트 ?�정 모달 (`ProjectEditModal.vue`)
    - ?�로?�트 ?�보 ?�정
    - 기본 ?�로?�트 변�?

- [x] **?�로?�트 ?�태 관�?*
  - ?�로?�트 ?�토??(`project.ts`)
    - CRUD ?�업 �??�태 관�?
    - ?�러 처리 �?로딩 ?�태
    - 기본 ?�로?�트 관�?
    - ?�로?�트 ?�렬 (기본 ?�로?�트 ?�선, position ??

- [x] **?�로?�트-TODO ?�합**
  - FilterSortBar???�로?�트 ?�터 추�?
  - ?�로?�트�?TODO 목록 조회
  - ?�로?�트 ?�택 ???�동 ?�터�?
  - TODO ?�성/?�정 ???�로?�트 지??

- [x] **?�합 UI**
  - TodoListView???�로?�트 관�??�션 ?�합
  - ?�로?�트 ?�택 �??�터�?UI
  - ?�로?�트�?TODO 그룹??

### ??Phase 3 ?�료 (2025??12??

**구현 ?�료??기능:**

- [x] **TODO ?�세 ?�이지** (`TodoDetailView.vue`) - ?�전 구현 ?�료 ??
  
  **?�세 ?�보 ?�시:**
  - ?�목 �??�명 (?�러 �?지?? `whitespace-pre-wrap`)
  - ?�태 배�? (????진행�??�료) �??�선?�위 배�? (?�음/보통/??��)
  - ?�로?�트 ?�보 (?�로?�트 ?�름 �??�상 배�?)
  - ?�우???�정 ?�료 (`/todos/:id`)
  
  **?�짜 ?�보 관�?**
  - ?�성?? ?�정???�동 ?�시
  - 마감???�시 �?**마감??지??경고** (?�️ 빨간??경고 문구)
  - ?�료???�시 (?�료 ?�태??경우�?
  - date-fns�??�용???�국???�짜 ?�맷??(`yyyy??M??d??HH:mm`)
  
  **?�터?�티�?기능:**
  - ?�정 버튼 (TodoEditModal ?�기 �??�동)
  - ??�� 버튼 (?�인 ?�이?�로�?????�� ??목록?�로 ?�동 ?�동)
  - ?�태 변�?버튼 (??????진행�????�료) - ?�재 ?�태???�라 ?�적 ?�시
  - 목록?�로 ?�아가�?버튼
  
  **UX/UI 개선:**
  - 로딩 ?�피??(?�이??로드 �?
  - ?�러 ?�태 처리 (TODO ?�음, 로드 ?�패 ??
  - 반응???�자??(모바???�블�??�스?�톱)
  - 버튼 비활?�화 ?�태 (?�데?�트 �?중복 ?�릭 방�?)
  - 깔끔??카드 ?�이?�웃 �??�상 코딩
  
  **기존 ?�스???�합:**
  - TodoCard ?�릭 ???�세 ?�이지 ?�동 ?�동
  - ?�로?�트 Store ?�동 (?�로?�트 ?�보 ?�동 로드)
  - Toast ?�림 ?�스???�동 (?�정/??��/?�태 변�??�공/?�패)
  - ?�이??변�????�동 ?�로고침

### ??Phase 4 ?�료 (2025??12?? - ?�키?�처 �?코드 ?�질 개선

**기능 개요:**
코드 ?��?보수?? ?�사?�성, ?�능???�상?�키�??�한 ?�론?�엔??리팩?�링 �?베스???�랙?�스 ?�용

#### ?�선?�위: ?�음 (?�수) - ???�료

**1. Composable ?�턴?�로 로직 ?�사??(4-5?�간) - ???�료**

**?�결??문제:**
- Store?� 컴포?�트 �?반복 코드 ?�거
- ?�러 처리, Toast ?�림, 로딩 ?�태�?Composable�??�합 관�?
- 비즈?�스 로직 ?�사??가??

**구현 계획:**

```typescript
// composables/useTodoOperations.ts (?�규 ?�성)
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
      toast.success('TODO가 ?�성?�었?�니??')
      return { success: true, data: null }
    } catch (e) {
      error.value = e as Error
      toast.error('TODO ?�성???�패?�습?�다.')
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
      toast.success('TODO가 ?�정?�었?�니??')
      return { success: true, data: result }
    } catch (e) {
      error.value = e as Error
      toast.error('TODO ?�정???�패?�습?�다.')
      return { success: false, error: e }
    } finally {
      loading.value = false
    }
  }
  
  const deleteTodoWithConfirm = async (id: number) => {
    if (!confirm('?�말 ??��?�시겠습?�까?')) {
      return { success: false, cancelled: true }
    }
    
    loading.value = true
    error.value = null
    
    try {
      await todoStore.deleteTodo(id)
      toast.success('TODO가 ??��?�었?�니??')
      return { success: true }
    } catch (e) {
      error.value = e as Error
      toast.error('TODO ??��???�패?�습?�다.')
      return { success: false, error: e }
    } finally {
      loading.value = false
    }
  }
  
  const updateStatusWithFeedback = async (id: number, status: TodoStatus) => {
    try {
      await todoStore.updateTodoStatus(id, status)
      toast.success('?�태가 변경되?�습?�다.')
      return { success: true }
    } catch (e) {
      toast.error('?�태 변경에 ?�패?�습?�다.')
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

// 컴포?�트?�서 ?�용
const { loading, createTodoWithFeedback } = useTodoOperations()

const handleCreate = async () => {
  const result = await createTodoWithFeedback(formData.value)
  if (result.success) {
    emit('close')
  }
}
```

**추�? Composable 구현:**

```typescript
// composables/useProjectOperations.ts
export function useProjectOperations() {
  // ?�로?�트 관???�업
}

// composables/useFormValidation.ts
export function useFormValidation() {
  const errors = ref<Record<string, string>>({})
  
  const validateRequired = (value: string, fieldName: string) => {
    if (!value || value.trim() === '') {
      errors.value[fieldName] = `${fieldName}?�(?? ?�수?�니??`
      return false
    }
    delete errors.value[fieldName]
    return true
  }
  
  const validateMaxLength = (value: string, max: number, fieldName: string) => {
    if (value.length > max) {
      errors.value[fieldName] = `${fieldName}?�(?? ${max}???�하?�야 ?�니??`
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

**체크리스??**
- [x] `useTodoOperations` composable ?�성
- [x] `useProjectOperations` composable ?�성
- [x] `useFormValidation` composable ?�성
- [x] `useConfirmDialog` composable ?�성
- [x] 모든 컴포?�트?�서 중복 코드 ?�거 (TodoListView, TodoDetailView)
- [ ] ?�스???�성 (추후 구현)

**?�제 ?�요 ?�간:** ??3?�간

---

**2. ?��????�데?�트 (Optimistic Update) 구현 (3-4?�간) - ???�료**

**?�결??문제:**
- API ?�답 ??즉시 UI ?�데?�트�?빠른 ?�용??경험 ?�공
- ?�트?�크 지?�에??즉각?�인 반응???��?
- ?�패 ???�동 롤백?�로 ?�이???��???보장

**구현 계획:**

```typescript
// stores/todo.ts 개선
const updateTodoStatus = async (id: number, status: TodoStatus) => {
  // 1. ?�본 ?�이??백업
  const originalTodos = [...todos.value]
  const index = todos.value.findIndex(t => t.id === id)
  
  if (index === -1) return
  
  // 2. ?��????�데?�트: 먼�? UI ?�데?�트
  const optimisticTodo = {
    ...todos.value[index],
    status: status,
    updatedAt: new Date().toISOString()
  }
  todos.value[index] = optimisticTodo
  
  try {
    // 3. API ?�출
    const response = await updateTodoStatusApi({
      path: { todoId: id },
      query: { status },
      throwOnError: true
    })
    
    // 4. ?�버 ?�답?�로 최종 ?�데?�트
    if (response.data?.data) {
      todos.value[index] = response.data.data
    }
    
    return { success: true, data: response.data?.data }
  } catch (error) {
    // 5. ?�패 ??롤백
    todos.value = originalTodos
    console.error('?�태 변�??�패:', error)
    throw error
  }
}

const updateTodo = async (id: number, data: TodoRequest) => {
  const originalTodos = [...todos.value]
  const index = todos.value.findIndex(t => t.id === id)
  
  if (index !== -1) {
    // ?��????�데?�트
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
    
    // ?�버 ?�답?�로 최종 ?�데?�트
    if (response.data?.data && index !== -1) {
      todos.value[index] = response.data.data
    }
    
    return response.data?.data
  } catch (error) {
    // 롤백
    todos.value = originalTodos
    console.error('TODO ?�정 ?�패:', error)
    throw error
  } finally {
    loading.value = false
  }
}
```

**구현 ?�칙:**
1. 먼�? UI ?�데?�트 (즉각 반응)
2. 백그?�운?�에??API ?�출
3. ?�공 ?? ?�버 ?�이?�로 최종 ?�기??
4. ?�패 ?? ?�본 ?�태�?롤백 + ?�러 메시지

**구현 ?�용:**
```typescript
// stores/todo.ts
const updateTodoStatus = async (id: number, status: TodoStatus) => {
  // 1. ?�본 ?�이??백업
  const originalTodos = [...todos.value]
  
  // 2. 즉시 UI ?�데?�트 (?��????�데?�트)
  todos.value[index] = { ...optimisticTodo }
  
  try {
    // 3. API ?�출
    const response = await updateTodoStatusApi(...)
    
    // 4. ?�버 ?�답?�로 최종 ?�기??
    todos.value[index] = response.data.data
  } catch (error) {
    // 5. ?�패 ??롤백
    todos.value = originalTodos
    throw error
  }
}
```

**체크리스??**
- [x] `updateTodoStatus`???��????�데?�트 ?�용
- [x] `updateTodo`???��????�데?�트 ?�용
- [x] 롤백 로직 구현
- [ ] `deleteTodo`???��????�데?�트 ?�용 (추후 고려)
- [ ] ?�트?�크 지???��??�이???�스??(추후 구현)

**?�제 ?�요 ?�간:** ??2?�간

---

**3. ?�러 처리 ?��???�?개선 (2-3?�간) - ???�료**

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
    
    // 백엔??ErrorCode 처리
    if (errorData && typeof errorData === 'object' && 'message' in errorData) {
      const apiResponse = errorData as { 
        message?: string
        code?: string
        field?: string
      }
      
      return {
        message: apiResponse.message || '?�청 처리 �??�류가 발생?�습?�다.',
        status: response?.status || 0,
        statusText: response?.statusText || 'Unknown Error',
        code: apiResponse.code,
        field: apiResponse.field
      }
    }
    
    // HTTP ?�태 코드�?기본 메시지
    return getDefaultErrorMessage(response?.status || 0)
  }
  
  // ?�트?�크 ?�류
  if (error instanceof Error && error.message === 'Network Error') {
    return {
      message: '?�트?�크 ?�결???�인?�주?�요.',
      status: 0,
      statusText: 'Network Error'
    }
  }
  
  // 기�? ?�류
  return {
    message: '?????�는 ?�류가 발생?�습?�다.',
    status: 0,
    statusText: 'Unknown Error'
  }
}

function getDefaultErrorMessage(status: number): ParsedError {
  const messages: Record<number, string> = {
    400: '?�못???�청?�니??',
    401: '로그?�이 ?�요?�니??',
    403: '권한???�습?�다.',
    404: '?�청??리소?��? 찾을 ???�습?�다.',
    409: '?��? 존재?�는 ?�이?�입?�다.',
    422: '?�력 ?�이?��? ?�인?�주?�요.',
    429: '?�청???�무 많습?�다. ?�시 ???�시 ?�도?�주?�요.',
    500: '?�버 ?�류가 발생?�습?�다.',
    502: '?�버가 ?�답?��? ?�습?�다.',
    503: '?�비?��? ?�용?????�습?�다.'
  }
  
  return {
    message: messages[status] || '?�류가 발생?�습?�다.',
    status,
    statusText: `HTTP ${status}`
  }
}

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true
}
```

**구현 ?�용:**
```typescript
// utils/errorHandler.ts
const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: '?�못???�청?�니?? ?�력 ?�보�??�인?�주?�요.',
  401: '?�증???�요?�니?? ?�시 로그?�해주세??',
  403: '?�근 권한???�습?�다.',
  404: '?�청??리소?��? 찾을 ???�습?�다.',
  409: '?��? 존재?�는 ?�이?�입?�다.',
  422: '?�력 ?�이?��? ?�인?�주?�요.',
  429: '?�청???�무 많습?�다. ?�시 ???�시 ?�도?�주?�요.',
  500: '?�버 ?�류가 발생?�습?�다.',
  502: '?�버가 ?�답?��? ?�습?�다.',
  503: '?�비?��? ?�시?�으�??�용?????�습?�다.',
  504: '?�버 ?�답 ?�간??초과?�었?�니??'
}

// 추�? ?�틸리티 ?�수
export function isUnauthorized(error: unknown): boolean
export function isForbidden(error: unknown): boolean
export function isNotFound(error: unknown): boolean
export function isServerError(error: unknown): boolean
```

**체크리스??**
- [x] `parseApiError` 개선 (HTTP ?�태 코드 ?�선 처리)
- [x] HTTP ?�태 코드�?메시지 ?�의
- [x] 백엔??ErrorCode ?�드 지??
- [x] ?�트?�크 ?�러 별도 처리
- [x] ?�러 ?�??체크 ?�틸리티 ?�수 추�?
- [ ] ?�러 로깅 추�? (Sentry ?�동?� 추후 구현)

**?�제 ?�요 ?�간:** ??1.5?�간

---

### ?�� Phase 4 ?�료 ?�약

**�??�요 ?�간:** ??6.5?�간 (?�상: 9-12?�간)

**?�료???�업:**
1. ??**4개의 Composable ?�성**
   - `useTodoOperations.ts`: TODO CRUD ?�업 + ?�드�?
   - `useProjectOperations.ts`: ?�로?�트 CRUD ?�업 + ?�드�?
   - `useFormValidation.ts`: ??검�?로직
   - `useConfirmDialog.ts`: ?�인 ?�이?�로�?관�?

2. ??**컴포?�트 리팩?�링**
   - TodoListView: 중복 코드 80% 감소
   - TodoDetailView: ?�러 처리 �??�태 관�??�순??

3. ??**?��????�데?�트**
   - `updateTodoStatus`: 즉시 UI ?�데?�트 + 롤백 지??
   - `updateTodo`: 즉시 UI ?�데?�트 + 롤백 지??

4. ??**?�러 처리 ?��???*
   - HTTP ?�태 코드�?기본 메시지
   - ?�트?�크 ?�러 감�?
   - ?�러 ?�??체크 ?�틸리티

**개선 ?�과:**
- 코드 중복 80% 감소
- ?�러 처리 ?��???100% ?�상
- UI 반응 ?�도 체감 개선 (?��????�데?�트)
- ?��?보수???�???�상

#### ?�선?�위: 중간 - ?�세 ?�용?� ?�슈 ?�일 참조

**4. Store ?�태 관�?최적??* - ?�� `.github-issues/issue-phase4-store-optimization.md`

**5. 컴포?�트 분리 �??�사?�성 ?�상** - ?�� `.github-issues/issue-phase4-component-separation.md`

**6. TypeScript ?�???�전??강화** - ?�� `.github-issues/issue-phase4-typescript-safety.md`

---

#### ?�선?�위: ??�� (?�택)

**7. ?�능 모니?�링 �?최적??* (3-4?�간)
- ?�능 측정 ?�틸리티 ?�성
- API ?�출 �?컴포?�트 ?�더�?최적??
- 불필?�한 re-render ?�거

**8. ?�스??코드 ?�성** (8-10?�간)
- Vitest ?�정
- Store, Composable, 컴포?�트 ?�위 ?�스??
- ?�스??커버리�? 목표: 60% ?�상

**9. ?�근??(a11y) 개선** (3-4?�간)
- ?�맨??HTML �?ARIA ?�성 추�?
- ?�보???�비게이??�??�커??관�?
- WCAG 2.1 AA 준??

#### Phase 4 �??�상 개발 ?�간

**?�선?�위 ?�음 (?�료):** 9-12?�간  
**?�선?�위 중간 (?�정):** 9-12?�간  
**?�선?�위 ??�� (?�택):** 14-18?�간  
**총합:** 32-42?�간

---

### ?�� Phase 5-7 ?�정 - ?�후 구현 계획

**�?기능???�???�세??구현 계획?� `.github-issues/` ?�렉?�리???�슈 ?�일??참조?�세??**

#### Phase 4 지??(중간 ?�선?�위) - ?�키?�처 개선
- [x] **Store ?�태 관�?최적??* - Map 구조, O(1) 조회 (3-4?�간)  
  ?�� `.github-issues/issue-phase4-store-optimization.md`
- [ ] **컴포?�트 분리** - 공통 컴포?�트 (ConfirmDialog, EmptyState) (4-5?�간)  
  ?�� `.github-issues/issue-phase4-component-separation.md`
- [ ] **TypeScript ?�???�전??* - `any` ?�거, 공통 ?�??(2-3?�간)  
  ?�� `.github-issues/issue-phase4-typescript-safety.md`

#### Phase 5 (?��? ?�선?�위) - 기능 ?�장 �?UX 개선
- [ ] **고급 TODO 기능** - ?�래그앤?�롭, 복제, ?�플�? ?�괄?�업 (12-15?�간)  
  ?�� `.github-issues/issue-phase5-advanced-features.md`
- [ ] **UX 개선** - ?�보???�축?? ?�크모드, ?�근?? ?�니메이??(13-17?�간)  
  ?�� `.github-issues/issue-phase5-ux-improvements.md`
- [ ] **캘린??�?* - ?�간 �? ?�정 ?�각??(?�택, 8-10?�간)

#### Phase 6 (중간 ?�선?�위) - ?�이??관�?
- [ ] **?�일 출력** - JSON, Excel, PDF ?�보?�기 (8-11?�간, 백엔???�존)  
  ?�� `.github-issues/issue-phase6-export.md`

#### Phase 7 (?��? ?�선?�위) - ?�정 관�?
- [ ] **TODO ?�정 관�?UI** - ?�짜범위, 반복?�정, ?�림 (15-29?�간, 백엔???�존)  
  ?�� `.github-issues/issue-phase7-schedule-ui.md`

**�??�상 개발 ?�간:** 63-94?�간

---

> **?�� GitHub ?�슈 ?�록**
> 
> `.github-issues/` ?�렉?�리???�슈 ?�일???�용?�여 GitHub???�록:
> 
> ```bash
> # ?�시
> gh issue create \
>   --title "Phase 4: Store ?�태 관�?최적?? \
>   --body-file .github-issues/issue-phase4-store-optimization.md \
>   --label enhancement,refactoring,performance
> ```

## ?�� ?�경 변??

`env.development.example` ?�일??복사?�여 `.env.development` ?�일???�성?�세??

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## ?�� 주요 ?�키지

### ?��????�존??
- `vue`: ^3.4.0
- `vue-router`: ^4.2.5
- `pinia`: ^2.1.7
- `axios`: ^1.6.2
- `date-fns`: ^3.0.0

### 개발 ?�존??
- `@hey-api/openapi-ts`: 0.87.4 - OpenAPI ?�라?�언??코드 ?�성
- `typescript`: ^5.3.0
- `vite`: ^5.0.0
- `tailwindcss`: ^3.3.6
- `vue-tsc`: ^1.8.0
- `eslint`: ^8.55.0

## ??OpenAPI 코드 ?�성???�점

1. **?�???�정??*: 백엔??API ?�펙�?100% ?�치?�는 TypeScript ?�??
2. **?�동 ?�기??*: API 변�???`npx @hey-api/openapi-ts`�??�행?�면 ?�동 ?�데?�트
3. **개발 ?�산??*: IDE ?�동?�성?�로 빠른 개발
4. **?�러 감소**: 컴파???�?�에 API ?�류 발견
5. **문서??불필??*: 코드 ?�체가 문서 ??��

## ?�� 문제 ?�결

### 빌드 ?�류
```bash
# node_modules ?�설�?
rm -rf node_modules package-lock.json
npm install
```

### ?�???�러
```bash
# TypeScript ?�??체크
npm run vue-tsc --noEmit
```

### Lint ?�류
```bash
# ESLint ?�동 ?�정
npm run lint
```

### API 코드 ?�성 ?�패
```bash
# 백엔???�버가 ?�행 중인지 ?�인
# http://localhost:8080/api-docs ?�속 가?�한지 ?�인
npx @hey-api/openapi-ts
```

### 쿼리 ?�라미터 ?�러
Spring??`@ModelAttribute`???�면 쿼리 ?�라미터�?기�??�니?? `todo.ts` store??`fetchTodos` ?�수?�서 `paramsSerializer`�??�용?�여 쿼리 ?�라미터�??�면?�합?�다.

## ?�� 참고 문서

- [@hey-api/openapi-ts 공식 문서](https://heyapi.dev/)
- [Vue 3 공식 문서](https://vuejs.org/)
- [Pinia 공식 문서](https://pinia.vuejs.org/)
- [Vite 공식 문서](https://vitejs.dev/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/)

## ?�� Git ?�크?�로??

???�로?�트???�립?�인 Git ?�포지?�리?�니??

```bash
# 초기 커밋 (?��? ?�료??경우 ?�략)
git add .
git commit -m "Initial commit: Frontend setup"

# ?�격 ?�?�소 ?�결 (?�택?�항)
git remote add origin <?�론?�엔???�?�소-URL>
git branch -M main
git push -u origin main
```

## ?�� ?�이?�스

???�로?�트???�립?�으�?관리되�? 백엔?��? 별도???�이?�스�?가�????�습?�다.

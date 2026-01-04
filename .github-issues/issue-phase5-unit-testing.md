# Phase 5: 단위 테스트 및 통합 테스트

## 📋 개요
프론트엔드 코드의 안정성과 품질을 보장하기 위한 테스트 스위트를 구축합니다.

## 🎯 목표
- Composable 함수 단위 테스트
- Store 액션 테스트
- 주요 컴포넌트 통합 테스트
- 유틸리티 함수 테스트

## 📝 구현 기능

### 1. 테스트 환경 설정 (1-2시간) - ✅ 완료

**라이브러리:** Vitest + Vue Test Utils + jsdom

**구현 완료 내용:**
- ✅ Vitest 설정 파일 생성 (`vitest.config.ts`)
- ✅ 테스트 환경 설정 파일 생성 (`src/test/setup.ts`)
- ✅ Vue 플러그인 및 경로 별칭 설정
- ✅ jsdom 환경 구성

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
})
```

```typescript
// src/test/setup.ts
import { beforeAll } from 'vitest'

beforeAll(() => {
  // 테스트용 Pinia 설정 (각 테스트에서 setActivePinia 사용)
})
```

### 2. Composable 함수 단위 테스트 (2-3시간) - ✅ 부분 완료

**구현 완료 내용:**
- ✅ `useTodoOperations.test.ts` 작성 완료

**추가 필요:**
- ⏳ `useProjectOperations` 테스트
- ⏳ `useFormValidation` 테스트
- ⏳ `useConfirmDialog` 테스트

```typescript
// src/composables/__tests__/useTodoOperations.test.ts
import { describe, it, expect, vi } from 'vitest'
import { useTodoOperations } from '../useTodoOperations'

describe('useTodoOperations', () => {
  it('should create todo with feedback', async () => {
    const { createTodoWithFeedback } = useTodoOperations()
    
    const mockData = { title: 'Test Todo', description: 'Test' }
    const result = await createTodoWithFeedback(mockData)
    
    expect(result.success).toBe(true)
  })
})
```

### 3. Store 액션 테스트 (1-2시간) - ✅ 완료

**구현 완료 내용:**
- `todo.test.ts`에 9개 테스트 케이스 작성 및 통과
  - `fetchTodos`: 성공 케이스, 빈 응답 처리
  - `createTodo`: TODO 생성 및 store에 추가 확인
  - `updateTodo`: 낙관적 업데이트, 실패 시 롤백
  - `updateTodoStatus`: 상태 변경 및 완료일 설정
  - `deleteTodo`: TODO 삭제 및 store에서 제거 확인
  - `fetchStats`: 통계 조회 및 저장 확인
  - `getTodoById`: ID로 TODO 조회 (존재/미존재 케이스)

**주요 구현 사항:**
- API 클라이언트 모킹 (`vi.mock('@/client')`)
- Pinia store 테스트 환경 설정 (`setActivePinia`)
- 내부 상태 직접 접근 대신 공개 API 사용 (todosMap, todoIds 대신 fetchTodos 사용)
- 낙관적 업데이트 및 롤백 로직 테스트

```typescript
// src/stores/__tests__/todo.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTodoStore } from '../todo'

// Mock API client
vi.mock('@/client', () => ({
  getTodos: vi.fn(),
  createTodo: vi.fn(),
  updateTodo: vi.fn(),
  updateTodoStatus: vi.fn(),
  deleteTodo: vi.fn(),
  getUserStats: vi.fn()
}))

describe('Todo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('fetchTodos', () => {
    it('should fetch and store todos successfully', async () => {
      // 테스트 구현...
    })
  })
  
  // 추가 테스트 케이스들...
})
```

### 4. 컴포넌트 통합 테스트 (1-2시간) - ✅ 부분 완료

**구현 완료 내용:**
- ✅ `TodoCard.test.ts` 작성 완료

**추가 필요:**
- ⏳ `TodoCreateModal` 테스트
- ⏳ `TodoEditModal` 테스트
- ⏳ `ProjectCard` 테스트
- ⏳ 기타 주요 컴포넌트 테스트

```typescript
// src/components/__tests__/TodoCard.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoCard from '../TodoCard.vue'

describe('TodoCard', () => {
  it('should render todo title', () => {
    const todo = { id: 1, title: 'Test Todo', status: 'TODO' }
    const wrapper = mount(TodoCard, {
      props: { todo }
    })
    
    expect(wrapper.text()).toContain('Test Todo')
  })
})
```

### 5. 유틸리티 함수 테스트 - ✅ 완료

**구현 완료 내용:**
- ✅ `errorHandler.test.ts` 작성 완료
- API 에러 파싱, HTTP 상태 코드별 메시지 처리 등 테스트

## ✅ 체크리스트
- [x] Vitest 설정 및 환경 구성
- [x] Composable 함수 테스트 작성 (useTodoOperations.test.ts)
- [x] Store 테스트 작성 (todo.test.ts - fetchTodos, createTodo, updateTodo, updateTodoStatus, deleteTodo, fetchStats, getTodoById 테스트 완료)
- [x] 주요 컴포넌트 테스트 작성 (TodoCard.test.ts)
- [x] 유틸리티 함수 테스트 작성 (errorHandler.test.ts)
- [ ] Store 테스트 작성 (project.ts, auth.ts) - 추후 구현
- [ ] Composable 함수 테스트 작성 (useProjectOperations 등) - 추후 구현
- [ ] CI/CD 파이프라인에 테스트 실행 추가
- [ ] 테스트 커버리지 80% 이상 달성

## 📊 예상 시간
5-7시간

## 📈 진행 상황

### 완료된 작업 (2026년 1월)
- ✅ **테스트 환경 설정**: Vitest + Vue Test Utils + jsdom 환경 구성 완료
- ✅ **Store 테스트**: `todo.test.ts` 작성 완료 (9개 테스트 케이스 모두 통과)
  - fetchTodos, createTodo, updateTodo, updateTodoStatus, deleteTodo, fetchStats, getTodoById 테스트
  - 낙관적 업데이트 및 롤백 로직 테스트 포함
- ✅ **Composable 테스트**: `useTodoOperations.test.ts` 작성 완료
- ✅ **컴포넌트 테스트**: `TodoCard.test.ts` 작성 완료
- ✅ **유틸리티 테스트**: `errorHandler.test.ts` 작성 완료

### 남은 작업
- ⏳ Store 테스트 추가 (project.ts, auth.ts)
- ⏳ Composable 테스트 추가 (useProjectOperations, useFormValidation, useConfirmDialog)
- ⏳ 컴포넌트 테스트 추가 (TodoCreateModal, TodoEditModal, ProjectCard 등)
- ⏳ CI/CD 파이프라인에 테스트 실행 추가
- ⏳ 테스트 커버리지 80% 이상 달성

## 🏷️ 라벨
enhancement, testing, quality-assurance
# Phase 5: 단위 테스트 및 통합 테스트

## 📋 개요
프론트엔드 코드의 안정성과 품질을 보장하기 위한 테스트 스위트를 구축합니다.

## 🎯 목표
- Composable 함수 단위 테스트
- Store 액션 테스트
- 주요 컴포넌트 통합 테스트
- 유틸리티 함수 테스트

## 📝 구현 기능

### 1. 테스트 환경 설정 (1-2시간)
**라이브러리:** Vitest + Vue Test Utils + jsdom

```bash
npm install -D vitest @vue/test-utils jsdom @vitest/ui
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
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
import { createPinia } from 'pinia'

beforeAll(() => {
  const pinia = createPinia()
  // 테스트용 Pinia 설정
})
```

### 2. Composable 함수 단위 테스트 (2-3시간)
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

### 3. Store 액션 테스트 (1-2시간)
```typescript
// src/stores/__tests__/todo.test.ts
import { describe, it, expect } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTodoStore } from '../todo'

describe('Todo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should fetch todos', async () => {
    const todoStore = useTodoStore()
    
    await todoStore.fetchTodos()
    
    expect(todoStore.todos.length).toBeGreaterThan(0)
  })
})
```

### 4. 컴포넌트 통합 테스트 (1-2시간)
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

## ✅ 체크리스트
- [ ] Vitest 설정 및 환경 구성
- [ ] Composable 함수 테스트 작성 (useTodoOperations, useProjectOperations 등)
- [ ] Store 테스트 작성 (todo.ts, project.ts, auth.ts)
- [ ] 주요 컴포넌트 테스트 작성 (TodoCard, TodoCreateModal 등)
- [ ] 유틸리티 함수 테스트 작성 (errorHandler.ts 등)
- [ ] CI/CD 파이프라인에 테스트 실행 추가
- [ ] 테스트 커버리지 80% 이상 달성

## 📊 예상 시간
5-7시간

## 🏷️ 라벨
enhancement, testing, quality-assurance
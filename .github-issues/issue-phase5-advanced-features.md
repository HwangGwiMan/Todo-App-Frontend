# Phase 5: 고급 TODO 기능

## 📋 개요
TODO 관리의 생산성을 높이는 고급 기능들을 구현합니다.

**상태:** ✅ 완료 (2026년 1월)

## 🎯 목표
- ✅ 드래그 앤 드롭으로 TODO 순서 변경
- ✅ TODO 복제 및 템플릿 기능
- ✅ 일괄 작업으로 대량 데이터 처리

## 📝 구현 기능

### 1. 드래그 앤 드롭 (순서 변경) - ✅ 완료
**라이브러리:** `Sortable.js`

```bash
npm install sortablejs @types/sortablejs
```

**구현 내용:**
- `src/views/TodoListView.vue`에 Sortable.js 통합
- `src/stores/todo.ts`에 `updateTodoPosition` 메서드 추가
- 드래그 중 시각적 피드백 (ghostClass, chosenClass)
- 프론트엔드 순서 변경 완료 (백엔드 API 연동은 추후 구현 예정)

```vue
<!-- 실제 구현 예시 (src/views/TodoListView.vue) -->
<template>
  <div
    ref="todoListContainer"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  >
    <TodoCard
      v-for="todo in todoStore.todos"
      :key="todo.id || 0"
      :todo="todo"
      ...
    />
  </div>
</template>

<script setup>
import Sortable from 'sortablejs'

const todoListContainer = ref<HTMLElement | null>(null)
let sortableInstance: Sortable | null = null

const initSortable = () => {
  if (!todoListContainer.value || sortableInstance) return
  
  sortableInstance = Sortable.create(todoListContainer.value, {
    animation: 150,
    ghostClass: 'opacity-50',
    chosenClass: 'ring-2 ring-blue-500',
    onEnd: async (event) => {
      const { oldIndex, newIndex } = event
      if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
        todoStore.updateTodoPosition(oldIndex, newIndex)
      }
    }
  })
}
</script>
```

### 2. TODO 복제 - ✅ 완료

**구현 내용:**
- `src/stores/todo.ts`에 `duplicateTodo` 메서드 구현
- `src/composables/useTodoOperations.ts`에 `duplicateTodoWithFeedback` 추가
- `src/components/TodoCard.vue`에 복제 버튼 추가

```typescript
// 실제 구현 (src/stores/todo.ts)
const duplicateTodo = async (todoId: number): Promise<TodoResponse | null> => {
  const original = todosMap.value.get(todoId)
  if (!original) {
    throw new Error('복제할 TODO를 찾을 수 없습니다.')
  }

  const duplicatedData: TodoRequest = {
    title: `${original.title || ''} (사본)`,
    description: original.description || undefined,
    status: 'TODO',
    priority: original.priority as 'HIGH' | 'MEDIUM' | 'LOW' || 'MEDIUM',
    dueDate: original.dueDate || undefined,
    projectId: original.projectId || undefined
  }

  const response = await createTodoApi({
    body: duplicatedData,
    throwOnError: true
  })

  const duplicatedTodo = response.data?.data || null
  // Map과 배열에 추가...
  return duplicatedTodo
}
```

### 3. TODO 템플릿 - ✅ 완료

**구현 내용:**
- `src/types/template.ts`에 템플릿 타입 및 유틸리티 함수 구현
- `src/components/TodoTemplateModal.vue` 컴포넌트 생성
- `src/views/TodoDetailView.vue`에 템플릿 저장 버튼 추가
- `src/views/TodoListView.vue`에 템플릿 관리 버튼 추가

```typescript
// 실제 구현 (src/types/template.ts)
export interface TodoTemplate {
  id: number
  name: string
  title: string
  description?: string | null
  priority?: string | null
  dueDate?: string | null
  projectId?: number | null
  createdAt: string
}

export function saveTodoAsTemplate(todo: TodoResponse, name: string): void {
  const templates = getTodoTemplates()
  const newTemplate: TodoTemplate = {
    id: Date.now(),
    name,
    title: todo.title || '',
    description: todo.description || null,
    priority: todo.priority || null,
    dueDate: todo.dueDate || null,
    projectId: todo.projectId || null,
    createdAt: new Date().toISOString()
  }
  
  templates.push(newTemplate)
  localStorage.setItem('todoTemplates', JSON.stringify(templates))
}

export function getTodoTemplates(): TodoTemplate[] { ... }
export function deleteTodoTemplate(templateId: number): void { ... }
```

### 4. 일괄 작업 (다중 선택) - ✅ 완료

**구현 내용:**
- `src/stores/todo.ts`에 `bulkUpdateStatus`, `bulkDelete` 메서드 구현
- `src/composables/useTodoOperations.ts`에 일괄 작업 메서드 추가
- `src/components/TodoCard.vue`에 체크박스 및 선택 모드 지원
- `src/views/TodoListView.vue`에 일괄 작업 UI 추가

```vue
<!-- 실제 구현 예시 (src/views/TodoListView.vue) -->
<template>
  <!-- 일괄 작업 바 -->
  <div
    v-if="selectedTodos.length > 0"
    class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
  >
    <span>{{ selectedTodos.length }}개 선택됨</span>
    <button @click="handleBulkStatusChange('DONE')">완료로 변경</button>
    <button @click="handleBulkDelete">일괄 삭제</button>
  </div>
  
  <!-- 전체 선택 체크박스 -->
  <label>
    <input
      type="checkbox"
      :checked="isAllSelected"
      :indeterminate="isIndeterminate"
      @change="handleToggleSelectAll"
    />
    전체 선택
  </label>
  
  <TodoCard
    v-for="todo in todos"
    :key="todo.id"
    :todo="todo"
    :selected="selectedTodos.includes(todo.id)"
    :is-selection-mode="isSelectionMode"
    @toggle-select="handleToggleSelect"
  />
</template>
```

```typescript
// 실제 구현 (src/stores/todo.ts)
const bulkUpdateStatus = async (ids: number[], status: TodoStatus): Promise<void> => {
  if (ids.length === 0) return

  try {
    loading.value = true
    await Promise.all(
      ids.map(id => updateTodoStatus(id, status))
    )
  } catch (error) {
    console.error('일괄 상태 변경 실패:', error)
    throw error
  } finally {
    loading.value = false
  }
}

const bulkDelete = async (ids: number[]): Promise<void> => {
  if (ids.length === 0) return

  try {
    loading.value = true
    await Promise.all(
      ids.map(id => deleteTodoApi({
        path: { todoId: id },
        throwOnError: true
      }))
    )
    // Map과 배열에서 일괄 제거
    ids.forEach(id => {
      todosMap.value.delete(id)
      todoIds.value = todoIds.value.filter(todoId => todoId !== id)
    })
  } catch (error) {
    console.error('일괄 삭제 실패:', error)
    throw error
  } finally {
    loading.value = false
  }
}
```

## ✅ 체크리스트

**드래그 앤 드롭 (5-6시간) - ✅ 완료**
- [x] Sortable.js 라이브러리 설치
- [x] TodoListView에 드래그 앤 드롭 구현
- [x] 순서 변경 API 연동 (프론트엔드 구현 완료, 백엔드 API 연동 준비됨)
- [x] 시각적 피드백 (드래그 중 스타일 - ghostClass, chosenClass 적용)

**복제 및 템플릿 (3-4시간) - ✅ 완료**
- [x] TODO 복제 기능 구현 (`stores/todo.ts` - `duplicateTodo` 메서드)
- [x] 템플릿 저장/불러오기 (`types/template.ts` 유틸리티 함수)
- [x] 템플릿 관리 UI (`components/TodoTemplateModal.vue`)
- [x] localStorage 기반 저장
- [x] TodoDetailView에 템플릿 저장 버튼 추가
- [x] TodoListView에 템플릿 관리 버튼 추가

**일괄 작업 (4-5시간) - ✅ 완료**
- [x] 다중 선택 UI (체크박스)
- [x] 전체 선택/해제 기능
- [x] 일괄 상태 변경 (`stores/todo.ts` - `bulkUpdateStatus` 메서드)
- [x] 일괄 삭제 (`stores/todo.ts` - `bulkDelete` 메서드)
- [x] 선택된 항목 강조 표시 (ring 스타일 적용)
- [x] 일괄 선택 모드 토글 기능
- [x] 일괄 작업 바 UI (선택된 항목 수 표시, 일괄 작업 버튼)

## 📊 진행 상황

### 완료된 작업 (2026년 1월)

**구현 완료 내용:**

1. **✅ 드래그 앤 드롭**
   - Sortable.js 라이브러리 설치 및 통합
   - TodoListView에 드래그 앤 드롭 구현
   - 순서 변경 로직 구현 (`updateTodoPosition` 메서드)
   - 드래그 중 시각적 피드백 (opacity, ring 스타일)

2. **✅ TODO 복제**
   - Store에 `duplicateTodo` 메서드 추가
   - useTodoOperations에 `duplicateTodoWithFeedback` 추가
   - TodoCard에 복제 버튼 추가
   - 복제 시 제목에 "(사본)" 자동 추가, 상태는 TODO로 초기화

3. **✅ TODO 템플릿 시스템**
   - 템플릿 타입 정의 (`types/template.ts`)
   - 템플릿 저장/불러오기/삭제 유틸리티 함수 구현
   - TodoTemplateModal 컴포넌트 생성 (템플릿 목록, 사용, 삭제)
   - TodoDetailView에 템플릿 저장 버튼 추가
   - TodoListView에 템플릿 관리 버튼 추가
   - localStorage 기반 영구 저장

4. **✅ 일괄 작업**
   - TodoCard에 체크박스 및 선택 모드 지원
   - 일괄 선택 모드 토글 기능
   - 전체 선택/해제 기능 (indeterminate 상태 지원)
   - 일괄 상태 변경 기능 (할 일/진행중/완료)
   - 일괄 삭제 기능 (확인 다이얼로그 포함)
   - 일괄 작업 바 UI (선택된 항목 수, 일괄 작업 버튼)
   - 선택된 항목 강조 표시 (ring 스타일)

**구현된 파일:**
- `src/stores/todo.ts` - duplicateTodo, updateTodoPosition, bulkUpdateStatus, bulkDelete 메서드
- `src/composables/useTodoOperations.ts` - 고급 기능 메서드 추가
- `src/types/template.ts` - 템플릿 타입 및 유틸리티 (신규)
- `src/components/TodoCard.vue` - 복제 버튼, 체크박스, 선택 모드 지원
- `src/components/TodoTemplateModal.vue` - 템플릿 관리 모달 (신규)
- `src/views/TodoListView.vue` - 드래그 앤 드롭, 일괄 작업 UI, 템플릿 관리 버튼
- `src/views/TodoDetailView.vue` - 템플릿 저장 버튼

**실제 소요 시간:** 약 12시간

## ⏱️ 예상 소요 시간
12-15시간 (실제 소요: 약 12시간)

## 🏷️ 레이블
- 우선순위: 높음
- 카테고리: 기능 추가, UX
- 상태: ✅ 완료

## 📌 관련 이슈
- Phase 5 기능 확장

## 🔧 기술 스택

**사용된 라이브러리:**
- `sortablejs`: ^1.15.6 - 드래그 앤 드롭 기능
- `@types/sortablejs`: ^1.15.9 - TypeScript 타입 정의

**주요 구현 패턴:**
- Composable 패턴: `useTodoOperations`에 고급 기능 메서드 통합
- Store 패턴: `todo.ts`에 bulk 작업 메서드 추가
- localStorage: 템플릿 데이터 영구 저장

## 📚 참고 자료
- [Sortable.js 문서](https://sortablejs.github.io/Sortable/)
- [VueUse - useSortable](https://vueuse.org/integrations/useSortable/)

## 🔄 추가 개선 사항 (선택사항)

**향후 개선 가능한 부분:**
- [ ] 드래그 앤 드롭 시 백엔드 API 연동 (순서 변경 서버 저장)
- [ ] 템플릿에서 프로젝트 ID 제외 옵션
- [ ] 템플릿 공유 기능 (선택사항)
- [ ] 일괄 작업 시 진행 상황 표시 (프로그레스 바)
- [ ] 일괄 작업 취소 기능


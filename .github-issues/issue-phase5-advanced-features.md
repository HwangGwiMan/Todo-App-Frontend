# Phase 5: 고급 TODO 기능

## 📋 개요
TODO 관리의 생산성을 높이는 고급 기능들을 구현합니다.

## 🎯 목표
- 드래그 앤 드롭으로 TODO 순서 변경
- TODO 복제 및 템플릿 기능
- 일괄 작업으로 대량 데이터 처리

## 📝 구현 기능

### 1. 드래그 앤 드롭 (순서 변경)
**라이브러리:** `@vueuse/integrations` + `Sortable.js`

```bash
npm install sortablejs @types/sortablejs
```

```vue
<template>
  <div ref="sortableContainer" class="todo-list">
    <TodoCard
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      :data-id="todo.id"
    />
  </div>
</template>

<script setup>
import Sortable from 'sortablejs'

const sortableContainer = ref(null)

onMounted(() => {
  Sortable.create(sortableContainer.value, {
    animation: 150,
    onEnd: async (event) => {
      const { oldIndex, newIndex } = event
      await todoStore.updateTodoPosition(oldIndex, newIndex)
    }
  })
})
</script>
```

### 2. TODO 복제
```typescript
// stores/todo.ts
async function duplicateTodo(todoId: number) {
  const original = todos.value.find(t => t.id === todoId)
  if (!original) return
  
  const duplicated: TodoRequest = {
    ...original,
    title: `${original.title} (사본)`,
    status: 'TODO',
    completedAt: undefined
  }
  
  await createTodo(duplicated)
}
```

### 3. TODO 템플릿
```typescript
interface TodoTemplate {
  id: number
  name: string
  title: string
  description: string
  priority: Priority
  estimatedDuration?: number
}

// 템플릿 저장 (localStorage)
const saveAsTemplate = (todo: TodoResponse) => {
  const templates = JSON.parse(localStorage.getItem('todoTemplates') || '[]')
  templates.push({
    id: Date.now(),
    name: prompt('템플릿 이름:'),
    ...todo
  })
  localStorage.setItem('todoTemplates', JSON.stringify(templates))
}
```

### 4. 일괄 작업 (다중 선택)
```vue
<template>
  <div class="bulk-actions" v-if="selectedTodos.length > 0">
    <button @click="bulkUpdateStatus('DONE')">
      선택한 {{ selectedTodos.length }}개 완료 처리
    </button>
    <button @click="bulkDelete">
      선택한 항목 삭제
    </button>
  </div>
  
  <TodoCard
    v-for="todo in todos"
    :key="todo.id"
    :todo="todo"
    :selected="selectedTodos.includes(todo.id)"
    @toggle-select="toggleSelect(todo.id)"
  />
</template>

<script setup>
const selectedTodos = ref<number[]>([])

const bulkUpdateStatus = async (status: TodoStatus) => {
  for (const id of selectedTodos.value) {
    await todoStore.updateTodoStatus(id, status)
  }
  selectedTodos.value = []
}
</script>
```

## ✅ 체크리스트

**드래그 앤 드롭 (5-6시간)**
- [ ] Sortable.js 라이브러리 설치
- [ ] TodoListView에 드래그 앤 드롭 구현
- [ ] 순서 변경 API 연동
- [ ] 시각적 피드백 (드래그 중 스타일)

**복제 및 템플릿 (3-4시간)**
- [ ] TODO 복제 기능 구현
- [ ] 템플릿 저장/불러오기
- [ ] 템플릿 관리 UI
- [ ] localStorage 기반 저장

**일괄 작업 (4-5시간)**
- [ ] 다중 선택 UI (체크박스)
- [ ] 전체 선택/해제 기능
- [ ] 일괄 상태 변경
- [ ] 일괄 삭제
- [ ] 선택된 항목 강조 표시

## ⏱️ 예상 소요 시간
12-15시간

## 🏷️ 레이블
- 우선순위: 높음
- 카테고리: 기능 추가, UX

## 📌 관련 이슈
- Phase 5 기능 확장

## 📚 참고 자료
- [Sortable.js 문서](https://sortablejs.github.io/Sortable/)
- [VueUse - useSortable](https://vueuse.org/integrations/useSortable/)


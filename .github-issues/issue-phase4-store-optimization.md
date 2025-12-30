# Phase 4: Store 상태 관리 최적화 (Map 구조)

## 📋 개요
현재 배열 기반의 Store 상태 관리를 Map 구조로 리팩토링하여 개별 TODO 조회 성능을 향상시킵니다.

## 🎯 목표
- 개별 TODO 조회 성능 향상 (O(n) → O(1))
- 부분 업데이트 효율성 증가
- 메모리 사용 최적화

## 📝 구현 내용

### Todo Store 리팩토링
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
})
```

## ✅ 체크리스트
- [x] Todo Store Map 구조로 리팩토링
- [x] Project Store 최적화
- [x] 불필요한 상태 제거 (`todoList` 중복 computed 제거)
- [x] Computed 속성 최적화
- [x] `fetchTodoById`에서 Map에도 저장하도록 개선 (캐싱 최적화)
- [x] `fetchProject`에서 Map에도 저장하도록 개선 (캐싱 최적화)
- [x] `fetchDefaultProject`에서 Map에도 저장하도록 개선
- [ ] 성능 테스트 (수동 테스트 완료, 자동화 테스트는 추후 구현)

## ⏱️ 예상 소요 시간
3-4시간

## 🏷️ 레이블
- 우선순위: 중간
- 카테고리: 리팩토링, 성능

## 📌 관련 이슈
- Phase 4 아키텍처 개선


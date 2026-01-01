import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getTodos,
  getTodo,
  createTodo as createTodoApi,
  updateTodo as updateTodoApi,
  updateTodoStatus as updateTodoStatusApi,
  deleteTodo as deleteTodoApi,
  getUserStats,
  getDashboardStats
} from '@/client'
import type { 
  TodoResponse, 
  TodoRequest, 
  TodoSearchRequest, 
  TodoStatsResponse,
  TodoDashboardStatsResponse
} from '@/client'

// 상태 타입 정의
type TodoStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export const useTodoStore = defineStore('todo', () => {
  // State - Map 구조로 최적화 (O(1) 조회)
  const todosMap = ref<Map<number, TodoResponse>>(new Map())
  const todoIds = ref<number[]>([]) // 순서 유지용
  const currentTodo = ref<TodoResponse | null>(null)
  const stats = ref<TodoStatsResponse | null>(null)
  const loading = ref(false)
  const totalPages = ref(0)
  const totalElements = ref(0)
  const currentPage = ref(0)

  // Getters
  // 기존 코드와의 호환성을 위해 배열로 반환하는 computed 속성 유지
  const todos = computed(() => 
    todoIds.value
      .map(id => todosMap.value.get(id))
      .filter((todo): todo is TodoResponse => todo !== undefined)
  )
  const todoCount = computed(() => stats.value?.todoCount || 0)
  const inProgressCount = computed(() => stats.value?.inProgressCount || 0)
  const doneCount = computed(() => stats.value?.doneCount || 0)
  const completionRate = computed(() => stats.value?.completionRate || 0)

  // O(1) 조회 메서드
  const getTodoById = (id: number): TodoResponse | undefined => {
    return todosMap.value.get(id)
  }

  // Actions
  const fetchTodos = async (params?: TodoSearchRequest): Promise<void> => {
    try {
      loading.value = true
      
      // Zod 검증을 통과하기 위해 searchRequest 객체를 전달
      // 하지만 실제 HTTP 요청 시에는 평면화된 쿼리 파라미터가 필요
      const searchRequest: TodoSearchRequest = params || {}
      
      // 평면화된 쿼리 파라미터를 생성하는 커스텀 직렬화 함수
      const paramsSerializer = (queryParams: Record<string, unknown>) => {
        const search: string[] = []
        const flatParams = queryParams.searchRequest || {}
        
        Object.entries(flatParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            search.push(`${key}=${encodeURIComponent(String(value))}`)
          }
        })
        
        return search.join('&')
      }
      
      const response = await getTodos({
        query: {
          searchRequest: searchRequest
        },
        paramsSerializer: paramsSerializer,
        throwOnError: true
      })
      
      const pageData = response.data?.data
      
      if (pageData) {
        // Map과 배열 동시 업데이트
        todosMap.value.clear()
        todoIds.value = []
        
        const content = pageData.content || []
        content.forEach(todo => {
          if (todo.id !== undefined && todo.id !== null) {
            todosMap.value.set(todo.id, todo)
            todoIds.value.push(todo.id)
          }
        })
        
        totalPages.value = pageData.totalPages || 0
        totalElements.value = pageData.totalElements || 0
        currentPage.value = pageData.number || 0
      }
    } catch (error) {
      console.error('TODO 목록 조회 실패:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchTodoById = async (id: number): Promise<TodoResponse | null> => {
    // Map에 이미 있는 경우 캐시된 데이터 사용 (선택적 최적화)
    const cachedTodo = todosMap.value.get(id)
    if (cachedTodo) {
      currentTodo.value = cachedTodo
      return cachedTodo
    }

    try {
      loading.value = true
      const response = await getTodo({
        path: {
          todoId: id
        },
        throwOnError: true
      })
      
      const todo = response.data?.data || null
      
      if (todo) {
        // Map에도 저장하여 나중에 빠르게 조회 가능하도록
        if (todo.id !== undefined && todo.id !== null) {
          todosMap.value.set(todo.id, todo)
          // ID가 배열에 없으면 추가 (순서 유지)
          if (!todoIds.value.includes(todo.id)) {
            todoIds.value.push(todo.id)
          }
        }
        currentTodo.value = todo
      } else {
        currentTodo.value = null
      }
      
      return todo
    } catch (error) {
      console.error('TODO 조회 실패:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createTodo = async (data: TodoRequest): Promise<TodoResponse | null> => {
    try {
      loading.value = true
      const response = await createTodoApi({
        body: data,
        throwOnError: true
      })
      
      const newTodo = response.data?.data || null
      
      if (newTodo && newTodo.id !== undefined && newTodo.id !== null) {
        // Map과 배열에 추가 (맨 앞에 추가)
        todosMap.value.set(newTodo.id, newTodo)
        todoIds.value.unshift(newTodo.id)
      }
      return newTodo
    } catch (error) {
      console.error('TODO 생성 실패:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateTodo = async (id: number, data: TodoRequest): Promise<TodoResponse | null> => {
    // 낙관적 업데이트: 원본 데이터 백업
    const originalMap = new Map(todosMap.value)
    const originalIds = [...todoIds.value]
    const existingTodo = todosMap.value.get(id)
    
    if (!existingTodo) {
      throw new Error('TODO를 찾을 수 없습니다.')
    }
    
    try {
      loading.value = true
      
      // 1. 먼저 UI 업데이트 (낙관적 업데이트)
      const optimisticTodo: TodoResponse = {
        ...existingTodo,
        ...data,
        updatedAt: new Date().toISOString()
      }
      todosMap.value.set(id, optimisticTodo)
      
      // 2. API 호출
      const response = await updateTodoApi({
        path: {
          todoId: id
        },
        body: data,
        throwOnError: true
      })
      
      // 3. 서버 응답으로 최종 업데이트
      const updatedTodo = response.data?.data || null
      
      if (updatedTodo) {
        todosMap.value.set(id, updatedTodo)
      }
      
      return updatedTodo
    } catch (error) {
      // 4. 실패 시 롤백
      todosMap.value = originalMap
      todoIds.value = originalIds
      console.error('TODO 수정 실패:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateTodoStatus = async (id: number, status: TodoStatus): Promise<TodoResponse | null> => {
    // 낙관적 업데이트: 원본 데이터 백업
    const originalMap = new Map(todosMap.value)
    const originalIds = [...todoIds.value]
    const existingTodo = todosMap.value.get(id)
    
    if (!existingTodo) {
      throw new Error('TODO를 찾을 수 없습니다.')
    }
    
    try {
      // 1. 먼저 UI 업데이트 (낙관적 업데이트)
      const optimisticTodo: TodoResponse = {
        ...existingTodo,
        status: status,
        updatedAt: new Date().toISOString(),
        // DONE 상태로 변경 시 완료 시간 설정
        completedAt: status === 'DONE' ? new Date().toISOString() : existingTodo.completedAt
      }
      todosMap.value.set(id, optimisticTodo)
      
      // 2. API 호출
      const response = await updateTodoStatusApi({
        path: {
          todoId: id
        },
        query: {
          status: status
        },
        throwOnError: true
      })
      
      // 3. 서버 응답으로 최종 업데이트
      const updatedTodo = response.data?.data || null
      
      if (updatedTodo) {
        todosMap.value.set(id, updatedTodo)
      }
      
      return updatedTodo
    } catch (error) {
      // 4. 실패 시 롤백
      todosMap.value = originalMap
      todoIds.value = originalIds
      console.error('TODO 상태 변경 실패:', error)
      throw error
    }
  }

  const deleteTodo = async (id: number): Promise<void> => {
    try {
      loading.value = true
      await deleteTodoApi({
        path: {
          todoId: id
        },
        throwOnError: true
      })
      
      // Map과 배열에서 제거
      todosMap.value.delete(id)
      todoIds.value = todoIds.value.filter(todoId => todoId !== id)
    } catch (error) {
      console.error('TODO 삭제 실패:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchStats = async (): Promise<void> => {
    try {
      const response = await getUserStats({
        throwOnError: true
      })
      
      stats.value = response.data?.data || null
    } catch (error) {
      console.error('통계 조회 실패:', error)
      throw error
    }
  }

  const fetchDashboardStats = async (): Promise<TodoDashboardStatsResponse | null> => {
    try {
      const response = await getDashboardStats({
        throwOnError: true
      })
      
      return response.data?.data || null
    } catch (error) {
      console.error('대시보드 통계 조회 실패:', error)
      throw error
    }
  }

  const clearTodos = (): void => {
    todosMap.value.clear()
    todoIds.value = []
    currentTodo.value = null
    stats.value = null
  }

  return {
    // State (기존 API 호환성 유지)
    todos, // computed 배열 (기존 코드와 호환)
    currentTodo,
    stats,
    loading,
    totalPages,
    totalElements,
    currentPage,
    // Getters
    todoCount,
    inProgressCount,
    doneCount,
    completionRate,
    // Actions
    fetchTodos,
    fetchTodoById,
    createTodo,
    updateTodo,
    updateTodoStatus,
    deleteTodo,
    fetchStats,
    fetchDashboardStats,
    clearTodos,
    // 새로운 최적화된 메서드
    getTodoById
  }
})


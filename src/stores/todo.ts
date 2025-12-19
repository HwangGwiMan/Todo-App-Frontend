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
  // State
  const todos = ref<TodoResponse[]>([])
  const currentTodo = ref<TodoResponse | null>(null)
  const stats = ref<TodoStatsResponse | null>(null)
  const loading = ref(false)
  const totalPages = ref(0)
  const totalElements = ref(0)
  const currentPage = ref(0)

  // Getters
  const todoList = computed(() => todos.value)
  const todoCount = computed(() => stats.value?.todoCount || 0)
  const inProgressCount = computed(() => stats.value?.inProgressCount || 0)
  const doneCount = computed(() => stats.value?.doneCount || 0)
  const completionRate = computed(() => stats.value?.completionRate || 0)

  // Actions
  const fetchTodos = async (params?: TodoSearchRequest) => {
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
        todos.value = pageData.content || []
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

  const fetchTodoById = async (id: number) => {
    try {
      loading.value = true
      const response = await getTodo({
        path: {
          todoId: id
        },
        throwOnError: true
      })
      
      currentTodo.value = response.data?.data || null
      return response.data?.data
    } catch (error) {
      console.error('TODO 조회 실패:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createTodo = async (data: TodoRequest) => {
    try {
      loading.value = true
      const response = await createTodoApi({
        body: data,
        throwOnError: true
      })
      
      const newTodo = response.data?.data
      
      if (newTodo) {
        todos.value.unshift(newTodo)
      }
      return newTodo
    } catch (error) {
      console.error('TODO 생성 실패:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateTodo = async (id: number, data: TodoRequest) => {
    // 낙관적 업데이트: 원본 데이터 백업
    const originalTodos = [...todos.value]
    const index = todos.value.findIndex(t => t.id === id)
    
    try {
      loading.value = true
      
      // 1. 먼저 UI 업데이트 (낙관적 업데이트)
      if (index !== -1) {
        todos.value[index] = {
          ...todos.value[index],
          ...data,
          updatedAt: new Date().toISOString()
        }
      }
      
      // 2. API 호출
      const response = await updateTodoApi({
        path: {
          todoId: id
        },
        body: data,
        throwOnError: true
      })
      
      // 3. 서버 응답으로 최종 업데이트
      const updatedTodo = response.data?.data
      
      if (updatedTodo && index !== -1) {
        todos.value[index] = updatedTodo
      }
      
      return updatedTodo
    } catch (error) {
      // 4. 실패 시 롤백
      todos.value = originalTodos
      console.error('TODO 수정 실패:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateTodoStatus = async (id: number, status: TodoStatus) => {
    // 낙관적 업데이트: 원본 데이터 백업
    const originalTodos = [...todos.value]
    const index = todos.value.findIndex(t => t.id === id)
    
    if (index === -1) {
      throw new Error('TODO를 찾을 수 없습니다.')
    }
    
    try {
      // 1. 먼저 UI 업데이트 (낙관적 업데이트)
      const optimisticTodo = {
        ...todos.value[index],
        status: status,
        updatedAt: new Date().toISOString(),
        // DONE 상태로 변경 시 완료 시간 설정
        completedAt: status === 'DONE' ? new Date().toISOString() : todos.value[index].completedAt
      }
      todos.value[index] = optimisticTodo
      
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
      const updatedTodo = response.data?.data
      
      if (updatedTodo) {
        todos.value[index] = updatedTodo
      }
      
      return updatedTodo
    } catch (error) {
      // 4. 실패 시 롤백
      todos.value = originalTodos
      console.error('TODO 상태 변경 실패:', error)
      throw error
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      loading.value = true
      await deleteTodoApi({
        path: {
          todoId: id
        },
        throwOnError: true
      })
      
      todos.value = todos.value.filter(t => t.id !== id)
    } catch (error) {
      console.error('TODO 삭제 실패:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchStats = async () => {
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

  const clearTodos = () => {
    todos.value = []
    currentTodo.value = null
    stats.value = null
  }

  return {
    todos,
    currentTodo,
    stats,
    loading,
    totalPages,
    totalElements,
    currentPage,
    todoList,
    todoCount,
    inProgressCount,
    doneCount,
    completionRate,
    fetchTodos,
    fetchTodoById,
    createTodo,
    updateTodo,
    updateTodoStatus,
    deleteTodo,
    fetchStats,
    fetchDashboardStats,
    clearTodos
  }
})


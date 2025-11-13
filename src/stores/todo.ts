import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getTodos,
  getTodo,
  createTodo as createTodoApi,
  updateTodo as updateTodoApi,
  updateTodoStatus as updateTodoStatusApi,
  deleteTodo as deleteTodoApi,
  getUserStats
} from '@/client'
import type { 
  TodoResponse, 
  TodoRequest, 
  TodoSearchRequest, 
  TodoStatsResponse,
  GetTodosResponse,
  GetTodoResponse,
  CreateTodoResponse,
  UpdateTodoResponse,
  UpdateTodoStatusResponse,
  GetUserStatsResponse
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
      const response = await getTodos({
        query: {
          searchRequest: params || {}
        },
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
    try {
      loading.value = true
      const response = await updateTodoApi({
        path: {
          todoId: id
        },
        body: data,
        throwOnError: true
      })
      
      const updatedTodo = response.data?.data
      
      if (updatedTodo) {
        const index = todos.value.findIndex(t => t.id === id)
        if (index !== -1) {
          todos.value[index] = updatedTodo
        }
      }
      return updatedTodo
    } catch (error) {
      console.error('TODO 수정 실패:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateTodoStatus = async (id: number, status: TodoStatus) => {
    try {
      const response = await updateTodoStatusApi({
        path: {
          todoId: id
        },
        query: {
          status: status
        },
        throwOnError: true
      })
      
      const updatedTodo = response.data?.data
      
      if (updatedTodo) {
        const index = todos.value.findIndex(t => t.id === id)
        if (index !== -1) {
          todos.value[index] = updatedTodo
        }
      }
      return updatedTodo
    } catch (error) {
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
    clearTodos
  }
})


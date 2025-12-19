import { ref } from 'vue'
import { useTodoStore } from '@/stores/todo'
import { useToast } from '@/composables/useToast'
import type { TodoRequest, TodoSearchRequest } from '@/client'

// 상태 타입 정의
type TodoStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

// 작업 결과 타입
export interface OperationResult<T = void> {
  success: boolean
  data?: T
  error?: Error
  cancelled?: boolean
}

/**
 * TODO 작업을 위한 Composable
 * 
 * Store 액션 + Toast 알림 + 로딩 상태를 통합 관리
 */
export function useTodoOperations() {
  const todoStore = useTodoStore()
  const { showSuccess, showError } = useToast()
  const loading = ref(false)
  const error = ref<Error | null>(null)

  /**
   * TODO 생성 (피드백 포함)
   */
  const createTodoWithFeedback = async (data: TodoRequest): Promise<OperationResult> => {
    loading.value = true
    error.value = null

    try {
      await todoStore.createTodo(data)
      showSuccess('TODO가 생성되었습니다.')
      return { success: true }
    } catch (e) {
      error.value = e as Error
      showError('TODO 생성에 실패했습니다.')
      return { success: false, error: e as Error }
    } finally {
      loading.value = false
    }
  }

  /**
   * TODO 수정 (피드백 포함)
   */
  const updateTodoWithFeedback = async (
    id: number, 
    data: TodoRequest
  ): Promise<OperationResult<unknown>> => {
    loading.value = true
    error.value = null

    try {
      const result = await todoStore.updateTodo(id, data)
      showSuccess('TODO가 수정되었습니다.')
      return { success: true, data: result }
    } catch (e) {
      error.value = e as Error
      showError('TODO 수정에 실패했습니다.')
      return { success: false, error: e as Error }
    } finally {
      loading.value = false
    }
  }

  /**
   * TODO 삭제 (확인 다이얼로그 + 피드백 포함)
   */
  const deleteTodoWithConfirm = async (id: number): Promise<OperationResult> => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return { success: false, cancelled: true }
    }

    loading.value = true
    error.value = null

    try {
      await todoStore.deleteTodo(id)
      showSuccess('TODO가 삭제되었습니다.')
      return { success: true }
    } catch (e) {
      error.value = e as Error
      showError('TODO 삭제에 실패했습니다.')
      return { success: false, error: e as Error }
    } finally {
      loading.value = false
    }
  }

  /**
   * TODO 상태 변경 (피드백 포함)
   */
  const updateStatusWithFeedback = async (
    id: number, 
    status: TodoStatus
  ): Promise<OperationResult> => {
    try {
      await todoStore.updateTodoStatus(id, status)
      showSuccess('상태가 변경되었습니다.')
      return { success: true }
    } catch (e) {
      error.value = e as Error
      showError('상태 변경에 실패했습니다.')
      return { success: false, error: e as Error }
    }
  }

  /**
   * TODO 목록 새로고침 (통계 포함)
   */
  const refreshTodos = async (filters?: TodoSearchRequest): Promise<OperationResult> => {
    try {
      await Promise.all([
        todoStore.fetchTodos(filters),
        todoStore.fetchStats()
      ])
      return { success: true }
    } catch (e) {
      error.value = e as Error
      showError('데이터를 불러오는데 실패했습니다.')
      return { success: false, error: e as Error }
    }
  }

  return {
    loading,
    error,
    createTodoWithFeedback,
    updateTodoWithFeedback,
    deleteTodoWithConfirm,
    updateStatusWithFeedback,
    refreshTodos
  }
}


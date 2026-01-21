import { ref, computed } from 'vue'
import { useTodoStore } from '@/stores/todo'
import { useToast } from '@/composables/useToast'
import type { TodoRequest, TodoSearchRequest, TodoResponse } from '@/client'
import type { OperationResult } from '@/types/common'

/**
 * TODO 작업을 위한 Composable
 * 
 * Store 액션 + Toast 알림 + 에러 처리를 통합 관리
 * 
 * 참고: 로딩 상태는 todoStore.loading을 사용합니다 (전역 상태로 일관성 유지)
 */
export function useTodoOperations() {
  const todoStore = useTodoStore()
  const { showSuccess, showError } = useToast()
  const error = ref<Error | null>(null)
  
  // Store의 loading 상태를 computed로 노출 (하위 호환성)
  const loading = computed(() => todoStore.loading)

  /**
   * TODO 생성 (피드백 포함)
   * 
   * 참고: 로딩 상태는 todoStore.loading에서 자동으로 관리됩니다.
   */
  const createTodoWithFeedback = async (data: TodoRequest): Promise<OperationResult<TodoResponse | null>> => {
    error.value = null

    try {
      const newTodo = await todoStore.createTodo(data)
      showSuccess('TODO가 생성되었습니다.')
      return { success: true, data: newTodo }
    } catch (e) {
      error.value = e as Error
      showError('TODO 생성에 실패했습니다.')
      return { success: false, error: e as Error }
    }
  }

  /**
   * TODO 수정 (피드백 포함)
   * 
   * 참고: 로딩 상태는 todoStore.loading에서 자동으로 관리됩니다.
   */
  const updateTodoWithFeedback = async (
    id: number, 
    data: TodoRequest
  ): Promise<OperationResult<TodoResponse | null>> => {
    error.value = null

    try {
      const result = await todoStore.updateTodo(id, data)
      showSuccess('TODO가 수정되었습니다.')
      return { success: true, data: result }
    } catch (e) {
      error.value = e as Error
      showError('TODO 수정에 실패했습니다.')
      return { success: false, error: e as Error }
    }
  }

  /**
   * TODO 삭제 (확인 다이얼로그 + 피드백 포함)
   * 
   * 참고: 로딩 상태는 todoStore.loading에서 자동으로 관리됩니다.
   */
  const deleteTodoWithConfirm = async (id: number): Promise<OperationResult> => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return { success: false, cancelled: true }
    }

    error.value = null

    try {
      await todoStore.deleteTodo(id)
      showSuccess('TODO가 삭제되었습니다.')
      return { success: true }
    } catch (e) {
      error.value = e as Error
      showError('TODO 삭제에 실패했습니다.')
      return { success: false, error: e as Error }
    }
  }

  /**
   * TODO 상태 변경 (피드백 포함)
   */
  const updateStatusWithFeedback = async (
    id: number, 
    status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  ): Promise<OperationResult<TodoResponse | null>> => {
    try {
      const updatedTodo = await todoStore.updateTodoStatus(id, status)
      showSuccess('상태가 변경되었습니다.')
      return { success: true, data: updatedTodo }
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

  /**
   * TODO 복제 (피드백 포함)
   * 
   * 참고: 로딩 상태는 todoStore.loading에서 자동으로 관리됩니다.
   */
  const duplicateTodoWithFeedback = async (todoId: number): Promise<OperationResult<TodoResponse | null>> => {
    error.value = null

    try {
      const duplicatedTodo = await todoStore.duplicateTodo(todoId)
      showSuccess('TODO가 복제되었습니다.')
      return { success: true, data: duplicatedTodo }
    } catch (e) {
      error.value = e as Error
      showError('TODO 복제에 실패했습니다.')
      return { success: false, error: e as Error }
    }
  }

  /**
   * 일괄 상태 변경 (피드백 포함)
   * 
   * 참고: 로딩 상태는 todoStore.loading에서 자동으로 관리됩니다.
   */
  const bulkUpdateStatusWithFeedback = async (
    ids: number[],
    status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  ): Promise<OperationResult> => {
    if (ids.length === 0) {
      return { success: false, error: new Error('선택된 항목이 없습니다.') }
    }

    error.value = null

    try {
      await todoStore.bulkUpdateStatus(ids, status)
      showSuccess(`선택한 ${ids.length}개의 TODO 상태가 변경되었습니다.`)
      return { success: true }
    } catch (e) {
      error.value = e as Error
      showError('일괄 상태 변경에 실패했습니다.')
      return { success: false, error: e as Error }
    }
  }

  /**
   * 일괄 삭제 (확인 다이얼로그 + 피드백 포함)
   * 
   * 참고: 로딩 상태는 todoStore.loading에서 자동으로 관리됩니다.
   */
  const bulkDeleteWithConfirm = async (ids: number[]): Promise<OperationResult> => {
    if (ids.length === 0) {
      return { success: false, error: new Error('선택된 항목이 없습니다.') }
    }

    if (!confirm(`정말 ${ids.length}개의 TODO를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      return { success: false, cancelled: true }
    }

    error.value = null

    try {
      await todoStore.bulkDelete(ids)
      showSuccess(`선택한 ${ids.length}개의 TODO가 삭제되었습니다.`)
      return { success: true }
    } catch (e) {
      error.value = e as Error
      showError('일괄 삭제에 실패했습니다.')
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
    refreshTodos,
    duplicateTodoWithFeedback,
    bulkUpdateStatusWithFeedback,
    bulkDeleteWithConfirm
  }
}


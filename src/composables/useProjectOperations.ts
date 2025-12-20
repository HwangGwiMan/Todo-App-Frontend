import { ref } from 'vue'
import { useProjectStore } from '@/stores/project'
import { useToast } from '@/composables/useToast'
import type { ProjectRequest } from '@/client'

// 작업 결과 타입
export interface OperationResult<T = void> {
  success: boolean
  data?: T
  error?: Error
  cancelled?: boolean
}

/**
 * 프로젝트 작업을 위한 Composable
 * 
 * Store 액션 + Toast 알림 + 로딩 상태를 통합 관리
 */
export function useProjectOperations() {
  const projectStore = useProjectStore()
  const { showError } = useToast()
  const loading = ref(false)
  const error = ref<Error | null>(null)

  /**
   * 프로젝트 생성 (피드백 포함)
   */
  const createProjectWithFeedback = async (
    data: ProjectRequest
  ): Promise<OperationResult> => {
    loading.value = true
    error.value = null

    try {
      const result = await projectStore.createNewProject(data)
      // Store 내부에서 이미 Toast 표시하므로 중복 호출 방지
      return { success: true, data: result }
    } catch (e) {
      error.value = e as Error
      // Store에서 이미 에러 처리되므로 여기서는 결과만 반환
      return { success: false, error: e as Error }
    } finally {
      loading.value = false
    }
  }

  /**
   * 프로젝트 수정 (피드백 포함)
   */
  const updateProjectWithFeedback = async (
    projectId: number,
    data: ProjectRequest
  ): Promise<OperationResult> => {
    loading.value = true
    error.value = null

    try {
      const result = await projectStore.updateExistingProject(projectId, data)
      // Store 내부에서 이미 Toast 표시
      return { success: true, data: result }
    } catch (e) {
      error.value = e as Error
      return { success: false, error: e as Error }
    } finally {
      loading.value = false
    }
  }

  /**
   * 프로젝트 삭제 (확인 다이얼로그 + 피드백 포함)
   */
  const deleteProjectWithConfirm = async (
    projectId: number
  ): Promise<OperationResult> => {
    if (!confirm('정말 삭제하시겠습니까?\n\n프로젝트에 속한 TODO는 삭제되지 않습니다.')) {
      return { success: false, cancelled: true }
    }

    loading.value = true
    error.value = null

    try {
      const result = await projectStore.deleteExistingProject(projectId)
      // Store 내부에서 이미 Toast 표시
      return { success: result }
    } catch (e) {
      error.value = e as Error
      return { success: false, error: e as Error }
    } finally {
      loading.value = false
    }
  }

  /**
   * 프로젝트 목록 새로고침
   */
  const refreshProjects = async (): Promise<OperationResult> => {
    try {
      await projectStore.fetchProjects()
      return { success: true }
    } catch (e) {
      error.value = e as Error
      showError('프로젝트 목록을 불러오는데 실패했습니다.')
      return { success: false, error: e as Error }
    }
  }

  return {
    loading,
    error,
    createProjectWithFeedback,
    updateProjectWithFeedback,
    deleteProjectWithConfirm,
    refreshProjects
  }
}


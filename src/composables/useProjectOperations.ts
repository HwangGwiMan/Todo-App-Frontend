import { ref, computed } from 'vue'
import { useProjectStore } from '@/stores/project'
import { useToast } from '@/composables/useToast'
import type { ProjectRequest, ProjectResponse } from '@/client'
import type { OperationResult } from '@/types/common'

/**
 * 프로젝트 작업을 위한 Composable
 * 
 * Store 액션 + Toast 알림 + 에러 처리를 통합 관리
 * 
 * 참고: 로딩 상태는 projectStore의 isLoading, isCreating, isUpdating, isDeleting을 사용합니다 (전역 상태로 일관성 유지)
 */
export function useProjectOperations() {
  const projectStore = useProjectStore()
  const { showError } = useToast()
  const error = ref<Error | null>(null)
  
  // Store의 loading 상태들을 computed로 노출 (하위 호환성)
  const loading = computed(() => 
    projectStore.isLoading || 
    projectStore.isCreating || 
    projectStore.isUpdating || 
    projectStore.isDeleting
  )

  /**
   * 프로젝트 생성 (피드백 포함)
   * 
   * 참고: 로딩 상태는 projectStore.isCreating에서 자동으로 관리됩니다.
   */
  const createProjectWithFeedback = async (
    data: ProjectRequest
  ): Promise<OperationResult<ProjectResponse | null>> => {
    error.value = null

    try {
      const result = await projectStore.createNewProject(data)
      // Store 내부에서 이미 Toast 표시하므로 중복 호출 방지
      return { success: true, data: result }
    } catch (e) {
      error.value = e as Error
      // Store에서 이미 에러 처리되므로 여기서는 결과만 반환
      return { success: false, error: e as Error }
    }
  }

  /**
   * 프로젝트 수정 (피드백 포함)
   * 
   * 참고: 로딩 상태는 projectStore.isUpdating에서 자동으로 관리됩니다.
   */
  const updateProjectWithFeedback = async (
    projectId: number,
    data: ProjectRequest
  ): Promise<OperationResult<ProjectResponse | null>> => {
    error.value = null

    try {
      const result = await projectStore.updateExistingProject(projectId, data)
      // Store 내부에서 이미 Toast 표시
      return { success: true, data: result }
    } catch (e) {
      error.value = e as Error
      return { success: false, error: e as Error }
    }
  }

  /**
   * 프로젝트 삭제 (확인 다이얼로그 + 피드백 포함)
   * 
   * 참고: 로딩 상태는 projectStore.isDeleting에서 자동으로 관리됩니다.
   */
  const deleteProjectWithConfirm = async (
    projectId: number
  ): Promise<OperationResult> => {
    if (!confirm('정말 삭제하시겠습니까?\n\n프로젝트에 속한 TODO는 삭제되지 않습니다.')) {
      return { success: false, cancelled: true }
    }

    error.value = null

    try {
      const result = await projectStore.deleteExistingProject(projectId)
      // Store 내부에서 이미 Toast 표시
      return { success: result }
    } catch (e) {
      error.value = e as Error
      return { success: false, error: e as Error }
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
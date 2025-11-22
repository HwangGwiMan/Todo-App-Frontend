import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  ProjectRequest, 
  ProjectResponse
} from '@/client'
import { 
  getProjects, 
  createProject, 
  updateProject, 
  deleteProject, 
  getProject,
  getDefaultProject 
} from '@/client'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useToast } from '@/composables/useToast'

export const useProjectStore = defineStore('project', () => {
  // State
  const projects = ref<ProjectResponse[]>([])
  const currentProject = ref<ProjectResponse | null>(null)
  const defaultProject = ref<ProjectResponse | null>(null)
  const isLoading = ref(false)
  const isCreating = ref(false)
  const isUpdating = ref(false)
  const isDeleting = ref(false)

  // Composables
  const { handleError } = useErrorHandler()
  const { showToast } = useToast()

  // Getters
  const projectCount = computed(() => projects.value.length)
  const hasProjects = computed(() => projectCount.value > 0)
  const sortedProjects = computed(() => {
    return [...projects.value].sort((a, b) => {
      // 기본 프로젝트를 맨 앞에
      if (a.isDefault && !b.isDefault) return -1
      if (!a.isDefault && b.isDefault) return 1
      // 그 다음 position 순서로
      return (a.position || 0) - (b.position || 0)
    })
  })

  // Actions
  const fetchProjects = async () => {
    try {
      isLoading.value = true
      const response = await getProjects({
        throwOnError: true
      })
      
      projects.value = (response.data?.data as ProjectResponse[]) || []
      
    } catch (error) {
      handleError(error, '프로젝트 목록을 불러오는데 실패했습니다.')
    } finally {
      isLoading.value = false
    }
  }

  const fetchProject = async (projectId: number) => {
    try {
      isLoading.value = true
      const response = await getProject({
        path: { projectId },
        throwOnError: true
      })
      
      currentProject.value = response.data?.data || null
      
      return currentProject.value
    } catch (error) {
      handleError(error, '프로젝트를 불러오는데 실패했습니다.')
      return null
    } finally {
      isLoading.value = false
    }
  }

  const fetchDefaultProject = async () => {
    try {
      const response = await getDefaultProject({
        throwOnError: false // 기본 프로젝트가 없을 수 있음
      })
      
      defaultProject.value = response.data?.data || null
      
      return defaultProject.value
    } catch (error: unknown) {
      handleError(error, '기본 프로젝트를 불러오는데 실패했습니다.')
      // 기본 프로젝트가 없을 수 있으므로 에러 처리하지 않음
      defaultProject.value = null
      return null
    }
  }

  const createNewProject = async (projectData: ProjectRequest) => {
    try {
      isCreating.value = true
      
      const response = await createProject({
        body: projectData,
        throwOnError: true
      })
      
      const newProject = response.data?.data
      
      if (newProject) {
        projects.value.push(newProject)
        
        // 기본 프로젝트로 설정된 경우 기존 기본 프로젝트 해제
        if (newProject.isDefault) {
          projects.value.forEach(project => {
            if (project.id !== newProject.id) {
              project.isDefault = false
            }
          })
          defaultProject.value = newProject
        }
        
        showToast('프로젝트가 생성되었습니다.', 'success')
      }
      
      return newProject
    } catch (error) {
      handleError(error, '프로젝트 생성에 실패했습니다.')
      return null
    } finally {
      isCreating.value = false
    }
  }

  const updateExistingProject = async (projectId: number, projectData: ProjectRequest) => {
    try {
      isUpdating.value = true
      
      const response = await updateProject({
        path: { projectId },
        body: projectData,
        throwOnError: true
      })
      
      const updatedProject = response.data?.data
      
      if (updatedProject) {
        const index = projects.value.findIndex(p => p.id === projectId)
        if (index !== -1) {
          projects.value[index] = updatedProject
        }
        
        // 기본 프로젝트로 설정된 경우 기존 기본 프로젝트 해제
        if (updatedProject.isDefault) {
          projects.value.forEach(project => {
            if (project.id !== updatedProject.id) {
              project.isDefault = false
            }
          })
          defaultProject.value = updatedProject
        }
        
        // 현재 프로젝트 업데이트
        if (currentProject.value?.id === projectId) {
          currentProject.value = updatedProject
        }
        
        showToast('프로젝트가 수정되었습니다.', 'success')
      }
      
      return updatedProject
    } catch (error) {
      handleError(error, '프로젝트 수정에 실패했습니다.')
      return null
    } finally {
      isUpdating.value = false
    }
  }

  const deleteExistingProject = async (projectId: number) => {
    try {
      isDeleting.value = true
      
      await deleteProject({
        path: { projectId },
        throwOnError: true
      })
      
      // 로컬 상태에서 제거
      projects.value = projects.value.filter(p => p.id !== projectId)
      
      // 현재 프로젝트가 삭제된 경우 초기화
      if (currentProject.value?.id === projectId) {
        currentProject.value = null
      }
      
      // 기본 프로젝트가 삭제된 경우 초기화
      if (defaultProject.value?.id === projectId) {
        defaultProject.value = null
      }
      
      showToast('프로젝트가 삭제되었습니다.', 'success')
      
      return true
    } catch (error) {
      handleError(error, '프로젝트 삭제에 실패했습니다.')
      return false
    } finally {
      isDeleting.value = false
    }
  }

  const getProjectById = (projectId: number): ProjectResponse | null => {
    return projects.value.find(p => p.id === projectId) || null
  }

  const getProjectsForSelect = computed(() => {
    return sortedProjects.value
      .filter(project => project.id !== undefined)
      .map(project => ({
        value: project.id!,
        label: project.name || '',
        color: project.color,
        isDefault: project.isDefault
      }))
  })

  // Reset function
  const reset = () => {
    projects.value = []
    currentProject.value = null
    defaultProject.value = null
    isLoading.value = false
    isCreating.value = false
    isUpdating.value = false
    isDeleting.value = false
  }

  return {
    // State
    projects,
    currentProject,
    defaultProject,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    
    // Getters
    projectCount,
    hasProjects,
    sortedProjects,
    getProjectsForSelect,
    
    // Actions
    fetchProjects,
    fetchProject,
    fetchDefaultProject,
    createNewProject,
    updateExistingProject,
    deleteExistingProject,
    getProjectById,
    reset
  }
})

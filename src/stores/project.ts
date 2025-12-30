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
  // State - Map 구조로 최적화 (O(1) 조회)
  const projectsMap = ref<Map<number, ProjectResponse>>(new Map())
  const projectIds = ref<number[]>([]) // 순서 유지용
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
  // 기존 코드와의 호환성을 위해 배열로 반환하는 computed 속성 유지
  const projects = computed(() => 
    projectIds.value
      .map(id => projectsMap.value.get(id))
      .filter((project): project is ProjectResponse => project !== undefined)
  )
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

  // O(1) 조회 메서드
  const getProjectById = (projectId: number): ProjectResponse | null => {
    return projectsMap.value.get(projectId) || null
  }

  // Actions
  const fetchProjects = async () => {
    try {
      isLoading.value = true
      const response = await getProjects({
        throwOnError: true
      })
      
      const projectList = (response.data?.data as ProjectResponse[]) || []
      
      // Map과 배열 동시 업데이트
      projectsMap.value.clear()
      projectIds.value = []
      
      projectList.forEach(project => {
        if (project.id !== undefined && project.id !== null) {
          projectsMap.value.set(project.id, project)
          projectIds.value.push(project.id)
        }
      })
      
    } catch (error) {
      handleError(error, '프로젝트 목록을 불러오는데 실패했습니다.')
    } finally {
      isLoading.value = false
    }
  }

  const fetchProject = async (projectId: number) => {
    // Map에 이미 있는 경우 캐시된 데이터 사용 (선택적 최적화)
    const cachedProject = projectsMap.value.get(projectId)
    if (cachedProject) {
      currentProject.value = cachedProject
      return cachedProject
    }

    try {
      isLoading.value = true
      const response = await getProject({
        path: { projectId },
        throwOnError: true
      })
      
      const project = response.data?.data || null
      
      if (project) {
        // Map에도 저장하여 나중에 빠르게 조회 가능하도록
        if (project.id !== undefined && project.id !== null) {
          projectsMap.value.set(project.id, project)
          // ID가 배열에 없으면 추가 (순서 유지)
          if (!projectIds.value.includes(project.id)) {
            projectIds.value.push(project.id)
          }
        }
        currentProject.value = project
      } else {
        currentProject.value = null
      }
      
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
      
      const project = response.data?.data || null
      
      if (project) {
        // Map에도 저장하여 나중에 빠르게 조회 가능하도록
        if (project.id !== undefined && project.id !== null) {
          projectsMap.value.set(project.id, project)
          // ID가 배열에 없으면 추가 (순서 유지)
          if (!projectIds.value.includes(project.id)) {
            projectIds.value.push(project.id)
          }
        }
        defaultProject.value = project
      } else {
        defaultProject.value = null
      }
      
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
      
      if (newProject && newProject.id !== undefined && newProject.id !== null) {
        // Map과 배열에 추가
        projectsMap.value.set(newProject.id, newProject)
        projectIds.value.push(newProject.id)
        
        // 기본 프로젝트로 설정된 경우 기존 기본 프로젝트 해제
        if (newProject.isDefault) {
          projectIds.value.forEach(projectId => {
            if (projectId !== newProject.id) {
              const existingProject = projectsMap.value.get(projectId)
              if (existingProject && existingProject.isDefault) {
                existingProject.isDefault = false
                projectsMap.value.set(projectId, existingProject)
              }
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
      
      if (updatedProject && updatedProject.id !== undefined && updatedProject.id !== null) {
        // Map 업데이트
        projectsMap.value.set(updatedProject.id, updatedProject)
        
        // 기본 프로젝트로 설정된 경우 기존 기본 프로젝트 해제
        if (updatedProject.isDefault) {
          projectIds.value.forEach(projectId => {
            if (projectId !== updatedProject.id) {
              const existingProject = projectsMap.value.get(projectId)
              if (existingProject && existingProject.isDefault) {
                existingProject.isDefault = false
                projectsMap.value.set(projectId, existingProject)
              }
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
      
      // Map과 배열에서 제거
      projectsMap.value.delete(projectId)
      projectIds.value = projectIds.value.filter(id => id !== projectId)
      
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
    projectsMap.value.clear()
    projectIds.value = []
    currentProject.value = null
    defaultProject.value = null
    isLoading.value = false
    isCreating.value = false
    isUpdating.value = false
    isDeleting.value = false
  }

  return {
    // State (기존 API 호환성 유지)
    projects, // computed 배열 (기존 코드와 호환)
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
    getProjectById, // O(1) 조회 메서드
    reset
  }
})

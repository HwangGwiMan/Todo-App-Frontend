<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Toast Notification -->
    <ToastNotification ref="toastRef" />

    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Stats -->
      <div
        v-if="todoStore.stats"
        class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <div class="card">
          <p class="text-sm text-gray-600">
            전체
          </p>
          <p class="text-2xl font-bold">
            {{ todoStore.stats.totalCount }}
          </p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600">
            할 일
          </p>
          <p class="text-2xl font-bold text-blue-600">
            {{ todoStore.stats.todoCount }}
          </p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600">
            진행중
          </p>
          <p class="text-2xl font-bold text-yellow-600">
            {{ todoStore.stats.inProgressCount }}
          </p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600">
            완료
          </p>
          <p class="text-2xl font-bold text-green-600">
            {{ todoStore.stats.doneCount }}
          </p>
        </div>
      </div>

      <!-- Filter/Sort Bar -->
      <FilterSortBar 
        v-model:filters="filters" 
        :project-options="projectStore.getProjectsForSelect"
      />

      <!-- Project Management -->
      <div class="card mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900">
            프로젝트 관리
          </h2>
          <button
            class="btn-primary text-sm"
            @click="showProjectCreateModal = true"
          >
            + 새 프로젝트
          </button>
        </div>
        
        <div
          v-if="projectStore.isLoading"
          class="text-center py-4 text-gray-500"
        >
          프로젝트를 불러오는 중...
        </div>
        
        <div
          v-else-if="projectStore.hasProjects"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          <ProjectCard
            v-for="project in projectStore.sortedProjects"
            :key="project.id"
            :project="project"
            @edit="handleProjectEdit"
            @delete="handleProjectDelete"
            @select="handleProjectSelect"
          />
        </div>
        
        <EmptyState
          v-else
          icon="📁"
          title="프로젝트가 없습니다"
          message="새로운 프로젝트를 추가해보세요!"
        >
          <template #action>
            <button
              class="btn-primary"
              @click="showProjectCreateModal = true"
            >
              + 새 프로젝트
            </button>
          </template>
        </EmptyState>
      </div>

      <!-- TODO List -->
      <div class="card">
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-bold">
              할 일 목록
            </h2>
            <router-link
              to="/dashboard"
              class="btn-secondary text-sm flex items-center gap-1"
              title="대시보드로 이동"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              대시보드
            </router-link> 
            <h2 v-if="selectedProject">
              {{ selectedProject.name }}
            </h2>
            <!-- 프로젝트 취소 버튼 -->
            <button
              v-if="selectedProject"
              class="btn-secondary"
              @click="handleProjectCancel"
            >
              취소
            </button>
          </div>
          <div class="flex gap-2">
            <button
              class="btn-secondary"
              @click="showTemplateModal = true"
            >
              📋 템플릿
            </button>
            <button
              class="btn-primary"
              @click="showCreateModal = true"
            >
              + 새 TODO
            </button>
          </div>
        </div>
        
        <!-- Loading -->
        <LoadingSpinner :is-loading="todoStore.loading" />
        
        <!-- Empty State -->
        <EmptyState
          v-if="!todoStore.loading && todoStore.todos.length === 0"
          icon="📝"
          title="TODO가 없습니다"
          message="새로운 TODO를 추가해보세요!"
        >
          <template #action>
            <button
              class="btn-primary"
              @click="showCreateModal = true"
            >
              + 새 TODO
            </button>
          </template>
        </EmptyState>
        
        <!-- 일괄 작업 바 -->
        <div
          v-if="selectedTodos.length > 0"
          class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between"
        >
          <span class="text-blue-800 font-medium">
            {{ selectedTodos.length }}개 선택됨
          </span>
          <div class="flex gap-2">
            <button
              class="btn-secondary text-sm"
              @click="handleBulkStatusChange('TODO')"
            >
              할 일로 변경
            </button>
            <button
              class="btn-secondary text-sm"
              @click="handleBulkStatusChange('IN_PROGRESS')"
            >
              진행중으로 변경
            </button>
            <button
              class="btn-secondary text-sm"
              @click="handleBulkStatusChange('DONE')"
            >
              완료로 변경
            </button>
            <button
              class="btn-secondary text-sm text-red-600 hover:text-red-700"
              @click="handleBulkDelete"
            >
              일괄 삭제
            </button>
            <button
              class="btn-secondary text-sm"
              @click="selectedTodos = []"
            >
              선택 해제
            </button>
          </div>
        </div>

        <!-- TODO 목록 헤더 (일괄 선택 모드 토글) -->
        <div
          v-if="!todoStore.loading && todoStore.todos.length > 0"
          class="mb-4 flex justify-between items-center"
        >
          <div class="flex items-center gap-3">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="isAllSelected"
                :indeterminate="isIndeterminate"
                class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                @change="handleToggleSelectAll"
              />
              <span class="text-sm text-gray-700">전체 선택</span>
            </label>
            <button
              class="text-sm text-gray-600 hover:text-gray-900"
              @click="isSelectionMode = !isSelectionMode"
            >
              {{ isSelectionMode ? '일괄 선택 모드 해제' : '일괄 선택 모드' }}
            </button>
          </div>
        </div>

        <!-- TODO Grid (드래그 앤 드롭 지원) -->
        <div
          v-if="!todoStore.loading && todoStore.todos.length > 0"
          ref="todoListContainer"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <TodoCard
            v-for="todo in todoStore.todos"
            :key="todo.id || 0"
            :todo="todo"
            :selected="selectedTodos.includes(todo.id || 0)"
            :is-selection-mode="isSelectionMode"
            @edit="handleEdit"
            @delete="handleDelete"
            @status-change="handleStatusChange"
            @duplicate="handleDuplicate"
            @toggle-select="handleToggleSelect"
          />
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="!todoStore.loading && todoStore.todos.length > 0"
          :current-page="todoStore.currentPage"
          :total-pages="todoStore.totalPages"
          :total-elements="todoStore.totalElements"
          :page-size="pageSize"
          @page-change="handlePageChange"
        />
      </div>
    </main>

    <!-- Create Modal -->
    <TodoCreateModal
      :is-open="showCreateModal"
      @close="showCreateModal = false"
      @created="handleCreate"
    />

    <!-- Edit Modal -->
    <TodoEditModal
      :is-open="showEditModal"
      :todo="selectedTodo"
      @close="showEditModal = false"
      @updated="handleUpdate"
    />

    <!-- Project Create Modal -->
    <ProjectCreateModal
      :is-open="showProjectCreateModal"
      @close="showProjectCreateModal = false"
      @created="handleProjectCreate"
    />

    <!-- Project Edit Modal -->
    <ProjectEditModal
      :is-open="showProjectEditModal"
      :project="selectedProject"
      @close="showProjectEditModal = false"
      @updated="handleProjectUpdate"
    />

    <!-- Template Modal -->
    <TodoTemplateModal
      :is-open="showTemplateModal"
      @close="showTemplateModal = false"
      @use-template="handleUseTemplate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import Sortable from 'sortablejs'
import { useTodoStore } from '@/stores/todo'
import { useProjectStore } from '@/stores/project'
import { useToast } from '@/composables/useToast'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useTodoOperations } from '@/composables/useTodoOperations'
import { useProjectOperations } from '@/composables/useProjectOperations'
import AppHeader from '@/components/AppHeader.vue'
import TodoCard from '@/components/TodoCard.vue'
import TodoCreateModal from '@/components/TodoCreateModal.vue'
import TodoEditModal from '@/components/TodoEditModal.vue'
import TodoTemplateModal from '@/components/TodoTemplateModal.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import ProjectCreateModal from '@/components/ProjectCreateModal.vue'
import ProjectEditModal from '@/components/ProjectEditModal.vue'
import FilterSortBar from '@/components/FilterSortBar.vue'
import Pagination from '@/components/Pagination.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { TodoResponse, TodoRequest, TodoSearchRequest, ProjectResponse, ProjectRequest } from '@/client'
import type { ToastNotificationInstance } from '@/types/common'
import ToastNotification from "@/components/ToastNotification.vue";
import EmptyState from "@/components/EmptyState.vue";

const todoStore = useTodoStore()
const projectStore = useProjectStore()
const { setToastRef, showError } = useToast()
const { handleError } = useErrorHandler()
const todoOps = useTodoOperations()
const projectOps = useProjectOperations()

const toastRef = ref<ToastNotificationInstance | null>(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedTodo = ref<TodoResponse | null>(null)
const showProjectCreateModal = ref(false)
const showProjectEditModal = ref(false)
const showTemplateModal = ref(false)
const selectedProject = ref<ProjectResponse | null>(null)
const pageSize = ref(12)
const todoListContainer = ref<HTMLElement | null>(null)
const selectedTodos = ref<number[]>([])
const isSelectionMode = ref(false)
let sortableInstance: Sortable | null = null

const filters = ref<TodoSearchRequest>({
  page: 0,
  size: pageSize.value,
  sortBy: 'createdAt',
  sortDirection: 'DESC'
})

// 전체 선택 관련 computed
const isAllSelected = computed(() => {
  if (todoStore.todos.length === 0) return false
  return todoStore.todos.every(todo => 
    todo.id !== undefined && selectedTodos.value.includes(todo.id)
  )
})

const isIndeterminate = computed(() => {
  const selectedCount = selectedTodos.value.length
  return selectedCount > 0 && selectedCount < todoStore.todos.length
})

onMounted(async () => {
  setToastRef(toastRef.value)
  
  try {
    await Promise.all([
      todoStore.fetchTodos(filters.value),
      todoStore.fetchStats(),
      projectStore.fetchProjects()
    ])
    
    // 드래그 앤 드롭 초기화
    await nextTick()
    initSortable()
  } catch (error) {
    handleError(error, '데이터 로딩 중 오류가 발생했습니다.')
    showError('데이터를 불러오는데 실패했습니다.')
  }
})

// 드래그 앤 드롭 초기화
const initSortable = () => {
  if (!todoListContainer.value || sortableInstance) return
  
  sortableInstance = Sortable.create(todoListContainer.value, {
    animation: 150,
    handle: '.drag-handle', // 드래그 핸들 (추가 시)
    ghostClass: 'opacity-50',
    chosenClass: 'ring-2 ring-blue-500',
    onEnd: async (event) => {
      const { oldIndex, newIndex } = event
      if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
        todoStore.updateTodoPosition(oldIndex, newIndex)
        // TODO: 백엔드 API 연동 시 여기서 API 호출
      }
    }
  })
}

// 드래그 앤 드롭 재초기화 (TODO 목록 변경 시)
watch(() => todoStore.todos.length, async () => {
  if (sortableInstance) {
    sortableInstance.destroy()
    sortableInstance = null
  }
  await nextTick()
  initSortable()
})

watch(filters, async (newFilters) => {
  // 프로젝트 필터가 초기화되면 선택된 프로젝트도 초기화
  if (!newFilters.projectId && selectedProject.value) {
    selectedProject.value = null
  }
  
  try {
    await todoStore.fetchTodos(newFilters)
  } catch (error) {
    handleError(error, 'TODO 목록 조회 중 오류가 발생했습니다.')
    showError('TODO 목록을 불러오는데 실패했습니다.')
  }
}, { deep: true })

const handleCreate = async (todoData: TodoRequest) => {
  try {
    // 선택된 프로젝트가 있는지 확인
    if (selectedProject.value) {
      todoData.projectId = selectedProject.value.id
    }
    
    const result = await todoOps.createTodoWithFeedback(todoData)
    console.log(result)
    if (result.success) {
      showCreateModal.value = false
      await todoOps.refreshTodos(filters.value)
    }
  } catch (error) {
    console.log(error)
    handleError(error, 'TODO 생성 중 오류가 발생했습니다.')
  }
}

const handleEdit = (todo: TodoResponse) => {
  selectedTodo.value = todo
  showEditModal.value = true
}

const handleUpdate = async (id: number, todoData: TodoRequest) => {
  try {
    const result = await todoOps.updateTodoWithFeedback(id, todoData)
    
    if (result.success) {
      showEditModal.value = false
      selectedTodo.value = null
      await todoOps.refreshTodos(filters.value)
    }
  } catch (error) {
    handleError(error, 'TODO 수정 중 오류가 발생했습니다.')
  }
}

const handleDelete = async (id: number) => {
  try {
    const result = await todoOps.deleteTodoWithConfirm(id)
    
    if (result.success) {
      await todoOps.refreshTodos(filters.value)
    }
  } catch (error) {
    handleError(error, 'TODO 삭제 중 오류가 발생했습니다.')
  }
}

const handleStatusChange = async (id: number, status: string) => {
  try {
    const result = await todoOps.updateStatusWithFeedback(
      id,
      status as 'TODO' | 'IN_PROGRESS' | 'DONE'
    )
    
    if (result.success) {
      await todoOps.refreshTodos(filters.value)
    }
  } catch (error) {
    handleError(error, '상태 변경 중 오류가 발생했습니다.')
  }
}

const handlePageChange = async (page: number) => {
  filters.value = {
    ...filters.value,
    page
  }
}

// 프로젝트 관련 핸들러들
const handleProjectCreate = async (projectData: ProjectRequest) => {
  try {
    const result = await projectOps.createProjectWithFeedback(projectData)
    
    if (result.success) {
      showProjectCreateModal.value = false
      // 프로젝트 생성 후 TODO 목록 새로고침 (프로젝트 필터 옵션 업데이트)
      await Promise.all([
        todoStore.fetchTodos(filters.value),
        projectStore.fetchProjects()
      ])
    }
  } catch (error) {
    handleError(error, '프로젝트 생성 중 오류가 발생했습니다.')
  }
}

const handleProjectEdit = (project: ProjectResponse) => {
  selectedProject.value = project
  showProjectEditModal.value = true
}

const handleProjectUpdate = async (projectId: number, projectData: ProjectRequest) => {
  try {
    const result = await projectOps.updateProjectWithFeedback(projectId, projectData)
    
    if (result.success) {
      showProjectEditModal.value = false
      selectedProject.value = null
    }
  } catch (error) {
    handleError(error, '프로젝트 수정 중 오류가 발생했습니다.')
  }
}

const handleProjectDelete = async (project: ProjectResponse) => {
  if (!project.id) return
  
  // 기본 프로젝트는 삭제할 수 없음
  if (project.isDefault) {
    showError('기본 프로젝트는 삭제할 수 없습니다.')
    return
  }
  
  try {
    const result = await projectOps.deleteProjectWithConfirm(project.id)
    
    if (result.success) {
      // 현재 선택된 프로젝트가 삭제된 경우 필터 초기화
      if (filters.value.projectId === project.id) {
        filters.value.projectId = undefined
      }
      await todoStore.fetchTodos(filters.value)
    }
  } catch (error) {
    handleError(error, '프로젝트 삭제 중 오류가 발생했습니다.')
  }
}

const handleProjectSelect = (project: ProjectResponse) => {
  selectedProject.value = project
  // 프로젝트 필터 적용
  filters.value = {
    ...filters.value,
    projectId: project.id,
    page: 0
  }
}

const handleProjectCancel = () => {
  selectedProject.value = null
  filters.value = {
    ...filters.value,
    projectId: undefined,
    page: 0
  }
}

// 고급 기능: TODO 복제
const handleDuplicate = async (todoId: number) => {
  try {
    const result = await todoOps.duplicateTodoWithFeedback(todoId)
    if (result.success) {
      await todoOps.refreshTodos(filters.value)
    }
  } catch (error) {
    handleError(error, 'TODO 복제 중 오류가 발생했습니다.')
  }
}

// 일괄 작업: 선택 토글
const handleToggleSelect = (todoId: number) => {
  const index = selectedTodos.value.indexOf(todoId)
  if (index > -1) {
    selectedTodos.value.splice(index, 1)
  } else {
    selectedTodos.value.push(todoId)
  }
}

// 일괄 작업: 전체 선택/해제
const handleToggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedTodos.value = []
  } else {
    selectedTodos.value = todoStore.todos
      .filter(todo => todo.id !== undefined)
      .map(todo => todo.id!)
  }
}

// 일괄 작업: 일괄 상태 변경
const handleBulkStatusChange = async (status: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
  if (selectedTodos.value.length === 0) return

  try {
    const result = await todoOps.bulkUpdateStatusWithFeedback(selectedTodos.value, status)
    if (result.success) {
      selectedTodos.value = []
      await todoOps.refreshTodos(filters.value)
    }
  } catch (error) {
    handleError(error, '일괄 상태 변경 중 오류가 발생했습니다.')
  }
}

// 일괄 작업: 일괄 삭제
const handleBulkDelete = async () => {
  if (selectedTodos.value.length === 0) return

  try {
    const result = await todoOps.bulkDeleteWithConfirm(selectedTodos.value)
    if (result.success) {
      selectedTodos.value = []
      await todoOps.refreshTodos(filters.value)
    }
  } catch (error) {
    handleError(error, '일괄 삭제 중 오류가 발생했습니다.')
  }
}

// 템플릿 사용
const handleUseTemplate = (templateData: TodoRequest) => {
  // 템플릿 데이터로 TODO 생성 모달 열기
  // TODO: TodoCreateModal에서 템플릿 데이터를 받을 수 있도록 수정 필요
  showCreateModal.value = true
  // 템플릿 데이터는 나중에 TodoCreateModal에서 직접 처리하도록 구현
}
</script>
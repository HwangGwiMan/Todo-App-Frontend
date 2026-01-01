<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- 로딩 상태 -->
      <div
        v-if="todoStore.loading"
        class="flex justify-center items-center py-20"
      >
        <LoadingSpinner is-loading />
      </div>

      <!-- 에러 상태 -->
      <div
        v-else-if="error"
        class="card"
      >
        <div class="text-center py-8">
          <p class="text-red-600 text-lg mb-4">
            {{ error }}
          </p>
          <router-link
            to="/todos"
            class="btn-primary"
          >
            ← 목록으로 돌아가기
          </router-link>
        </div>
      </div>

      <!-- TODO 상세 내용 -->
      <div
        v-else-if="todo"
        class="space-y-6"
      >
        <!-- 헤더: 제목과 액션 버튼 -->
        <div class="card">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div class="flex-1">
              <h1 class="text-3xl font-bold text-gray-900">
                {{ todo.title }}
              </h1>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                class="btn-primary text-sm"
                :disabled="isUpdating"
                @click="handleEdit"
              >
                ✏️ 수정
              </button>
              <button
                class="btn-secondary text-sm bg-red-500 text-white hover:bg-red-600"
                :disabled="isDeleting"
                @click="handleDelete"
              >
                🗑️ 삭제
              </button>
              <router-link
                to="/todos"
                class="btn-secondary text-sm"
              >
                ← 목록
              </router-link>
            </div>
          </div>

          <!-- 상태 및 우선순위 배지 -->
          <div class="flex flex-wrap gap-3 mb-6">
            <span
              class="px-3 py-1 rounded-full text-sm font-semibold"
              :class="statusBadgeClass"
            >
              {{ statusLabel }}
            </span>
            <span
              class="px-3 py-1 rounded-full text-sm font-semibold"
              :class="priorityBadgeClass"
            >
              {{ priorityLabel }}
            </span>
            <span
              v-if="projectName"
              class="px-3 py-1 rounded-full text-sm font-semibold text-white"
              :style="{ backgroundColor: projectColor }"
            >
              📁 {{ projectName }}
            </span>
          </div>

          <!-- 상태 변경 버튼 -->
          <div class="flex flex-wrap gap-2 mb-6">
            <button
              v-if="todo.status !== 'TODO'"
              class="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 text-sm"
              :disabled="isUpdating"
              @click="changeStatus('TODO')"
            >
              할 일로 변경
            </button>
            <button
              v-if="todo.status !== 'IN_PROGRESS'"
              class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm"
              :disabled="isUpdating"
              @click="changeStatus('IN_PROGRESS')"
            >
              진행중으로 변경
            </button>
            <button
              v-if="todo.status !== 'DONE'"
              class="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 text-sm"
              :disabled="isUpdating"
              @click="changeStatus('DONE')"
            >
              완료로 변경
            </button>
          </div>

          <!-- 설명 -->
          <div
            v-if="todo.description"
            class="mb-6"
          >
            <h3 class="text-lg font-semibold text-gray-700 mb-2">
              📝 설명
            </h3>
            <p class="text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
              {{ todo.description }}
            </p>
          </div>

          <!-- 날짜 정보 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div
              v-if="todo.dueDate"
              class="bg-orange-50 p-4 rounded-lg"
            >
              <h4 class="text-sm font-semibold text-orange-700 mb-1">
                📅 마감일
              </h4>
              <p class="text-orange-900 font-medium">
                {{ formatDate(todo.dueDate) }}
              </p>
              <p
                v-if="isOverdue"
                class="text-red-600 text-sm mt-1"
              >
                ⚠️ 마감일이 지났습니다
              </p>
            </div>
            <div
              v-if="todo.completedAt"
              class="bg-green-50 p-4 rounded-lg"
            >
              <h4 class="text-sm font-semibold text-green-700 mb-1">
                ✅ 완료일
              </h4>
              <p class="text-green-900 font-medium">
                {{ formatDate(todo.completedAt) }}
              </p>
            </div>
          </div>

          <!-- 메타 정보 -->
          <div class="border-t pt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span class="font-semibold">생성일:</span>
                <span class="ml-2">{{ formatDate(todo.createdAt) }}</span>
              </div>
              <div>
                <span class="font-semibold">수정일:</span>
                <span class="ml-2">{{ formatDate(todo.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TODO가 없는 경우 -->
      <EmptyState
        v-else
        icon="🔍"
        title="TODO를 찾을 수 없습니다"
        message="요청하신 TODO가 존재하지 않거나 삭제되었을 수 있습니다."
      >
        <template #action>
          <router-link
            to="/todos"
            class="btn-primary"
          >
            ← 목록으로 돌아가기
          </router-link>
        </template>
      </EmptyState>
    </div>

    <!-- TODO 수정 모달 -->
    <TodoEditModal
      :is-open="showEditModal"
      :todo="todo"
      @close="showEditModal = false"
      @updated="handleUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTodoStore } from '@/stores/todo'
import { useProjectStore } from '@/stores/project'
import { useToast } from '@/composables/useToast'
import { useTodoOperations } from '@/composables/useTodoOperations'
import AppHeader from '@/components/AppHeader.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import TodoEditModal from '@/components/TodoEditModal.vue'
import EmptyState from '@/components/EmptyState.vue'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

type TodoStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

const route = useRoute()
const router = useRouter()
const todoStore = useTodoStore()
const projectStore = useProjectStore()
const { showToast } = useToast()
const todoOps = useTodoOperations()

const todo = computed(() => todoStore.currentTodo)
const error = ref<string | null>(null)
const showEditModal = ref(false)
const isUpdating = ref(false)
const isDeleting = ref(false)

// 프로젝트 정보
const project = computed(() => {
  if (todo.value?.projectId) {
    return projectStore.getProjectById(todo.value.projectId)
  }
  return null
})

const projectName = computed(() => project.value?.name || null)
const projectColor = computed(() => project.value?.color || '#6B7280')

// 상태 배지 클래스
const statusBadgeClass = computed(() => {
  switch (todo.value?.status) {
    case 'TODO':
      return 'bg-gray-200 text-gray-800'
    case 'IN_PROGRESS':
      return 'bg-blue-200 text-blue-800'
    case 'DONE':
      return 'bg-green-200 text-green-800'
    default:
      return 'bg-gray-200 text-gray-800'
  }
})

const statusLabel = computed(() => {
  switch (todo.value?.status) {
    case 'TODO':
      return '📋 할 일'
    case 'IN_PROGRESS':
      return '🚀 진행중'
    case 'DONE':
      return '✅ 완료'
    default:
      return '📋 할 일'
  }
})

// 우선순위 배지 클래스
const priorityBadgeClass = computed(() => {
  switch (todo.value?.priority) {
    case 'HIGH':
      return 'bg-red-200 text-red-800'
    case 'MEDIUM':
      return 'bg-yellow-200 text-yellow-800'
    case 'LOW':
      return 'bg-green-200 text-green-800'
    default:
      return 'bg-gray-200 text-gray-800'
  }
})

const priorityLabel = computed(() => {
  switch (todo.value?.priority) {
    case 'HIGH':
      return '🔴 높음'
    case 'MEDIUM':
      return '🟡 보통'
    case 'LOW':
      return '🟢 낮음'
    default:
      return '🟡 보통'
  }
})

// 마감일 지남 체크
const isOverdue = computed(() => {
  if (!todo.value?.dueDate || todo.value.status === 'DONE') {
    return false
  }
  return new Date(todo.value.dueDate) < new Date()
})

// 날짜 포맷팅
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return format(date, 'yyyy년 M월 d일 HH:mm', { locale: ko })
  } catch {
    return '-'
  }
}

// TODO 로드
const loadTodo = async () => {
  const todoId = route.params.id as string
  if (!todoId) {
    error.value = 'TODO ID가 없습니다.'
    return
  }

  try {
    error.value = null
    await todoStore.fetchTodoById(Number(todoId))
    
    if (!todo.value) {
      error.value = 'TODO를 찾을 수 없습니다.'
    }
    
    // 프로젝트 정보 로드 (아직 로드되지 않았다면)
    if (projectStore.projects.length === 0) {
      await projectStore.fetchProjects()
    }
  } catch (err) {
    console.error('TODO 로드 실패:', err)
    error.value = 'TODO를 불러오는데 실패했습니다.'
  }
}

// 수정 처리
const handleEdit = () => {
  showEditModal.value = true
}

const handleUpdated = async () => {
  showEditModal.value = false
  showToast('TODO가 수정되었습니다.', 'success')
  
  // 데이터 새로고침
  await loadTodo()
}

// 상태 변경
const changeStatus = async (status: TodoStatus) => {
  if (!todo.value?.id) return
  
  try {
    isUpdating.value = true
    const result = await todoOps.updateStatusWithFeedback(todo.value.id, status)
    
    if (result.success) {
      // 데이터 새로고침
      await loadTodo()
    }
  } catch (err) {
    console.error('상태 변경 실패:', err)
  } finally {
    isUpdating.value = false
  }
}

// 삭제 처리
const handleDelete = async () => {
  if (!todo.value?.id) return
  
  try {
    isDeleting.value = true
    const result = await todoOps.deleteTodoWithConfirm(todo.value.id)
    
    if (result.success) {
      router.push('/todos')
    }
  } catch (err) {
    console.error('삭제 실패:', err)
  } finally {
    isDeleting.value = false
  }
}

// 컴포넌트 마운트 시 TODO 로드
onMounted(() => {
  loadTodo()
})
</script>

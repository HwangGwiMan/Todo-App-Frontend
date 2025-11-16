<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Toast Notification -->
    <ToastNotification ref="toastRef" />

    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">TodoApp</h1>
        <div class="flex items-center gap-4">
          <span class="text-gray-700">{{ authStore.username }}</span>
          <button @click="handleLogout" class="btn-secondary text-sm">
            로그아웃
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Stats -->
      <div v-if="todoStore.stats" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="card">
          <p class="text-sm text-gray-600">전체</p>
          <p class="text-2xl font-bold">{{ todoStore.stats.totalCount }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600">할 일</p>
          <p class="text-2xl font-bold text-blue-600">{{ todoStore.stats.todoCount }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600">진행중</p>
          <p class="text-2xl font-bold text-yellow-600">{{ todoStore.stats.inProgressCount }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600">완료</p>
          <p class="text-2xl font-bold text-green-600">{{ todoStore.stats.doneCount }}</p>
        </div>
      </div>

      <!-- Filter/Sort Bar -->
      <FilterSortBar v-model:filters="filters" />

      <!-- TODO List -->
      <div class="card">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">할 일 목록</h2>
          <button @click="showCreateModal = true" class="btn-primary">
            + 새 TODO
          </button>
        </div>
        
        <!-- Loading -->
        <LoadingSpinner :is-loading="todoStore.loading" />
        
        <!-- Empty State -->
        <div
          v-if="!todoStore.loading && todoStore.todos.length === 0"
          class="text-center py-12 text-gray-500"
        >
          TODO가 없습니다. 새로운 TODO를 추가해보세요!
        </div>
        
        <!-- TODO Grid -->
        <div
          v-else-if="!todoStore.loading"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <TodoCard
            v-for="todo in todoStore.todos"
            :key="todo.id || 0"
            :todo="todo"
            @edit="handleEdit"
            @delete="handleDelete"
            @status-change="handleStatusChange"
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todo'
import { useToast } from '@/composables/useToast'
import { useErrorHandler } from '@/composables/useErrorHandler'
import TodoCard from '@/components/TodoCard.vue'
import TodoCreateModal from '@/components/TodoCreateModal.vue'
import TodoEditModal from '@/components/TodoEditModal.vue'
import FilterSortBar from '@/components/FilterSortBar.vue'
import Pagination from '@/components/Pagination.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import type { TodoResponse, TodoRequest, TodoSearchRequest } from '@/client'

const router = useRouter()
const authStore = useAuthStore()
const todoStore = useTodoStore()
const { setToastRef, showError, showSuccess } = useToast()
const { handleError } = useErrorHandler()

const toastRef = ref<InstanceType<typeof ToastNotification> | null>(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedTodo = ref<TodoResponse | null>(null)
const pageSize = ref(12)

const filters = ref<TodoSearchRequest>({
  page: 0,
  size: pageSize.value,
  sortBy: 'createdAt',
  sortDirection: 'DESC'
})

onMounted(async () => {
  setToastRef(toastRef.value)
  
  try {
    await Promise.all([
      todoStore.fetchTodos(filters.value),
      todoStore.fetchStats()
    ])
  } catch (error) {
    handleError(error, '데이터 로딩 중 오류가 발생했습니다.')
    showError('데이터를 불러오는데 실패했습니다.')
  }
})

watch(filters, async (newFilters) => {
  try {
    await todoStore.fetchTodos(newFilters)
  } catch (error) {
    handleError(error, 'TODO 목록 조회 중 오류가 발생했습니다.')
    showError('TODO 목록을 불러오는데 실패했습니다.')
  }
}, { deep: true })

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const handleCreate = async (todoData: TodoRequest) => {
  try {
    await todoStore.createTodo(todoData)
    showCreateModal.value = false
    showSuccess('TODO가 생성되었습니다.')
    await todoStore.fetchStats()
    await todoStore.fetchTodos(filters.value)
  } catch (error) {
    handleError(error, 'TODO 생성 중 오류가 발생했습니다.')
    showError('TODO 생성에 실패했습니다.')
  }
}

const handleEdit = (todo: TodoResponse) => {
  selectedTodo.value = todo
  showEditModal.value = true
}

const handleUpdate = async (id: number, todoData: TodoRequest) => {
  try {
    console.log('handleUpdate', id, todoData)
    await todoStore.updateTodo(id, todoData)
    showEditModal.value = false
    selectedTodo.value = null
    showSuccess('TODO가 수정되었습니다.')
    await todoStore.fetchStats()
    await todoStore.fetchTodos(filters.value)
  } catch (error) {
    handleError(error, 'TODO 수정 중 오류가 발생했습니다.')
    showError('TODO 수정에 실패했습니다.')
  }
}

const handleDelete = async (id: number) => {
  try {
    await todoStore.deleteTodo(id)
    showSuccess('TODO가 삭제되었습니다.')
    await todoStore.fetchStats()
    await todoStore.fetchTodos(filters.value)
  } catch (error) {
    handleError(error, 'TODO 삭제 중 오류가 발생했습니다.')
    showError('TODO 삭제에 실패했습니다.')
  }
}

const handleStatusChange = async (id: number, status: string) => {
  try {
    await todoStore.updateTodoStatus(id, status as 'TODO' | 'IN_PROGRESS' | 'DONE')
    showSuccess('상태가 변경되었습니다.')
    await todoStore.fetchStats()
    await todoStore.fetchTodos(filters.value)
  } catch (error) {
    handleError(error, '상태 변경 중 오류가 발생했습니다.')
    showError('상태 변경에 실패했습니다.')
  }
}

const handlePageChange = async (page: number) => {
  filters.value = {
    ...filters.value,
    page
  }
}
</script>
<template>
    <Teleport to="body">
      <div
        v-if="isOpen && todo"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="handleClose"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-gray-900">TODO 수정</h2>
              <button
                @click="handleClose"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
  
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- 제목 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  제목 <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  class="input-field"
                  :class="{ 'border-red-500': hasFieldError('title') }"
                  placeholder="TODO 제목을 입력하세요"
                  required
                />
                <p v-if="hasFieldError('title')" class="mt-1 text-sm text-red-500">
                  {{ getFieldError('title') }}
                </p>
              </div>
  
              <!-- 설명 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  v-model="form.description"
                  class="input-field"
                  rows="3"
                  placeholder="TODO 설명을 입력하세요"
                />
              </div>
  
              <!-- 상태 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  상태
                </label>
                <select v-model="form.status" class="input-field">
                  <option value="TODO">할 일</option>
                  <option value="IN_PROGRESS">진행중</option>
                  <option value="DONE">완료</option>
                </select>
              </div>
  
              <!-- 우선순위 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  우선순위
                </label>
                <select v-model="form.priority" class="input-field">
                  <option value="LOW">낮음</option>
                  <option value="MEDIUM">보통</option>
                  <option value="HIGH">높음</option>
                </select>
              </div>
  
              <!-- 마감일 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  마감일
                </label>
                <input
                  v-model="form.dueDate"
                  type="datetime-local"
                  class="input-field"
                />
              </div>
  
              <!-- 에러 메시지 -->
              <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-600">{{ error }}</p>
              </div>
  
              <!-- 버튼 -->
              <div class="flex gap-3 pt-4">
                <button
                  type="button"
                  @click="handleClose"
                  class="flex-1 btn-secondary"
                  :disabled="loading"
                >
                  취소
                </button>
                <button
                  type="submit"
                  class="flex-1 btn-primary"
                  :disabled="loading"
                >
                  <span v-if="loading">수정 중...</span>
                  <span v-else>수정</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useErrorHandler } from '@/composables/useErrorHandler'
  import type { TodoResponse, TodoRequest } from '@/client'
  
  interface Props {
    isOpen: boolean
    todo: TodoResponse | null
  }
  
  const props = defineProps<Props>()
  
  const emit = defineEmits<{
    close: []
    updated: [id: number, todo: TodoRequest]
  }>()
  
  const { error, handleError, clearError, getFieldError, hasFieldError } = useErrorHandler()
  
  const loading = ref(false)
  const form = ref<TodoRequest>({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: undefined
  })
  
  watch(() => [props.isOpen, props.todo], ([isOpen, todo]) => {
    if (isOpen && todo) {
      loadTodoData(todo)
    }
  })
  
  const loadTodoData = (todo: TodoResponse) => {
    // datetime-local 형식으로 변환 (YYYY-MM-DDTHH:mm)
    let dueDateValue = ''
    if (todo.dueDate) {
      try {
        const date = new Date(todo.dueDate)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        dueDateValue = `${year}-${month}-${day}T${hours}:${minutes}`
      } catch {
        dueDateValue = ''
      }
    }
  
    form.value = {
      title: todo.title || '',
      description: todo.description || '',
      status: (todo.status as 'TODO' | 'IN_PROGRESS' | 'DONE') || 'TODO',
      priority: (todo.priority as 'HIGH' | 'MEDIUM' | 'LOW') || 'MEDIUM',
      dueDate: dueDateValue || undefined
    }
    clearError()
  }
  
  const handleClose = () => {
    if (!loading.value) {
      emit('close')
    }
  }
  
  const handleSubmit = async () => {
    if (!props.todo?.id) return
  
    clearError()
    loading.value = true
  
    try {
      const todoData: TodoRequest = {
        title: form.value.title,
        description: form.value.description || undefined,
        status: form.value.status,
        priority: form.value.priority,
        dueDate: form.value.dueDate || undefined
      }
  
      emit('updated', props.todo.id, todoData)
      handleClose()
    } catch (err) {
      handleError(err, 'TODO 수정 중 오류가 발생했습니다.')
    } finally {
      loading.value = false
    }
  }
  </script>
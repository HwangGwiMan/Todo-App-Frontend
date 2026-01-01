<template>
  <div
    class="card hover:shadow-md transition-shadow cursor-pointer"
    @click="handleClick"
  >
    <div class="flex justify-between items-start mb-3">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">
          {{ todo.title }}
        </h3>
        <p
          class="text-sm text-gray-600 line-clamp-2 overflow-hidden"
          style="height: 2.5rem; word-break: break-word;"
        >
          {{ todo.description }}
        </p>
      </div>
      <div class="flex gap-2 ml-4">
        <button
          class="text-gray-500 hover:text-blue-600 transition-colors"
          title="수정"
          @click.stop="handleEdit"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          class="text-gray-500 hover:text-red-600 transition-colors"
          title="삭제"
          @click.stop="handleDelete"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
      
    <div class="flex items-center gap-3 flex-wrap">
      <!-- 상태 배지 -->
      <span
        :class="statusClass"
        class="px-2 py-1 rounded-full text-xs font-medium"
      >
        {{ statusText }}
      </span>
        
      <!-- 우선순위 배지 -->
      <span
        v-if="todo.priority"
        :class="priorityClass"
        class="px-2 py-1 rounded-full text-xs font-medium"
      >
        {{ priorityText }}
      </span>
        
      <!-- 마감일 -->
      <span
        v-if="todo.dueDate"
        class="text-xs text-gray-500 flex items-center gap-1"
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {{ formatDate(todo.dueDate) }}
      </span>
        
      <!-- 완료일 -->
      <span
        v-if="todo.completedAt"
        class="text-xs text-green-600 flex items-center gap-1"
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {{ formatDate(todo.completedAt) }} 완료
      </span>
    </div>
      
    <!-- 상태 변경 버튼 -->
    <div
      v-if="todo.status !== 'DONE'"
      class="mt-4 pt-4 border-t border-gray-200"
    >
      <button
        class="w-full btn-secondary text-sm"
        @click.stop="handleStatusChange"
      >
        {{ nextStatusText }}
      </button>
    </div>
  </div>

  <!-- Confirm Dialog -->
  <ConfirmDialog
    :is-open="showDeleteConfirm"
    title="TODO 삭제"
    message="정말로 이 TODO를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
    confirm-text="삭제"
    cancel-text="취소"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>
  
  <script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { format } from 'date-fns'
  import { ko } from 'date-fns/locale'
  import ConfirmDialog from './ConfirmDialog.vue'
  import type { TodoResponse } from '@/client'
  
  interface Props {
    todo: TodoResponse
  }
  
  const props = defineProps<Props>()
  
  const emit = defineEmits<{
    edit: [todo: TodoResponse]
    delete: [id: number]
    statusChange: [id: number, status: string]
  }>()
  
  const router = useRouter()
  
  const showDeleteConfirm = ref(false)
  
  const statusText = computed(() => {
    const statusMap: Record<string, string> = {
      TODO: '할 일',
      IN_PROGRESS: '진행중',
      DONE: '완료'
    }
    return statusMap[props.todo.status || 'TODO'] || props.todo.status
  })
  
  const statusClass = computed(() => {
    const classMap: Record<string, string> = {
      TODO: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      DONE: 'bg-green-100 text-green-800'
    }
    return classMap[props.todo.status || 'TODO'] || 'bg-gray-100 text-gray-800'
  })
  
  const priorityText = computed(() => {
    const priorityMap: Record<string, string> = {
      HIGH: '높음',
      MEDIUM: '보통',
      LOW: '낮음'
    }
    return priorityMap[props.todo.priority || 'MEDIUM'] || props.todo.priority
  })
  
  const priorityClass = computed(() => {
    const classMap: Record<string, string> = {
      HIGH: 'bg-red-100 text-red-800',
      MEDIUM: 'bg-orange-100 text-orange-800',
      LOW: 'bg-gray-100 text-gray-800'
    }
    return classMap[props.todo.priority || 'MEDIUM'] || 'bg-gray-100 text-gray-800'
  })
  
  const nextStatusText = computed(() => {
    if (props.todo.status === 'TODO') return '진행중으로 변경'
    if (props.todo.status === 'IN_PROGRESS') return '완료로 변경'
    return ''
  })
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    try {
      return format(new Date(dateString), 'yyyy년 MM월 dd일', { locale: ko })
    } catch {
      return dateString
    }
  }
  
  const handleClick = () => {
    if (props.todo.id) {
      router.push(`/todos/${props.todo.id}`)
    }
  }
  
  const handleEdit = () => {
    emit('edit', props.todo)
  }
  
  const handleDelete = () => {
    showDeleteConfirm.value = true
  }
  
  const confirmDelete = () => {
    if (props.todo.id) {
      emit('delete', props.todo.id)
    }
    showDeleteConfirm.value = false
  }
  
  const cancelDelete = () => {
    showDeleteConfirm.value = false
  }
  
  const handleStatusChange = () => {
    if (!props.todo.id) return
    
    let nextStatus = 'DONE'
    if (props.todo.status === 'TODO') {
      nextStatus = 'IN_PROGRESS'
    } else if (props.todo.status === 'IN_PROGRESS') {
      nextStatus = 'DONE'
    }
    
    emit('statusChange', props.todo.id, nextStatus)
  }
  </script>
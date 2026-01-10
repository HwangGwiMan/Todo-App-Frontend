<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click="handleClose"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-900">TODO 템플릿 관리</h2>
          <button
            class="text-gray-400 hover:text-gray-600"
            @click="handleClose"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- 템플릿 목록 -->
        <div v-if="templates.length > 0" class="space-y-3 mb-6">
          <div
            v-for="template in templates"
            :key="template.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 mb-1">
                  {{ template.name }}
                </h3>
                <p class="text-sm text-gray-600 mb-2">
                  {{ template.title }}
                </p>
                <div class="flex gap-2 text-xs text-gray-500">
                  <span v-if="template.priority">
                    우선순위: {{ getPriorityText(template.priority) }}
                  </span>
                  <span v-if="template.dueDate">
                    마감일: {{ formatDate(template.dueDate) }}
                  </span>
                </div>
              </div>
              <div class="flex gap-2 ml-4">
                <button
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  @click="handleUseTemplate(template)"
                >
                  사용
                </button>
                <button
                  class="text-red-600 hover:text-red-800 text-sm font-medium"
                  @click="handleDeleteTemplate(template.id)"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 빈 상태 -->
        <EmptyState
          v-else
          icon="📋"
          title="템플릿이 없습니다"
          message="TODO에서 템플릿을 저장하면 여기에 표시됩니다."
        />

        <!-- 닫기 버튼 -->
        <div class="flex justify-end mt-6">
          <button
            class="btn-secondary"
            @click="handleClose"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Teleport } from 'vue'
import EmptyState from './EmptyState.vue'
import {
  getTodoTemplates,
  deleteTodoTemplate,
  type TodoTemplate
} from '@/types/template'
import type { TodoRequest } from '@/client'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  useTemplate: [data: TodoRequest]
}>()

const templates = ref<TodoTemplate[]>([])

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    loadTemplates()
  }
})

const loadTemplates = () => {
  templates.value = getTodoTemplates()
}

const handleClose = () => {
  emit('close')
}

const handleUseTemplate = (template: TodoTemplate) => {
  const templateData: TodoRequest = {
    title: template.title,
    description: template.description || undefined,
    status: 'TODO',
    priority: template.priority as 'HIGH' | 'MEDIUM' | 'LOW' || 'MEDIUM',
    dueDate: template.dueDate || undefined,
    projectId: template.projectId || undefined
  }
  
  emit('useTemplate', templateData)
  handleClose()
}

const handleDeleteTemplate = (templateId: number) => {
  if (confirm('이 템플릿을 삭제하시겠습니까?')) {
    deleteTodoTemplate(templateId)
    loadTemplates()
  }
}

const getPriorityText = (priority: string | null) => {
  const map: Record<string, string> = {
    HIGH: '높음',
    MEDIUM: '보통',
    LOW: '낮음'
  }
  return map[priority || 'MEDIUM'] || priority
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return ''
  try {
    return format(new Date(dateString), 'yyyy년 MM월 dd일', { locale: ko })
  } catch {
    return dateString
  }
}
</script>


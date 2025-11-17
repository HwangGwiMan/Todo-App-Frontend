<template>
  <div
    v-if="isOpen && project"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="closeModal"
  >
    <div
      class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
      @click.stop
    >
      <!-- 모달 헤더 -->
      <div class="flex items-center justify-between pb-3">
        <h3 class="text-lg font-medium text-gray-900">프로젝트 수정</h3>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 폼 -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- 프로젝트명 -->
        <div>
          <label for="edit-name" class="block text-sm font-medium text-gray-700 mb-1">
            프로젝트명 <span class="text-red-500">*</span>
          </label>
          <input
            id="edit-name"
            v-model="form.name"
            type="text"
            required
            maxlength="100"
            class="input-field w-full"
            :class="{ 'border-red-300': errors.name }"
            placeholder="프로젝트명을 입력하세요"
          >
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">
            {{ errors.name }}
          </p>
        </div>

        <!-- 설명 -->
        <div>
          <label for="edit-description" class="block text-sm font-medium text-gray-700 mb-1">
            설명
          </label>
          <textarea
            id="edit-description"
            v-model="form.description"
            rows="3"
            class="input-field w-full resize-none"
            placeholder="프로젝트에 대한 설명을 입력하세요"
          ></textarea>
        </div>

        <!-- 색상 선택 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            프로젝트 색상
          </label>
          <div class="flex space-x-2">
            <button
              v-for="color in colorOptions"
              :key="color.value"
              type="button"
              @click="form.color = color.value"
              class="w-8 h-8 rounded-full border-2 transition-all duration-200"
              :style="{ backgroundColor: color.value }"
              :class="{
                'border-gray-800 scale-110': form.color === color.value,
                'border-gray-300 hover:scale-105': form.color !== color.value
              }"
              :title="color.name"
            >
              <svg
                v-if="form.color === color.value"
                class="w-4 h-4 text-white mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 기본 프로젝트 설정 -->
        <div class="flex items-center">
          <input
            id="edit-isDefault"
            v-model="form.isDefault"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          >
          <label for="edit-isDefault" class="ml-2 block text-sm text-gray-700">
            기본 프로젝트로 설정
          </label>
        </div>

        <!-- 기본 프로젝트 경고 -->
        <div v-if="project?.isDefault && !form.isDefault" class="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div class="flex">
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div class="ml-3">
              <p class="text-sm text-yellow-800">
                기본 프로젝트 설정을 해제하면 다른 프로젝트를 기본으로 설정해야 할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        <!-- 버튼들 -->
        <div class="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            @click="closeModal"
            class="btn-secondary"
            :disabled="isSubmitting"
          >
            취소
          </button>
          <button
            type="submit"
            class="btn-primary"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              수정 중...
            </span>
            <span v-else>수정</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue'
import type { ProjectRequest, ProjectResponse } from '@/client'

interface Props {
  isOpen: boolean
  project: ProjectResponse | null
}

interface Emits {
  close: []
  updated: [projectId: number, projectData: ProjectRequest]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 폼 데이터
const form = reactive<ProjectRequest>({
  name: '',
  description: '',
  color: '#3B82F6',
  isDefault: false,
  position: undefined
})

// 에러 상태
const errors = reactive({
  name: ''
})

// 로딩 상태
const isSubmitting = ref(false)

// 색상 옵션
const colorOptions = [
  { name: '파랑', value: '#3B82F6' },
  { name: '초록', value: '#10B981' },
  { name: '빨강', value: '#EF4444' },
  { name: '노랑', value: '#F59E0B' },
  { name: '보라', value: '#8B5CF6' },
  { name: '분홍', value: '#EC4899' },
  { name: '청록', value: '#14B8A6' },
  { name: '주황', value: '#F97316' }
]

// 폼에 프로젝트 데이터 로드
const loadProjectData = (project: ProjectResponse) => {
  form.name = project.name || ''
  form.description = project.description || ''
  form.color = project.color || '#3B82F6'
  form.isDefault = project.isDefault || false
  form.position = project.position
  
  errors.name = ''
  isSubmitting.value = false
}

// 폼 검증
const validateForm = (): boolean => {
  errors.name = ''
  
  if (!form.name.trim()) {
    errors.name = '프로젝트명은 필수입니다.'
    return false
  }
  
  if (form.name.length > 100) {
    errors.name = '프로젝트명은 100자 이하여야 합니다.'
    return false
  }
  
  return true
}

// 폼 제출
const handleSubmit = async () => {
  if (!props.project?.id || !validateForm()) {
    return
  }
  
  try {
    isSubmitting.value = true
    
    const projectData: ProjectRequest = {
      name: form.name.trim(),
      description: form.description?.trim() || undefined,
      color: form.color,
      isDefault: form.isDefault,
      position: form.position
    }
    
    emit('updated', props.project.id, projectData)
    
  } catch (error) {
    console.error('프로젝트 수정 오류:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 모달 닫기
const closeModal = () => {
  if (!isSubmitting.value) {
    emit('close')
  }
}

// 모달이 열릴 때 프로젝트 데이터 로드
watch(() => [props.isOpen, props.project], ([newIsOpen, newProject]) => {
  if (newIsOpen && newProject) {
    loadProjectData(newProject)
    
    // 포커스를 첫 번째 입력 필드로 이동
    nextTick(() => {
      const nameInput = document.getElementById('edit-name')
      if (nameInput) {
        nameInput.focus()
      }
    })
  }
}, { immediate: true })
</script>

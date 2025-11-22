<template>
  <div class="card group hover:shadow-md transition-shadow duration-200">
    <!-- 프로젝트 헤더 -->
    <div class="flex items-start justify-between">
      <div class="flex items-start space-x-3 flex-1">
        <!-- 프로젝트 색상 인디케이터 -->
        <div
          class="w-4 h-4 rounded-full flex-shrink-0 mt-1"
          :style="{ backgroundColor: project.color || '#3B82F6' }"
        />
        
        <!-- 프로젝트 정보 -->
        <div class="flex-1">
          <div class="flex items-center space-x-2">
            <h3 class="font-semibold text-gray-900">
              {{ project.name }}
            </h3>
            
            <!-- 기본 프로젝트 배지 -->
            <span
              v-if="project.isDefault"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              기본
            </span>
          </div>
          
          <!-- 프로젝트 설명 -->
          <p
            v-if="project.description"
            class="mt-1 text-sm text-gray-600 line-clamp-2"
          >
            {{ project.description }}
          </p>
          
          <!-- 통계 정보 -->
          <div class="mt-2 flex items-center space-x-4 text-xs text-gray-500">
            <span class="flex items-center">
              <svg
                class="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              {{ project.todoCount || 0 }}개 할 일
            </span>
            
            <span class="flex items-center">
              <svg
                class="w-4 h-4 mr-1"
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
              {{ formatDate(project.createdAt) }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- 액션 버튼들 -->
      <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          title="프로젝트 수정"
          @click="$emit('edit', project)"
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        
        <button
          v-if="!project.isDefault"
          class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          title="프로젝트 삭제"
          @click="$emit('delete', project)"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
        
        <button
          class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
          title="프로젝트 선택"
          @click="$emit('select', project)"
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjectResponse } from '@/client'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface Props {
  project: ProjectResponse
}

interface Emits {
  edit: [project: ProjectResponse]
  delete: [project: ProjectResponse]
  select: [project: ProjectResponse]
}

defineProps<Props>()
defineEmits<Emits>()

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    return format(date, 'MM/dd', { locale: ko })
  } catch {
    return '-'
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

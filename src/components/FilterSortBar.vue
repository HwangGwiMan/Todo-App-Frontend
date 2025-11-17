<template>
  <div class="card mb-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <!-- 검색 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">검색</label>
        <input
          v-model="localFilters.keyword"
          type="text"
          class="input-field"
          placeholder="제목, 설명 검색..."
          @input="handleFilterChange"
        />
      </div>

      <!-- 프로젝트 필터 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">프로젝트</label>
        <select
          v-model="localFilters.projectId"
          class="input-field"
          @change="handleFilterChange"
        >
          <option value="">전체 프로젝트</option>
          <option
            v-for="project in projectOptions"
            :key="project.value"
            :value="project.value"
          >
            {{ project.label }}
            <span v-if="project.isDefault" class="text-blue-600">(기본)</span>
          </option>
        </select>
      </div>

      <!-- 상태 필터 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">상태</label>
        <select
          v-model="localFilters.status"
          class="input-field"
          @change="handleFilterChange"
        >
          <option value="">전체</option>
          <option value="TODO">할 일</option>
          <option value="IN_PROGRESS">진행중</option>
          <option value="DONE">완료</option>
        </select>
      </div>

      <!-- 우선순위 필터 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">우선순위</label>
        <select
          v-model="localFilters.priority"
          class="input-field"
          @change="handleFilterChange"
        >
          <option value="">전체</option>
          <option value="HIGH">높음</option>
          <option value="MEDIUM">보통</option>
          <option value="LOW">낮음</option>
        </select>
      </div>

      <!-- 정렬 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">정렬</label>
        <div class="flex gap-2">
          <select
            v-model="localFilters.sortBy"
            class="input-field flex-1"
            @change="handleFilterChange"
          >
            <option value="createdAt">생성일</option>
            <option value="dueDate">마감일</option>
            <option value="priority">우선순위</option>
            <option value="title">제목</option>
          </select>
          <select
            v-model="localFilters.sortDirection"
            class="input-field w-24"
            @change="handleFilterChange"
          >
            <option value="DESC">내림차순</option>
            <option value="ASC">오름차순</option>
          </select>
        </div>
      </div>
    </div>
  
      <!-- 필터 초기화 버튼 -->
      <div class="mt-4 flex justify-end">
        <button
          @click="handleReset"
          class="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          필터 초기화
        </button>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TodoSearchRequest } from '@/client'

interface ProjectOption {
  value: number
  label: string
  color?: string
  isDefault?: boolean
}

interface Props {
  filters: TodoSearchRequest
  projectOptions?: ProjectOption[]
}

const props = withDefaults(defineProps<Props>(), {
  projectOptions: () => []
})

const emit = defineEmits<{
  'update:filters': [filters: TodoSearchRequest]
}>()

const localFilters = ref<TodoSearchRequest>({
  keyword: props.filters.keyword || '',
  projectId: props.filters.projectId || '',
  status: props.filters.status || '',
  priority: props.filters.priority || '',
  sortBy: props.filters.sortBy || 'createdAt',
  sortDirection: props.filters.sortDirection || 'DESC'
})

watch(() => props.filters, (newFilters) => {
  localFilters.value = {
    keyword: newFilters.keyword || '',
    projectId: newFilters.projectId || '',
    status: newFilters.status || '',
    priority: newFilters.priority || '',
    sortBy: newFilters.sortBy || 'createdAt',
    sortDirection: newFilters.sortDirection || 'DESC'
  }
}, { deep: true })

const handleFilterChange = () => {
  const filters: TodoSearchRequest = {
    ...localFilters.value,
    keyword: localFilters.value.keyword || undefined,
    projectId: localFilters.value.projectId ? Number(localFilters.value.projectId) : undefined,
    status: (localFilters.value.status as 'TODO' | 'IN_PROGRESS' | 'DONE') || undefined,
    priority: (localFilters.value.priority as 'HIGH' | 'MEDIUM' | 'LOW') || undefined,
    sortBy: (localFilters.value.sortBy as 'createdAt' | 'dueDate' | 'priority' | 'title') || 'createdAt',
    sortDirection: (localFilters.value.sortDirection as 'ASC' | 'DESC') || 'DESC',
    page: 0 // 필터 변경 시 첫 페이지로
  }
  emit('update:filters', filters)
}

const handleReset = () => {
  localFilters.value = {
    keyword: '',
    projectId: '',
    status: '',
    priority: '',
    sortBy: 'createdAt',
    sortDirection: 'DESC'
  }
  handleFilterChange()
}
  </script>
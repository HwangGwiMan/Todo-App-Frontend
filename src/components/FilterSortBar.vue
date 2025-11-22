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
      <SelectField
        v-model="localFilters.projectId"
        label="프로젝트"
        :options="projectSelectOptions"
        @change="handleFilterChange"
      />

      <!-- 상태 필터 -->
      <SelectField
        v-model="localFilters.status"
        label="상태"
        :options="statusOptions"
        @change="handleFilterChange"
      />

      <!-- 우선순위 필터 -->
      <SelectField
        v-model="localFilters.priority"
        label="우선순위"
        :options="priorityOptions"
        @change="handleFilterChange"
      />

      <!-- 정렬 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">정렬</label>
        <div class="flex gap-2">
          <SelectField
            v-model="localFilters.sortBy"
            :options="sortByOptions"
            select-class="input-field flex-1"
            @change="handleFilterChange"
          />
          <SelectField
            v-model="localFilters.sortDirection"
            :options="sortDirectionOptions"
            select-class="input-field w-24"
            @change="handleFilterChange"
          />
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
import { ref, watch, computed } from 'vue'
import type { TodoSearchRequest } from '@/client'
import SelectField from './SelectField.vue'

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

// localFilters는 v-model과 함께 사용되므로 빈 문자열을 허용하는 별도 타입 사용
type LocalFilters = Omit<TodoSearchRequest, 'projectId' | 'status' | 'priority'> & {
  projectId?: number | null | string
  keyword?: string | null
  status?: string
  priority?: string
}

const localFilters = ref<LocalFilters>({
  keyword: props.filters.keyword || '',
  projectId: props.filters.projectId ?? '',
  status: props.filters.status || '',
  priority: props.filters.priority || '',
  sortBy: props.filters.sortBy || 'createdAt',
  sortDirection: props.filters.sortDirection || 'DESC'
})

watch(() => props.filters, (newFilters) => {
  localFilters.value = {
    keyword: newFilters.keyword || '',
    projectId: newFilters.projectId ?? '',
    status: newFilters.status || '',
    priority: newFilters.priority || '',
    sortBy: newFilters.sortBy || 'createdAt',
    sortDirection: newFilters.sortDirection || 'DESC'
  }
}, { deep: true })

// SelectField용 옵션 데이터
const projectSelectOptions = computed(() => [
  { value: '', label: '전체 프로젝트' },
  ...props.projectOptions.map(project => ({
    value: project.value,
    label: project.label,
    isDefault: project.isDefault
  }))
])

const statusOptions = computed(() => [
  { value: '', label: '전체' },
  { value: 'TODO', label: '할 일' },
  { value: 'IN_PROGRESS', label: '진행중' },
  { value: 'DONE', label: '완료' }
])

const priorityOptions = computed(() => [
  { value: '', label: '전체' },
  { value: 'HIGH', label: '높음' },
  { value: 'MEDIUM', label: '보통' },
  { value: 'LOW', label: '낮음' }
])

const sortByOptions = computed(() => [
  { value: 'createdAt', label: '생성일' },
  { value: 'dueDate', label: '마감일' },
  { value: 'priority', label: '우선순위' },
  { value: 'title', label: '제목' }
])

const sortDirectionOptions = computed(() => [
  { value: 'DESC', label: '내림차순' },
  { value: 'ASC', label: '오름차순' }
])

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
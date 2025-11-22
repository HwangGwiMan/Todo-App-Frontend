<template>
  <div
    v-if="totalPages > 1"
    class="flex items-center justify-between border-t border-gray-200 pt-4"
  >
    <div class="text-sm text-gray-700">
      전체 <span class="font-medium">{{ totalElements }}</span>개 중
      <span class="font-medium">{{ startItem }}</span>-
      <span class="font-medium">{{ endItem }}</span>개 표시
    </div>
      
    <div class="flex gap-2">
      <button
        :disabled="currentPage === 0"
        class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="$emit('pageChange', currentPage - 1)"
      >
        이전
      </button>
        
      <div class="flex gap-1">
        <button
          v-for="page in visiblePages"
          :key="page"
          :class="[
            'px-3 py-2 border rounded-lg text-sm font-medium',
            page === currentPage
              ? 'bg-primary-600 text-white border-primary-600'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          ]"
          @click="$emit('pageChange', page)"
        >
          {{ page + 1 }}
        </button>
      </div>
        
      <button
        :disabled="currentPage >= totalPages - 1"
        class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="$emit('pageChange', currentPage + 1)"
      >
        다음
      </button>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  interface Props {
    currentPage: number
    totalPages: number
    totalElements: number
    pageSize: number
  }
  
  const props = defineProps<Props>()
  
  defineEmits<{
    pageChange: [page: number]
  }>()
  
  const startItem = computed(() => {
    return props.currentPage * props.pageSize + 1
  })
  
  const endItem = computed(() => {
    const end = (props.currentPage + 1) * props.pageSize
    return Math.min(end, props.totalElements)
  })
  
  const visiblePages = computed(() => {
    const pages: number[] = []
    const maxVisible = 5
    let start = Math.max(0, props.currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(props.totalPages - 1, start + maxVisible - 1)
    
    if (end - start < maxVisible - 1) {
      start = Math.max(0, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  })
  </script>
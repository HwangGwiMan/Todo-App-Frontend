<template>
  <div
    v-if="hasError"
    class="flex flex-col items-center justify-center py-12"
  >
    <div class="text-6xl mb-4">
      ⚠️
    </div>
    <h3 class="text-xl font-semibold text-red-600 mb-2">
      오류가 발생했습니다
    </h3>
    <p class="text-gray-500 mb-6">
      {{ errorMessage }}
    </p>
    <button
      class="btn-primary"
      @click="resetError"
    >
      다시 시도
    </button>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')

const resetError = () => {
  hasError.value = false
  errorMessage.value = ''
}

onErrorCaptured((error: Error) => {
  hasError.value = true
  errorMessage.value = error.message || '알 수 없는 오류가 발생했습니다'
  console.error('ErrorBoundary caught an error:', error)
  return false // 에러 전파 중지
})
</script>
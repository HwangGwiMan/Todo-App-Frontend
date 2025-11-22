<template>
  <div
    v-if="isLoading"
    class="flex items-center justify-center py-12"
  >
    <div class="relative">
      <div class="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  interface Props {
    isLoading: boolean
  }
  
  defineProps<Props>()
  </script>
  
  <style scoped>
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  </style>
<template>
  <div v-if="isLoading" class="fixed inset-0 z-40 flex items-center justify-center bg-white bg-opacity-75">
    <LoadingSpinner :size="size" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

interface Props {
  isLoading: boolean
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  size: 'md'
})
</script>
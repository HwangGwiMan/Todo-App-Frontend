<template>
  <div class="flex flex-col items-center justify-center py-12">
    <div class="text-6xl mb-4">
      {{ icon }}
    </div>
    <h3 class="text-xl font-semibold text-gray-700 mb-2">
      {{ title }}
    </h3>
    <p class="text-gray-500 mb-6">
      {{ message }}
    </p>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  icon: string
  title: string
  message: string
}

defineProps<Props>()
</script>
<template>
  <div
    id="app"
    class="min-h-screen"
  >
    <ErrorBoundary>
      <RouterView />
    </ErrorBoundary>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
</script>


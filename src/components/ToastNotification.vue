<template>
    <Teleport to="body">
      <TransitionGroup
        name="toast"
        tag="div"
        class="fixed top-4 right-4 z-50 space-y-2"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="toastClass(toast.type)"
          class="min-w-[300px] max-w-md p-4 rounded-lg shadow-lg flex items-start gap-3"
        >
          <div class="flex-shrink-0">
            <svg
              v-if="toast.type === 'error'"
              class="w-5 h-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else-if="toast.type === 'success'"
              class="w-5 h-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else
              class="w-5 h-5 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium" :class="textClass(toast.type)">
              {{ toast.message }}
            </p>
          </div>
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  
  export type ToastType = 'error' | 'success' | 'info'
  
  export interface Toast {
    id: number
    message: string
    type: ToastType
    duration?: number
  }
  
  const toasts = ref<Toast[]>([])
  let toastIdCounter = 0
  const timers = new Map<number, NodeJS.Timeout>()
  
  const toastClass = (type: ToastType) => {
    const classes = {
      error: 'bg-red-50 border border-red-200',
      success: 'bg-green-50 border border-green-200',
      info: 'bg-blue-50 border border-blue-200'
    }
    return classes[type] || classes.info
  }
  
  const textClass = (type: ToastType) => {
    const classes = {
      error: 'text-red-800',
      success: 'text-green-800',
      info: 'text-blue-800'
    }
    return classes[type] || classes.info
  }
  
  const addToast = (message: string, type: ToastType = 'info', duration = 5000) => {
    const id = toastIdCounter++
    const toast: Toast = { id, message, type, duration }
    toasts.value.push(toast)
  
    if (duration > 0) {
      const timer = setTimeout(() => {
        removeToast(id)
      }, duration)
      timers.set(id, timer)
    }
  }
  
  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
    const timer = timers.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }
  }
  
  onUnmounted(() => {
    timers.forEach(timer => clearTimeout(timer))
    timers.clear()
  })
  
  defineExpose({
    addToast,
    removeToast
  })
  </script>
  
  <style scoped>
  .toast-enter-active,
  .toast-leave-active {
    transition: all 0.3s ease;
  }
  
  .toast-enter-from {
    opacity: 0;
    transform: translateX(100%);
  }
  
  .toast-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }
  </style>
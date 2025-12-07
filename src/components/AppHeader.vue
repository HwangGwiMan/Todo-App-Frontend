<template>
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">
        TodoApp
      </h1>
      <div class="flex items-center gap-4">
        <span class="text-gray-700">{{ username }}</span>
        <button
          class="btn-secondary text-sm"
          @click="handleLogout"
        >
          로그아웃
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = computed(() => authStore.username)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

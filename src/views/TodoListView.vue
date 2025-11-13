<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">TodoApp</h1>
        <div class="flex items-center gap-4">
          <span class="text-gray-700">{{ authStore.username }}</span>
          <button @click="handleLogout" class="btn-secondary text-sm">
            로그아웃
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Stats -->
      <div v-if="todoStore.stats" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="card">
          <p class="text-sm text-gray-600">전체</p>
          <p class="text-2xl font-bold">{{ todoStore.stats.totalCount }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600">할 일</p>
          <p class="text-2xl font-bold text-blue-600">{{ todoStore.stats.todoCount }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600">진행중</p>
          <p class="text-2xl font-bold text-yellow-600">{{ todoStore.stats.inProgressCount }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600">완료</p>
          <p class="text-2xl font-bold text-green-600">{{ todoStore.stats.doneCount }}</p>
        </div>
      </div>

      <!-- TODO List Placeholder -->
      <div class="card">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">할 일 목록</h2>
          <button class="btn-primary">+ 새 TODO</button>
        </div>
        
        <div v-if="todoStore.loading" class="text-center py-12 text-gray-500">
          로딩 중...
        </div>
        
        <div v-else-if="todoStore.todos.length === 0" class="text-center py-12 text-gray-500">
          TODO가 없습니다. 새로운 TODO를 추가해보세요!
        </div>
        
        <div v-else>
          <!-- TODO 항목들이 여기에 표시됩니다 (Phase 1에서 구현) -->
          <p class="text-gray-600">TODO 목록 UI는 Phase 1에서 구현됩니다.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todo'

const router = useRouter()
const authStore = useAuthStore()
const todoStore = useTodoStore()

onMounted(async () => {
  try {
    await Promise.all([
      todoStore.fetchTodos(),
      todoStore.fetchStats()
    ])
  } catch (error) {
    console.error('데이터 로딩 실패:', error)
  }
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>


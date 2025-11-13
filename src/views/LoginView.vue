<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          로그인
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          TodoApp에 오신 것을 환영합니다
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">사용자명</label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              required
              class="input-field rounded-t-lg rounded-b-none"
              placeholder="사용자명"
            />
          </div>
          <div>
            <label for="password" class="sr-only">비밀번호</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="input-field rounded-t-none rounded-b-lg"
              placeholder="비밀번호"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="loading"
          >
            {{ loading ? '로그인 중...' : '로그인' }}
          </button>
        </div>

        <div class="text-center">
          <router-link to="/signup" class="text-primary-600 hover:text-primary-700 text-sm">
            계정이 없으신가요? 회원가입
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await authStore.login(form.value)
    router.push('/todos')
  } catch (err: any) {
    error.value = err.body?.message || err.message || '로그인에 실패했습니다.'
  } finally {
    loading.value = false
  }
}
</script>


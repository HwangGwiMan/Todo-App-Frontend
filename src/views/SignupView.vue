<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          회원가입
        </h2>
      </div>
      <form
        class="mt-8 space-y-6"
        @submit.prevent="handleSignup"
      >
        <div class="space-y-4">
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-gray-700"
            >사용자명</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="input-field mt-1"
              placeholder="사용자명"
            >
          </div>
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700"
            >이메일</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field mt-1"
              placeholder="email@example.com"
            >
          </div>
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
            >비밀번호</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="input-field mt-1"
              placeholder="비밀번호"
            >
          </div>
        </div>

        <div
          v-if="error"
          class="text-red-600 text-sm text-center"
        >
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="loading"
          >
            {{ loading ? '가입 중...' : '회원가입' }}
          </button>
        </div>

        <div class="text-center">
          <router-link
            to="/login"
            class="text-primary-600 hover:text-primary-700 text-sm"
          >
            이미 계정이 있으신가요? 로그인
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
import { useErrorHandler } from '@/composables/useErrorHandler'

const router = useRouter()
const authStore = useAuthStore()
const { error, handleError, clearError } = useErrorHandler()

const form = ref({
  username: '',
  email: '',
  password: ''
})

const loading = ref(false)

const handleSignup = async () => {
  loading.value = true
  clearError()

  try {
    await authStore.signup(form.value)
    router.push('/todos')
  } catch (err: unknown) {
    handleError(err, '회원가입에 실패했습니다.')
  } finally {
    loading.value = false
  }
}
</script>

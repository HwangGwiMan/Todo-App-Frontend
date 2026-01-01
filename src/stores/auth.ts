import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, signup as signupApi } from '@/client'
import type { LoginRequest, SignupRequest, AuthResponse } from '@/client'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<AuthResponse | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  )

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const username = computed(() => user.value?.username || '')
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  // Actions
  const login = async (credentials: LoginRequest): Promise<AuthResponse | null> => {
    const response = await loginApi({
      body: credentials,
      throwOnError: true
    })
    const authData = response.data?.data
    
    if (authData && authData.token) {
      token.value = authData.token
      user.value = authData
      
      // LocalStorage에 저장
      localStorage.setItem('token', authData.token)
      localStorage.setItem('user', JSON.stringify(authData))
      return authData
    }
    
    return null
  }

  const signup = async (data: SignupRequest): Promise<AuthResponse | null> => {
    const response = await signupApi({
      body: data,
      throwOnError: true
    })
    const authData = response.data?.data
    
    if (authData && authData.token) {
      token.value = authData.token
      user.value = authData
      
      // LocalStorage에 저장
      localStorage.setItem('token', authData.token)
      localStorage.setItem('user', JSON.stringify(authData))
      return authData
    }
    
    return null
  }

  const logout = (): void => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    token,
    user,
    isAuthenticated,
    username,
    isAdmin,
    login,
    signup,
    logout
  }
})


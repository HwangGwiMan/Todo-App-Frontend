import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Service } from '@/api'
import type { LoginRequest, SignupRequest, AuthResponse } from '@/api'

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
  const login = async (credentials: LoginRequest) => {
    try {
      const response = await Service.login(credentials)
      const authData = response.data
      
      if (authData && authData.token) {
        token.value = authData.token
        user.value = authData
        
        // LocalStorage에 저장
        localStorage.setItem('token', authData.token)
        localStorage.setItem('user', JSON.stringify(authData))
      }
      
      return authData
    } catch (error) {
      throw error
    }
  }

  const signup = async (data: SignupRequest) => {
    try {
      const response = await Service.signup(data)
      const authData = response.data
      
      if (authData && authData.token) {
        token.value = authData.token
        user.value = authData
        
        // LocalStorage에 저장
        localStorage.setItem('token', authData.token)
        localStorage.setItem('user', JSON.stringify(authData))
      }
      
      return authData
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
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


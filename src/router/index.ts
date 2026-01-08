import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guard - 인증 체크
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !authStore.isAuthenticated) {
    // 인증이 필요한 페이지인데 로그인하지 않은 경우
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (!requiresAuth && authStore.isAuthenticated && (to.name === 'Login' || to.name === 'Signup')) {
    // 이미 로그인한 상태에서 로그인/회원가입 페이지 접근 시
    next({ name: 'Todos' })
  } else {
    next()
  }
})

export default router


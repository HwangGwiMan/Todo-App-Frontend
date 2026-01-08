import type { RouteRecordRaw } from 'vue-router'

// 1. views 폴더 내의 모든 .vue 파일을 동적으로 가져옵니다.
const modules = import.meta.glob('../views/*.vue')

// 2. 파일명에 따른 라우트 설정을 정의합니다. (기존 경로 유지 및 커스텀 설정)
const routeOverrides: Record<string, Partial<RouteRecordRaw>> = {
  'LoginView': { path: '/login', meta: { requiresAuth: false } },
  'SignupView': { path: '/signup', meta: { requiresAuth: false } },
  'TodoListView': { path: '/todos', name: 'Todos' },
  'TodoDetailView': { path: '/todos/:id', name: 'TodoDetail' },
  'DashboardView': { path: '/dashboard', name: 'Dashboard' },
  'NotFoundView': { path: '/:pathMatch(.*)*', name: 'NotFound', meta: { requiresAuth: false } }
}

// 3. 동적으로 라우트 생성
const viewRoutes: RouteRecordRaw[] = Object.keys(modules).map((path) => {
  // 파일 경로에서 컴포넌트 이름 추출 (예: ../views/LoginView.vue -> LoginView)
  const fileName = path.split('/').pop()?.replace('.vue', '') || ''
  
  // 기본 라우트 설정
  // View 접미사 제거 및 소문자 변환 (예: AboutView -> /about)
  const name = fileName.replace('View', '')
  const defaultPath = `/${name.toLowerCase()}`
  
  const route: RouteRecordRaw = {
    path: defaultPath,
    name: name,
    component: modules[path],
    meta: { requiresAuth: true } // 기본적으로 인증 필요 (보안 강화)
  }

  // 오버라이드 설정이 있다면 덮어쓰기
  if (routeOverrides[fileName]) {
    Object.assign(route, routeOverrides[fileName])
  }

  return route
})

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/todos'
  },
  ...viewRoutes
]
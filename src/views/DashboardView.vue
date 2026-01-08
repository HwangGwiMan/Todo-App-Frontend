<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Toast Notification -->
    <ToastNotification ref="toastRef" />

    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <router-link
            to="/todos"
            class="text-gray-600 hover:text-gray-900"
          >
            ← 할 일 목록
          </router-link>
          <h1 class="text-2xl font-bold text-gray-900">
            대시보드
          </h1>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-gray-700">{{ authStore.username }}</span>
          <button
            class="btn-secondary text-sm"
            @click="handleLogout"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Loading -->
      <LoadingSpinner :is-loading="loading" />

      <!-- Dashboard Content -->
      <div v-if="!loading && dashboardStats">
        <!-- 기본 통계 카드 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div class="card">
            <p class="text-sm text-gray-600">
              전체
            </p>
            <p class="text-2xl font-bold">
              {{ dashboardStats.basicStats?.totalCount || 0 }}
            </p>
          </div>
          <div class="card">
            <p class="text-sm text-gray-600">
              할 일
            </p>
            <p class="text-2xl font-bold text-blue-600">
              {{ dashboardStats.basicStats?.todoCount || 0 }}
            </p>
          </div>
          <div class="card">
            <p class="text-sm text-gray-600">
              진행중
            </p>
            <p class="text-2xl font-bold text-yellow-600">
              {{ dashboardStats.basicStats?.inProgressCount || 0 }}
            </p>
          </div>
          <div class="card">
            <p class="text-sm text-gray-600">
              완료
            </p>
            <p class="text-2xl font-bold text-green-600">
              {{ dashboardStats.basicStats?.doneCount || 0 }}
            </p>
          </div>
          <div class="card">
            <p class="text-sm text-gray-600">
              완료율
            </p>
            <p class="text-2xl font-bold text-green-600">
              {{ Math.round(dashboardStats.basicStats?.completionRate || 0) }}%
            </p>
            <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-green-600 h-2 rounded-full transition-all"
                :style="{ width: `${dashboardStats.basicStats?.completionRate || 0}%` }"
              />
            </div>
          </div>
          <div class="card">
            <p class="text-sm text-gray-600">
              지난 마감일
            </p>
            <p class="text-2xl font-bold text-red-600">
              {{ dashboardStats.basicStats?.overdueCount || 0 }}
            </p>
          </div>
        </div>

        <!-- 차트 섹션 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- 상태별 분포 파이 차트 -->
          <div class="card">
            <h3 class="text-lg font-semibold mb-4">
              상태별 분포
            </h3>
            <div class="h-64">
              <PieChart
                v-if="statusChartData"
                :data="statusChartData"
              />
            </div>
          </div>

          <!-- 우선순위별 분포 파이 차트 -->
          <div class="card">
            <h3 class="text-lg font-semibold mb-4">
              우선순위별 분포
            </h3>
            <div class="h-64">
              <PieChart
                v-if="priorityChartData"
                :data="priorityChartData"
              />
            </div>
          </div>
        </div>

        <!-- 프로젝트별 통계 -->
        <div class="card mb-6">
          <h3 class="text-lg font-semibold mb-4">
            프로젝트별 통계
          </h3>
          <div class="h-64">
            <BarChart
              v-if="projectChartData"
              :data="projectChartData"
            />
          </div>
        </div>

        <!-- 프로젝트별 상세 리스트 -->
        <div class="card">
          <h3 class="text-lg font-semibold mb-4">
            프로젝트별 상세
          </h3>
          <div class="space-y-2">
            <div
              v-for="project in dashboardStats.projectStats"
              :key="project.projectId || 'no-project'"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-4 h-4 rounded-full"
                  :style="{ backgroundColor: project.projectColor || '#9CA3AF' }"
                />
                <span class="font-medium">{{ project.projectName || '알 수 없음' }}</span>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-sm text-gray-600">
                  {{ project.todoCount || 0 }}개 ({{ Math.round(project.percentage || 0) }}%)
                </span>
                <div class="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all"
                    :style="{ 
                      width: `${project.percentage || 0}%`,
                      backgroundColor: project.projectColor || '#9CA3AF'
                    }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todo'
import { useToast } from '@/composables/useToast'
import { useErrorHandler } from '@/composables/useErrorHandler'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { TodoDashboardStatsResponse } from '@/client'
import type { ToastNotificationInstance } from '@/types/common'
import ToastNotification from '@/components/ToastNotification.vue'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'

const router = useRouter()
const authStore = useAuthStore()
const todoStore = useTodoStore()
const { setToastRef, showError } = useToast()
const { handleError } = useErrorHandler()

const toastRef = ref<ToastNotificationInstance | null>(null)
const loading = ref(false)
const dashboardStats = ref<TodoDashboardStatsResponse | null>(null)

// 상태별 차트 데이터
const statusChartData = computed(() => {
  if (!dashboardStats.value?.statusStats || dashboardStats.value.statusStats.length === 0) return null

  return {
    labels: dashboardStats.value.statusStats.map(s => {
      const statusMap: Record<string, string> = {
        'TODO': '할 일',
        'IN_PROGRESS': '진행중',
        'DONE': '완료'
      }
      return statusMap[s.status || ''] || s.status || ''
    }),
    datasets: [{
      data: dashboardStats.value.statusStats.map(s => s.count || 0),
      backgroundColor: [
        '#3B82F6', // 할 일 - 파란색
        '#F59E0B', // 진행중 - 노란색
        '#10B981'  // 완료 - 초록색
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  }
})

// 우선순위별 차트 데이터
const priorityChartData = computed(() => {
  if (!dashboardStats.value?.priorityStats || dashboardStats.value.priorityStats.length === 0) return null

  return {
    labels: dashboardStats.value.priorityStats.map(p => {
      const priorityMap: Record<string, string> = {
        'HIGH': '높음',
        'MEDIUM': '중간',
        'LOW': '낮음'
      }
      return priorityMap[p.priority || ''] || p.priority || ''
    }),
    datasets: [{
      data: dashboardStats.value.priorityStats.map(p => p.count || 0),
      backgroundColor: [
        '#EF4444', // 높음 - 빨간색
        '#F59E0B', // 중간 - 노란색
        '#10B981'  // 낮음 - 초록색
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  }
})

// 프로젝트별 차트 데이터
const projectChartData = computed(() => {
  if (!dashboardStats.value?.projectStats || dashboardStats.value.projectStats.length === 0) return null

  return {
    labels: dashboardStats.value.projectStats.map(p => p.projectName || '알 수 없음'),
    datasets: [{
      label: 'TODO 개수',
      data: dashboardStats.value.projectStats.map(p => p.todoCount || 0),
      backgroundColor: dashboardStats.value.projectStats.map(p => p.projectColor || '#9CA3AF'),
      borderWidth: 1,
      borderColor: '#E5E7EB'
    }]
  }
})

onMounted(async () => {
  setToastRef(toastRef.value)
  
  try {
    loading.value = true
    dashboardStats.value = await todoStore.fetchDashboardStats()
  } catch (error) {
    handleError(error, '대시보드 데이터 로딩 중 오류가 발생했습니다.')
    showError('대시보드 데이터를 불러오는데 실패했습니다.')
  } finally {
    loading.value = false
  }
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>


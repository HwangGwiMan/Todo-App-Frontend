import { ref } from 'vue'
import type { ToastType } from '@/components/ToastNotification.vue'

const toastRef = ref<InstanceType<typeof import('@/components/ToastNotification.vue')> | null>(null)

export function useToast() {
  const setToastRef = (ref: InstanceType<typeof import('@/components/ToastNotification.vue')> | null) => {
    toastRef.value = ref
  }

  const showToast = (message: string, type: ToastType = 'info', duration = 5000) => {
    if (toastRef.value) {
      toastRef.value.addToast(message, type, duration)
    } else {
      console.warn('ToastNotification 컴포넌트가 마운트되지 않았습니다.')
    }
  }

  const showError = (message: string, duration = 5000) => {
    showToast(message, 'error', duration)
  }

  const showSuccess = (message: string, duration = 3000) => {
    showToast(message, 'success', duration)
  }

  const showInfo = (message: string, duration = 3000) => {
    showToast(message, 'info', duration)
  }

  return {
    setToastRef,
    showToast,
    showError,
    showSuccess,
    showInfo
  }
}
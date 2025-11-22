import { ref, type Ref } from 'vue'
import { parseApiError, getErrorMessage, getFieldErrors } from '@/utils/errorHandler'

export function useErrorHandler() {
  const error: Ref<string> = ref('')
  const fieldErrors: Ref<Record<string, string>> = ref({})
  
  /**
   * 에러 처리 및 상태 업데이트
   */
  const handleError = (err: unknown, defaultMessage?: string) => {
    const parsed = parseApiError(err)
    error.value = parsed.message || defaultMessage || '오류가 발생했습니다.'
    
    if (parsed.fieldErrors) {
      fieldErrors.value = parsed.fieldErrors
    } else {
      fieldErrors.value = {}
    }
  }
  
  /**
   * 에러 초기화
   */
  const clearError = () => {
    error.value = ''
    fieldErrors.value = {}
  }
  
  /**
   * 특정 필드의 에러 메시지 가져오기
   */
  const getFieldError = (fieldName: string): string | undefined => {
    return fieldErrors.value[fieldName]
  }
  
  /**
   * 특정 필드에 에러가 있는지 확인
   */
  const hasFieldError = (fieldName: string): boolean => {
    return !!fieldErrors.value[fieldName]
  }
  
  return {
    error,
    fieldErrors,
    handleError,
    clearError,
    getFieldError,
    hasFieldError,
    // 유틸리티 함수들도 export
    parseApiError,
    getErrorMessage,
    getFieldErrors
  }
}
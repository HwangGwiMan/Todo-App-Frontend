import { ref } from 'vue'

/**
 * 폼 검증을 위한 Composable
 * 
 * 일관된 검증 로직과 에러 메시지 관리
 */
export function useFormValidation() {
  const errors = ref<Record<string, string>>({})

  /**
   * 필수 필드 검증
   */
  const validateRequired = (
    value: string | null | undefined,
    fieldName: string
  ): boolean => {
    if (!value || value.trim() === '') {
      errors.value[fieldName] = `${fieldName}은(는) 필수입니다.`
      return false
    }
    delete errors.value[fieldName]
    return true
  }

  /**
   * 최대 길이 검증
   */
  const validateMaxLength = (
    value: string,
    max: number,
    fieldName: string
  ): boolean => {
    if (value.length > max) {
      errors.value[fieldName] = `${fieldName}은(는) ${max}자 이하여야 합니다.`
      return false
    }
    delete errors.value[fieldName]
    return true
  }

  /**
   * 최소 길이 검증
   */
  const validateMinLength = (
    value: string,
    min: number,
    fieldName: string
  ): boolean => {
    if (value.length < min) {
      errors.value[fieldName] = `${fieldName}은(는) ${min}자 이상이어야 합니다.`
      return false
    }
    delete errors.value[fieldName]
    return true
  }

  /**
   * 이메일 형식 검증
   */
  const validateEmail = (value: string, fieldName: string = '이메일'): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      errors.value[fieldName] = '올바른 이메일 형식이 아닙니다.'
      return false
    }
    delete errors.value[fieldName]
    return true
  }

  /**
   * 숫자 범위 검증
   */
  const validateRange = (
    value: number,
    min: number,
    max: number,
    fieldName: string
  ): boolean => {
    if (value < min || value > max) {
      errors.value[fieldName] = `${fieldName}은(는) ${min}에서 ${max} 사이여야 합니다.`
      return false
    }
    delete errors.value[fieldName]
    return true
  }

  /**
   * 패턴 검증
   */
  const validatePattern = (
    value: string,
    pattern: RegExp,
    fieldName: string,
    errorMessage: string
  ): boolean => {
    if (!pattern.test(value)) {
      errors.value[fieldName] = errorMessage
      return false
    }
    delete errors.value[fieldName]
    return true
  }

  /**
   * 특정 필드의 에러 설정
   */
  const setError = (fieldName: string, errorMessage: string) => {
    errors.value[fieldName] = errorMessage
  }

  /**
   * 특정 필드의 에러 제거
   */
  const clearError = (fieldName: string) => {
    delete errors.value[fieldName]
  }

  /**
   * 모든 에러 제거
   */
  const clearErrors = () => {
    errors.value = {}
  }

  /**
   * 특정 필드에 에러가 있는지 확인
   */
  const hasError = (fieldName: string): boolean => {
    return fieldName in errors.value
  }

  /**
   * 에러가 하나라도 있는지 확인
   */
  const hasErrors = (): boolean => {
    return Object.keys(errors.value).length > 0
  }

  /**
   * 특정 필드의 에러 메시지 가져오기
   */
  const getError = (fieldName: string): string | undefined => {
    return errors.value[fieldName]
  }

  return {
    errors,
    validateRequired,
    validateMaxLength,
    validateMinLength,
    validateEmail,
    validateRange,
    validatePattern,
    setError,
    clearError,
    clearErrors,
    hasError,
    hasErrors,
    getError
  }
}


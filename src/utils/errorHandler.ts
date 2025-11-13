import { ApiError } from '@/api/core/ApiError'

/**
 * 백엔드 ApiResponse 형식의 에러 응답 파싱
 */
export interface ParsedError {
  message: string
  fieldErrors?: Record<string, string>
  status: number
  statusText: string
}

/**
 * ApiError를 파싱하여 사용하기 쉬운 형태로 변환
 */
export function parseApiError(error: unknown): ParsedError {
  // ApiError인지 확인
  if (error instanceof ApiError) {
    const errorBody = error.body
    
    // ApiResponse 형식인지 확인 (success, message, data 필드 존재)
    if (errorBody && typeof errorBody === 'object') {
      // 필드별 에러가 있는 경우 (validation 에러)
      if (errorBody.data && typeof errorBody.data === 'object' && !Array.isArray(errorBody.data)) {
        const fieldErrors: Record<string, string> = {}
        let firstMessage = ''
        
        // 필드별 에러 메시지 추출
        Object.entries(errorBody.data).forEach(([field, message]) => {
          if (typeof message === 'string') {
            fieldErrors[field] = message
            if (!firstMessage) {
              firstMessage = message
            }
          }
        })

        return {
          message: errorBody.message || firstMessage || '입력 정보를 확인해주세요.',
          fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
          status: error.status,
          statusText: error.statusText
        }
      }
      
      // 단일 에러 메시지
      return {
        message: errorBody.message || error.message || '요청 처리 중 오류가 발생했습니다.',
        status: error.status,
        statusText: error.statusText
      }
    }
    
    // ApiResponse 형식이 아닌 경우
    return {
      message: error.message || '요청 처리 중 오류가 발생했습니다.',
      status: error.status,
      statusText: error.statusText
    }
  }
  
  // 일반 Error 객체인 경우
  if (error instanceof Error) {
    return {
      message: error.message || '알 수 없는 오류가 발생했습니다.',
      status: 0,
      statusText: 'Unknown Error'
    }
  }
  
  // 그 외의 경우
  return {
    message: '알 수 없는 오류가 발생했습니다.',
    status: 0,
    statusText: 'Unknown Error'
  }
}

/**
 * 에러에서 메시지만 추출 (간단한 사용)
 */
export function getErrorMessage(error: unknown, defaultMessage: string = '오류가 발생했습니다.'): string {
  return parseApiError(error).message || defaultMessage
}

/**
 * 에러에서 필드별 에러만 추출
 */
export function getFieldErrors(error: unknown): Record<string, string> | undefined {
  return parseApiError(error).fieldErrors
}
import type { AxiosError } from 'axios'

/**
 * 백엔드 ApiResponse 형식의 에러 응답 파싱
 */
export interface ParsedError {
  message: string
  fieldErrors?: Record<string, string>
  status: number
  statusText: string
  code?: string
}

/**
 * HTTP 상태 코드별 기본 에러 메시지
 */
const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: '잘못된 요청입니다. 입력 정보를 확인해주세요.',
  401: '인증이 필요합니다. 다시 로그인해주세요.',
  403: '접근 권한이 없습니다.',
  404: '요청한 리소스를 찾을 수 없습니다.',
  409: '이미 존재하는 데이터입니다.',
  422: '입력 데이터를 확인해주세요.',
  429: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  502: '서버가 응답하지 않습니다.',
  503: '서비스를 일시적으로 사용할 수 없습니다.',
  504: '서버 응답 시간이 초과되었습니다.'
}

/**
 * HTTP 상태 코드에 대한 기본 메시지 반환
 */
function getDefaultErrorMessage(status: number): string {
  return HTTP_ERROR_MESSAGES[status] || '오류가 발생했습니다.'
}

/**
 * AxiosError를 파싱하여 사용하기 쉬운 형태로 변환
 */
export function parseApiError(error: unknown): ParsedError {
  // AxiosError인지 확인
  if (isAxiosError(error)) {
    const response = error.response
    const errorData = response?.data
    const status = response?.status || 0
    
    // ApiResponse 형식인지 확인 (success, message, data 필드 존재)
    if (errorData && typeof errorData === 'object' && 'message' in errorData) {
      // 타입 단언을 위한 타입 가드
      const apiResponse = errorData as { 
        message?: string
        data?: unknown
        code?: string
      }
      
      // 필드별 에러가 있는 경우 (validation 에러)
      if (apiResponse.data && typeof apiResponse.data === 'object' && !Array.isArray(apiResponse.data)) {
        const fieldErrors: Record<string, string> = {}
        let firstMessage = ''
        
        // 필드별 에러 메시지 추출
        Object.entries(apiResponse.data).forEach(([field, message]) => {
          if (typeof message === 'string') {
            fieldErrors[field] = message
            if (!firstMessage) {
              firstMessage = message
            }
          }
        })

        return {
          message: (typeof apiResponse.message === 'string' ? apiResponse.message : '') || 
                   firstMessage || 
                   getDefaultErrorMessage(status),
          fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
          status,
          statusText: response?.statusText || 'Unknown Error',
          code: apiResponse.code
        }
      }
      
      // 단일 에러 메시지 (백엔드에서 제공한 메시지 우선, 없으면 HTTP 상태 코드 기본 메시지)
      return {
        message: (typeof apiResponse.message === 'string' && apiResponse.message) 
          ? apiResponse.message 
          : getDefaultErrorMessage(status),
        status,
        statusText: response?.statusText || 'Unknown Error',
        code: apiResponse.code
      }
    }
    
    // ApiResponse 형식이 아닌 경우 - HTTP 상태 코드 기본 메시지 사용
    return {
      message: getDefaultErrorMessage(status),
      status,
      statusText: response?.statusText || 'Unknown Error'
    }
  }
  
  // 네트워크 오류 (인터넷 연결 끊김 등)
  if (error instanceof Error && error.message === 'Network Error') {
    return {
      message: '네트워크 연결을 확인해주세요.',
      status: 0,
      statusText: 'Network Error'
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
 * AxiosError 타입 가드
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  )
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

/**
 * 특정 HTTP 상태 코드인지 확인
 */
export function isHttpStatus(error: unknown, status: number): boolean {
  return parseApiError(error).status === status
}

/**
 * 인증 오류인지 확인 (401)
 */
export function isUnauthorized(error: unknown): boolean {
  return isHttpStatus(error, 401)
}

/**
 * 권한 오류인지 확인 (403)
 */
export function isForbidden(error: unknown): boolean {
  return isHttpStatus(error, 403)
}

/**
 * 존재하지 않는 리소스 오류인지 확인 (404)
 */
export function isNotFound(error: unknown): boolean {
  return isHttpStatus(error, 404)
}

/**
 * 서버 오류인지 확인 (5xx)
 */
export function isServerError(error: unknown): boolean {
  const status = parseApiError(error).status
  return status >= 500 && status < 600
}
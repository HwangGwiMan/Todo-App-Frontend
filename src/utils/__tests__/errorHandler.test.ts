// src/utils/__tests__/errorHandler.test.ts
import { describe, it, expect, vi } from 'vitest'
import { parseApiError, getDefaultErrorMessage } from '../errorHandler'
import type { AxiosError } from 'axios'

// Mock axios
vi.mock('axios', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isAxiosError: (error: any) => error.isAxiosError === true
}))

describe('errorHandler', () => {
  describe('getDefaultErrorMessage', () => {
    it('should return correct message for known status codes', () => {
      expect(getDefaultErrorMessage(400)).toBe('잘못된 요청입니다. 입력 정보를 확인해주세요.')
      expect(getDefaultErrorMessage(401)).toBe('인증이 필요합니다. 다시 로그인해주세요.')
      expect(getDefaultErrorMessage(403)).toBe('접근 권한이 없습니다.')
      expect(getDefaultErrorMessage(404)).toBe('요청한 리소스를 찾을 수 없습니다.')
      expect(getDefaultErrorMessage(500)).toBe('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    })

    it('should return default message for unknown status codes', () => {
      expect(getDefaultErrorMessage(999)).toBe('오류가 발생했습니다.')
    })
  })

  describe('parseApiError', () => {
    it('should parse AxiosError with field validation errors', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 422,
          statusText: 'Unprocessable Entity',
          data: {
            success: false,
            message: 'Validation failed',
            data: {
              title: '제목은 필수입니다.',
              description: '설명은 500자를 초과할 수 없습니다.'
            },
            code: 'VALIDATION_ERROR'
          }
        }
      } as AxiosError

      const result = parseApiError(axiosError)

      expect(result.message).toBe('Validation failed')
      expect(result.fieldErrors).toEqual({
        title: '제목은 필수입니다.',
        description: '설명은 500자를 초과할 수 없습니다.'
      })
      expect(result.status).toBe(422)
      expect(result.statusText).toBe('Unprocessable Entity')
      expect(result.code).toBe('VALIDATION_ERROR')
    })

    it('should parse AxiosError with simple error message', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
          statusText: 'Not Found',
          data: {
            success: false,
            message: 'TODO를 찾을 수 없습니다.',
            code: 'TODO_NOT_FOUND'
          }
        }
      } as AxiosError

      const result = parseApiError(axiosError)

      expect(result.message).toBe('TODO를 찾을 수 없습니다.')
      expect(result.fieldErrors).toBeUndefined()
      expect(result.status).toBe(404)
      expect(result.statusText).toBe('Not Found')
      expect(result.code).toBe('TODO_NOT_FOUND')
    })

    it('should use default message when backend message is empty', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          statusText: 'Internal Server Error',
          data: {
            success: false,
            message: '',
            code: 'INTERNAL_ERROR'
          }
        }
      } as AxiosError

      const result = parseApiError(axiosError)

      expect(result.message).toBe('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      expect(result.status).toBe(500)
      expect(result.code).toBe('INTERNAL_ERROR')
    })

    it('should handle network errors', () => {
      const networkError = new Error('Network Error')

      const result = parseApiError(networkError)

      expect(result.message).toBe('네트워크 연결을 확인해주세요.')
      expect(result.status).toBe(0)
      expect(result.statusText).toBe('Network Error')
    })

    it('should handle non-Axios errors', () => {
      const genericError = new Error('Something went wrong')

      const result = parseApiError(genericError)

      expect(result.message).toBe('Something went wrong')
      expect(result.status).toBe(0)
      expect(result.statusText).toBe('Unknown Error')
    })

    it('should handle null or undefined error', () => {
      const result = parseApiError(null)

      expect(result.message).toBe('알 수 없는 오류가 발생했습니다.')
      expect(result.status).toBe(0)
      expect(result.statusText).toBe('Unknown Error')
    })

    it('should handle malformed error data', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          statusText: 'Bad Request',
          data: 'invalid json string'
        }
      } as AxiosError

      const result = parseApiError(axiosError)

      expect(result.message).toBe('잘못된 요청입니다. 입력 정보를 확인해주세요.')
      expect(result.status).toBe(400)
      expect(result.statusText).toBe('Bad Request')
    })

    it('should handle field errors with non-string messages', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 422,
          statusText: 'Unprocessable Entity',
          data: {
            success: false,
            message: 'Validation failed',
            data: {
              title: ['제목은 필수입니다.', '제목은 2자 이상이어야 합니다.'],
              priority: 123 // non-string value
            }
          }
        }
      } as AxiosError

      const result = parseApiError(axiosError)

      expect(result.message).toBe('Validation failed')
      expect(result.fieldErrors).toBeUndefined() // Only string messages are processed
      expect(result.status).toBe(422)
    })
  })
})
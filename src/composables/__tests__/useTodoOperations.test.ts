// src/composables/__tests__/useTodoOperations.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTodoOperations } from '../useTodoOperations'
import type { TodoRequest, TodoResponse } from '@/client'

// Mock composables
vi.mock('@/stores/todo', () => ({
  useTodoStore: vi.fn(() => ({
    createTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn(),
    updateTodoStatus: vi.fn(),
    fetchTodos: vi.fn(),
    fetchStats: vi.fn()
  }))
}))

vi.mock('@/composables/useToast', () => ({
  useToast: vi.fn(() => ({
    showSuccess: vi.fn(),
    showError: vi.fn()
  }))
}))

describe('useTodoOperations', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('createTodoWithFeedback', () => {
    it('should create todo successfully and show success message', async () => {
      const { useTodoStore } = await import('@/stores/todo')
      const { useToast } = await import('@/composables/useToast')

      const mockStore = {
        createTodo: vi.fn().mockResolvedValue({ id: 1, title: 'Test Todo' } as TodoResponse)
      }
      const mockToast = {
        showSuccess: vi.fn(),
        showError: vi.fn()
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(useTodoStore as any).mockReturnValue(mockStore)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(useToast as any).mockReturnValue(mockToast)

      const { createTodoWithFeedback } = useTodoOperations()
      const mockData: TodoRequest = { title: 'Test Todo', description: 'Test description' }

      const result = await createTodoWithFeedback(mockData)

      expect(mockStore.createTodo).toHaveBeenCalledWith(mockData)
      expect(mockToast.showSuccess).toHaveBeenCalledWith('TODO가 생성되었습니다.')
      expect(result.success).toBe(true)
      expect(result.data).toEqual({ id: 1, title: 'Test Todo' })
    })

    it('should handle create todo error and show error message', async () => {
      const { useTodoStore } = await import('@/stores/todo')
      const { useToast } = await import('@/composables/useToast')

      const mockError = new Error('API Error')
      const mockStore = {
        createTodo: vi.fn().mockRejectedValue(mockError)
      }
      const mockToast = {
        showSuccess: vi.fn(),
        showError: vi.fn()
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(useTodoStore as any).mockReturnValue(mockStore)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(useToast as any).mockReturnValue(mockToast)

      const { createTodoWithFeedback } = useTodoOperations()
      const mockData: TodoRequest = { title: 'Test Todo' }

      const result = await createTodoWithFeedback(mockData)

      expect(mockStore.createTodo).toHaveBeenCalledWith(mockData)
      expect(mockToast.showError).toHaveBeenCalledWith('TODO 생성에 실패했습니다.')
      expect(result.success).toBe(false)
      expect(result.error).toBe(mockError)
    })
  })

  describe('updateTodoWithFeedback', () => {
    it('should update todo successfully and show success message', async () => {
      const { useTodoStore } = await import('@/stores/todo')
      const { useToast } = await import('@/composables/useToast')

      const mockStore = {
        updateTodo: vi.fn().mockResolvedValue({ id: 1, title: 'Updated Todo' } as TodoResponse)
      }
      const mockToast = {
        showSuccess: vi.fn(),
        showError: vi.fn()
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(useTodoStore as any).mockReturnValue(mockStore)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(useToast as any).mockReturnValue(mockToast)

      const { updateTodoWithFeedback } = useTodoOperations()
      const mockData: TodoRequest = { title: 'Updated Todo' }

      const result = await updateTodoWithFeedback(1, mockData)

      expect(mockStore.updateTodo).toHaveBeenCalledWith(1, mockData)
      expect(mockToast.showSuccess).toHaveBeenCalledWith('TODO가 수정되었습니다.')
      expect(result.success).toBe(true)
    })
  })

  describe('deleteTodoWithConfirm', () => {
    it('should delete todo when confirmed', async () => {
      const { useTodoStore } = await import('@/stores/todo')
      const { useToast } = await import('@/composables/useToast')

      // Mock window.confirm to return true
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

      const mockStore = {
        deleteTodo: vi.fn().mockResolvedValue(undefined)
      }
      const mockToast = {
        showSuccess: vi.fn(),
        showError: vi.fn()
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(useTodoStore as any).mockReturnValue(mockStore)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(useToast as any).mockReturnValue(mockToast)

      const { deleteTodoWithConfirm } = useTodoOperations()

      const result = await deleteTodoWithConfirm(1)

      expect(confirmSpy).toHaveBeenCalledWith('정말 삭제하시겠습니까?')
      expect(mockStore.deleteTodo).toHaveBeenCalledWith(1)
      expect(mockToast.showSuccess).toHaveBeenCalledWith('TODO가 삭제되었습니다.')
      expect(result.success).toBe(true)

      confirmSpy.mockRestore()
    })

    it('should cancel deletion when not confirmed', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

      const { deleteTodoWithConfirm } = useTodoOperations()

      const result = await deleteTodoWithConfirm(1)

      expect(confirmSpy).toHaveBeenCalledWith('정말 삭제하시겠습니까?')
      expect(result.success).toBe(false)
      expect(result.cancelled).toBe(true)

      confirmSpy.mockRestore()
    })
  })

  describe('updateStatusWithFeedback', () => {
    it('should update status successfully', async () => {
      const { useTodoStore } = await import('@/stores/todo')
      const { useToast } = await import('@/composables/useToast')

      const mockStore = {
        updateTodoStatus: vi.fn().mockResolvedValue({ id: 1, status: 'DONE' } as TodoResponse)
      }
      const mockToast = {
        showSuccess: vi.fn(),
        showError: vi.fn()
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(useTodoStore as any).mockReturnValue(mockStore)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(useToast as any).mockReturnValue(mockToast)

      const { updateStatusWithFeedback } = useTodoOperations()

      const result = await updateStatusWithFeedback(1, 'DONE')

      expect(mockStore.updateTodoStatus).toHaveBeenCalledWith(1, 'DONE')
      expect(mockToast.showSuccess).toHaveBeenCalledWith('상태가 변경되었습니다.')
      expect(result.success).toBe(true)
    })
  })

  describe('refreshTodos', () => {
    it('should refresh todos and stats successfully', async () => {
      const { useTodoStore } = await import('@/stores/todo')
      const { useToast } = await import('@/composables/useToast')

      const mockStore = {
        fetchTodos: vi.fn().mockResolvedValue(undefined),
        fetchStats: vi.fn().mockResolvedValue(undefined)
      }
      const mockToast = {
        showSuccess: vi.fn(),
        showError: vi.fn()
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(useTodoStore as any).mockReturnValue(mockStore)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(useToast as any).mockReturnValue(mockToast)

      const { refreshTodos } = useTodoOperations()

      const result = await refreshTodos()

      expect(mockStore.fetchTodos).toHaveBeenCalled()
      expect(mockStore.fetchStats).toHaveBeenCalled()
      expect(result.success).toBe(true)
    })
  })
})
// src/stores/__tests__/todo.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTodoStore } from '../todo'
import type { TodoResponse, TodoStatsResponse } from '@/client'

// Mock API client
vi.mock('@/client', () => ({
  getTodos: vi.fn(),
  getTodo: vi.fn(),
  createTodo: vi.fn(),
  updateTodo: vi.fn(),
  updateTodoStatus: vi.fn(),
  deleteTodo: vi.fn(),
  getUserStats: vi.fn(),
  getDashboardStats: vi.fn()
}))

describe('Todo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('fetchTodos', () => {
    it('should fetch and store todos successfully', async () => {
      const { getTodos } = await import('@/client')

      const mockTodos: TodoResponse[] = [
        { id: 1, title: 'Test Todo 1', status: 'TODO', createdAt: '2024-01-01T00:00:00Z' },
        { id: 2, title: 'Test Todo 2', status: 'DONE', createdAt: '2024-01-02T00:00:00Z' }
      ]

      const mockResponse = {
        data: {
          data: {
            content: mockTodos,
            totalPages: 1,
            totalElements: 2,
            number: 0
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(getTodos as any).mockResolvedValue(mockResponse)

      const todoStore = useTodoStore()
      await todoStore.fetchTodos()

      expect(getTodos).toHaveBeenCalled()
      expect(todoStore.todos).toHaveLength(2)
      expect(todoStore.todos[0].title).toBe('Test Todo 1')
      expect(todoStore.todos[1].title).toBe('Test Todo 2')
      expect(todoStore.totalElements).toBe(2)
      expect(todoStore.currentPage).toBe(0)
    })

    it('should handle empty response', async () => {
      const { getTodos } = await import('@/client')

      const mockResponse = {
        data: {
          data: {
            content: [],
            totalPages: 0,
            totalElements: 0,
            number: 0
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(getTodos as any).mockResolvedValue(mockResponse)

      const todoStore = useTodoStore()
      await todoStore.fetchTodos()

      expect(todoStore.todos).toHaveLength(0)
      expect(todoStore.totalElements).toBe(0)
    })
  })

  describe('createTodo', () => {
    it('should create todo and add to store', async () => {
      const { createTodo } = await import('@/client')

      const newTodo: TodoResponse = {
        id: 3,
        title: 'New Todo',
        status: 'TODO',
        createdAt: '2024-01-03T00:00:00Z'
      }

      const mockResponse = {
        data: {
          data: newTodo
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(createTodo as any).mockResolvedValue(mockResponse)

      const todoStore = useTodoStore()
      const result = await todoStore.createTodo({ title: 'New Todo' })

      expect(createTodo).toHaveBeenCalledWith({
        body: { title: 'New Todo' },
        throwOnError: true
      })
      expect(result).toEqual(newTodo)
      expect(todoStore.todos).toHaveLength(1)
      expect(todoStore.todos[0]).toEqual(newTodo)
    })
  })

  describe('updateTodo', () => {
    it('should update todo with optimistic updates', async () => {
      const { updateTodo, getTodos } = await import('@/client')

      // First add todo through fetchTodos
      const initialTodo: TodoResponse = {
        id: 1,
        title: 'Original Title',
        status: 'TODO',
        createdAt: '2024-01-01T00:00:00Z'
      }

      const fetchResponse = {
        data: {
          data: {
            content: [initialTodo],
            totalPages: 1,
            totalElements: 1,
            number: 0
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(getTodos as any).mockResolvedValue(fetchResponse)

      const updatedTodo: TodoResponse = {
        ...initialTodo,
        title: 'Updated Title'
      }

      const updateResponse = {
        data: {
          data: updatedTodo
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(updateTodo as any).mockResolvedValue(updateResponse)

      const todoStore = useTodoStore()
      await todoStore.fetchTodos() // Add todo to store

      const result = await todoStore.updateTodo(1, { title: 'Updated Title' })

      expect(updateTodo).toHaveBeenCalledWith({
        path: { todoId: 1 },
        body: { title: 'Updated Title' },
        throwOnError: true
      })
      expect(result).toEqual(updatedTodo)
      expect(todoStore.getTodoById(1)?.title).toBe('Updated Title')
    })

    it('should rollback on update failure', async () => {
      const { updateTodo, getTodos } = await import('@/client')

      const initialTodo: TodoResponse = {
        id: 1,
        title: 'Original Title',
        status: 'TODO',
        createdAt: '2024-01-01T00:00:00Z'
      }

      const fetchResponse = {
        data: {
          data: {
            content: [initialTodo],
            totalPages: 1,
            totalElements: 1,
            number: 0
          }
        }
      }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(getTodos as any).mockResolvedValue(fetchResponse)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(updateTodo as any).mockRejectedValue(new Error('API Error'))

      const todoStore = useTodoStore()
      await todoStore.fetchTodos() // Add todo to store

      await expect(todoStore.updateTodo(1, { title: 'Updated Title' })).rejects.toThrow('API Error')

      // Should rollback to original
      expect(todoStore.getTodoById(1)?.title).toBe('Original Title')
    })
  })

  describe('updateTodoStatus', () => {
    it('should update status with optimistic updates', async () => {
      const { updateTodoStatus, getTodos } = await import('@/client')

      const initialTodo: TodoResponse = {
        id: 1,
        title: 'Test Todo',
        status: 'TODO',
        createdAt: '2024-01-01T00:00:00Z'
      }

      const fetchResponse = {
        data: {
          data: {
            content: [initialTodo],
            totalPages: 1,
            totalElements: 1,
            number: 0
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(getTodos as any).mockResolvedValue(fetchResponse)

      const updatedTodo: TodoResponse = {
        ...initialTodo,
        status: 'DONE',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        completedAt: expect.any(String) as any
      }

      const updateResponse = {
        data: {
          data: updatedTodo
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(updateTodoStatus as any).mockResolvedValue(updateResponse)

      const todoStore = useTodoStore()
      await todoStore.fetchTodos() // Add todo to store

      const result = await todoStore.updateTodoStatus(1, 'DONE')

      expect(updateTodoStatus).toHaveBeenCalledWith({
        path: { todoId: 1 },
        query: { status: 'DONE' },
        throwOnError: true
      })
      expect(result?.status).toBe('DONE')
      expect(result?.completedAt).toBeDefined()
    })
  })

  describe('deleteTodo', () => {
    it('should delete todo from store', async () => {
      const { deleteTodo, getTodos } = await import('@/client')

      const todo: TodoResponse = {
        id: 1,
        title: 'Test Todo',
        status: 'TODO',
        createdAt: '2024-01-01T00:00:00Z'
      }

      const fetchResponse = {
        data: {
          data: {
            content: [todo],
            totalPages: 1,
            totalElements: 1,
            number: 0
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(getTodos as any).mockResolvedValue(fetchResponse)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(deleteTodo as any).mockResolvedValue({})

      const todoStore = useTodoStore()
      await todoStore.fetchTodos() // Add todo to store

      await todoStore.deleteTodo(1)

      expect(deleteTodo).toHaveBeenCalledWith({
        path: { todoId: 1 },
        throwOnError: true
      })
      expect(todoStore.todos).toHaveLength(0)
      expect(todoStore.getTodoById(1)).toBeUndefined()
    })
  })

  describe('fetchStats', () => {
    it('should fetch and store stats', async () => {
      const { getUserStats } = await import('@/client')

      const mockStats: TodoStatsResponse = {
        todoCount: 5,
        inProgressCount: 2,
        doneCount: 3,
        completionRate: 60
      }

      const mockResponse = {
        data: {
          data: mockStats
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(getUserStats as any).mockResolvedValue(mockResponse)

      const todoStore = useTodoStore()
      await todoStore.fetchStats()

      expect(getUserStats).toHaveBeenCalled()
      expect(todoStore.todoCount).toBe(5)
      expect(todoStore.inProgressCount).toBe(2)
      expect(todoStore.doneCount).toBe(3)
      expect(todoStore.completionRate).toBe(60)
    })
  })

  describe('getTodoById', () => {
    it('should return todo by id', async () => {
      const { getTodos } = await import('@/client')

      const todo: TodoResponse = {
        id: 1,
        title: 'Test Todo',
        status: 'TODO',
        createdAt: '2024-01-01T00:00:00Z'
      }

      const fetchResponse = {
        data: {
          data: {
            content: [todo],
            totalPages: 1,
            totalElements: 1,
            number: 0
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(getTodos as any).mockResolvedValue(fetchResponse)

      const todoStore = useTodoStore()
      await todoStore.fetchTodos() // Add todo to store

      expect(todoStore.getTodoById(1)).toEqual(todo)
      expect(todoStore.getTodoById(999)).toBeUndefined()
    })
  })
})
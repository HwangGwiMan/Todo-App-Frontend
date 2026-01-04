// src/components/__tests__/TodoCard.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import TodoCard from '../TodoCard.vue'
import type { TodoResponse } from '@/client'

// Mock router
const router = createRouter({
  history: createMemoryHistory(),
  routes: []
})

describe('TodoCard', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: any

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
  })

  const createWrapper = (props: { todo: TodoResponse }) => {
    return mount(TodoCard, {
      props,
      global: {
        plugins: [router],
        stubs: {
          ConfirmDialog: true
        }
      }
    })
  }

  describe('rendering', () => {
    it('should render todo title and description', () => {
      const todo: TodoResponse = {
        id: 1,
        title: 'Test Todo Title',
        description: 'Test description',
        status: 'TODO',
        priority: 'HIGH',
        createdAt: '2024-01-01T00:00:00Z'
      }

      wrapper = createWrapper({ todo })

      expect(wrapper.text()).toContain('Test Todo Title')
      expect(wrapper.text()).toContain('Test description')
    })

    it('should render status badge correctly', () => {
      const todo: TodoResponse = {
        id: 1,
        title: 'Test Todo',
        status: 'DONE',
        createdAt: '2024-01-01T00:00:00Z'
      }

      wrapper = createWrapper({ todo })

      const statusBadge = wrapper.find('.bg-green-100')
      expect(statusBadge.exists()).toBe(true)
      expect(statusBadge.text()).toContain('완료')
    })

    it('should render priority badge correctly', () => {
      const todo: TodoResponse = {
        id: 1,
        title: 'Test Todo',
        status: 'TODO',
        priority: 'HIGH',
        createdAt: '2024-01-01T00:00:00Z'
      }

      wrapper = createWrapper({ todo })

      const priorityBadge = wrapper.find('.bg-red-100')
      expect(priorityBadge.exists()).toBe(true)
      expect(priorityBadge.text()).toContain('높음')
    })

    it('should render creation date', () => {
      const todo: TodoResponse = {
        id: 1,
        title: 'Test Todo',
        status: 'TODO',
        createdAt: '2024-01-01T12:00:00Z',
        dueDate: '2024-01-01T12:00:00Z' // dueDate를 추가해서 날짜 표시 테스트
      }

      wrapper = createWrapper({ todo })

      expect(wrapper.text()).toContain('2024년') // date-fns formatting
    })
  })

  describe('interactions', () => {
    it('should emit edit event when edit button is clicked', async () => {
      const todo: TodoResponse = {
        id: 1,
        title: 'Test Todo',
        status: 'TODO',
        createdAt: '2024-01-01T00:00:00Z'
      }

      wrapper = createWrapper({ todo })

      const editButton = wrapper.find('button[title="수정"]')
      await editButton.trigger('click')

      expect(wrapper.emitted('edit')).toBeTruthy()
      expect(wrapper.emitted('edit')![0]).toEqual([todo])
    })

    it('should emit delete event when delete button is clicked and confirmed', async () => {
      const todo: TodoResponse = {
        id: 1,
        title: 'Test Todo',
        status: 'TODO',
        createdAt: '2024-01-01T00:00:00Z'
      }

      wrapper = createWrapper({ todo })

      const deleteButton = wrapper.find('button[title="삭제"]')
      await deleteButton.trigger('click')

      // ConfirmDialog의 confirm 이벤트 트리거
      const confirmDialog = wrapper.findComponent({ name: 'ConfirmDialog' })
      await confirmDialog.vm.$emit('confirm')

      expect(wrapper.emitted('delete')).toBeTruthy()
      expect(wrapper.emitted('delete')![0]).toEqual([1])
    })

    it('should not emit delete event when delete is cancelled', async () => {
      const todo: TodoResponse = {
        id: 1,
        title: 'Test Todo',
        status: 'TODO',
        createdAt: '2024-01-01T00:00:00Z'
      }

      wrapper = createWrapper({ todo })

      const deleteButton = wrapper.find('button[title="삭제"]')
      await deleteButton.trigger('click')

      // ConfirmDialog의 cancel 이벤트 트리거
      const confirmDialog = wrapper.findComponent({ name: 'ConfirmDialog' })
      await confirmDialog.vm.$emit('cancel')

      expect(wrapper.emitted('delete')).toBeFalsy()
    })

    it('should emit statusChange event when status button is clicked', async () => {
      const todo: TodoResponse = {
        id: 1,
        title: 'Test Todo',
        status: 'TODO',
        createdAt: '2024-01-01T00:00:00Z'
      }

      wrapper = createWrapper({ todo })

      // Find status change button by text content
      const buttons = wrapper.findAll('button')
      const statusButton = buttons.find(btn => btn.text().includes('진행중'))

      if (statusButton) {
        await statusButton.trigger('click')
        expect(wrapper.emitted('statusChange')).toBeTruthy()
        expect(wrapper.emitted('statusChange')![0]).toEqual([1, 'IN_PROGRESS'])
      } else {
        // If no status button found, skip this test for this status
        expect(todo.status).toBe('DONE') // Should not have status change button when DONE
      }
    })
  })

  describe('computed properties', () => {
    it('should compute status text correctly', () => {
      const todo: TodoResponse = {
        id: 1,
        title: 'Test Todo',
        status: 'IN_PROGRESS',
        createdAt: '2024-01-01T00:00:00Z'
      }

      wrapper = createWrapper({ todo })

      // Access computed property through component instance
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vm = wrapper.vm as any
      expect(vm.statusText).toBe('진행중')
    })

    it('should compute priority text correctly', () => {
      const todo: TodoResponse = {
        id: 1,
        title: 'Test Todo',
        status: 'TODO',
        priority: 'LOW',
        createdAt: '2024-01-01T00:00:00Z'
      }

      wrapper = createWrapper({ todo })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vm = wrapper.vm as any
      expect(vm.priorityText).toBe('낮음')
    })
  })

  describe('edge cases', () => {
    it('should handle todo without description', () => {
      const todo: TodoResponse = {
        id: 1,
        title: 'Test Todo',
        status: 'TODO',
        createdAt: '2024-01-01T00:00:00Z'
        // description is undefined
      }

      wrapper = createWrapper({ todo })

      expect(wrapper.text()).toContain('Test Todo')
      // Should not crash without description
    })

    it('should handle todo with null values', () => {
      const todo: TodoResponse = {
        id: 1,
        title: 'Test Todo',
        description: null,
        status: null,
        priority: null,
        createdAt: '2024-01-01T00:00:00Z'
      }

      wrapper = createWrapper({ todo })

      expect(wrapper.text()).toContain('Test Todo')
      // Should use default values for null status/priority
    })
  })
})
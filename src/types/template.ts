import type { TodoResponse } from '@/client'

export interface TodoTemplate {
  id: number
  name: string
  title: string
  description?: string | null
  priority?: string | null
  dueDate?: string | null
  projectId?: number | null
  createdAt: string
}

export function saveTodoAsTemplate(todo: TodoResponse, name: string): void {
  const templates = getTodoTemplates()
  const newTemplate: TodoTemplate = {
    id: Date.now(),
    name,
    title: todo.title || '',
    description: todo.description || null,
    priority: todo.priority || null,
    dueDate: todo.dueDate || null,
    projectId: todo.projectId || null,
    createdAt: new Date().toISOString()
  }
  
  templates.push(newTemplate)
  localStorage.setItem('todoTemplates', JSON.stringify(templates))
}

export function getTodoTemplates(): TodoTemplate[] {
  try {
    const stored = localStorage.getItem('todoTemplates')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function deleteTodoTemplate(templateId: number): void {
  const templates = getTodoTemplates()
  const filtered = templates.filter(t => t.id !== templateId)
  localStorage.setItem('todoTemplates', JSON.stringify(filtered))
}

export function getTodoTemplateById(templateId: number): TodoTemplate | null {
  const templates = getTodoTemplates()
  return templates.find(t => t.id === templateId) || null
}


# AI Coding Guidelines for TodoApp Frontend

## Architecture Overview
- **Vue 3 Composition API + TypeScript** frontend with Pinia state management
- **Generated API client** from OpenAPI spec using `@hey-api/openapi-ts` (run `npm run generate:api` after backend changes)
- **Composable pattern** for business logic: wrap store operations with toast feedback, loading states, and error handling
- **Authentication**: JWT tokens stored in localStorage, automatic injection via axios interceptors

## Key Patterns

### API Usage
```typescript
// Use generated client from src/client/
import { getTodos, createTodo } from '@/client'

// API calls automatically include auth tokens
const todos = await getTodos({ query: { page: 0, size: 20 } })
```

### State Management
```typescript
// Stores use Pinia composition API
export const useTodoStore = defineStore('todo', () => {
  const todosMap = ref<Map<number, TodoResponse>>(new Map())
  // Use Map for O(1) lookups, computed getters for arrays
})
```

### Business Logic
```typescript
// Composables wrap operations with feedback
export function useTodoOperations() {
  const createTodoWithFeedback = async (data: TodoRequest) => {
    try {
      const result = await todoStore.createTodo(data)
      showSuccess('TODO가 생성되었습니다.')
      return { success: true, data: result }
    } catch (e) {
      showError('TODO 생성에 실패했습니다.')
      return { success: false, error: e }
    }
  }
}
```

### Component Structure
- Use Tailwind CSS classes for styling
- Handle user interactions with `@click.stop` to prevent event bubbling
- Import composables for operations, not direct store calls in components

## Development Workflow
- **Generate API client**: `npm run generate:api` (requires backend running on :8080)
- **Development server**: `npm run dev` (runs on :5173, proxies /api to backend)
- **Linting**: `npm run lint` (auto-fixes with ESLint)
- **Type checking**: `npm run type-check` (Vue TSC)

## File Organization
- `src/client/`: Auto-generated API client (do not edit manually)
- `src/stores/`: Pinia stores (auth, todo, project)
- `src/composables/`: Business logic with user feedback
- `src/components/`: Reusable Vue components
- `src/views/`: Page-level components with routing
- `src/types/`: Re-exports of generated types

## Error Handling
- Use `useErrorHandler` composable for consistent error processing
- Axios interceptors handle 401 responses with logout and redirect
- Display errors via `useToast` composable

## Authentication Flow
- Login/signup store auth data in localStorage
- Router guards protect authenticated routes
- API client automatically includes Bearer tokens in requests</content>
<parameter name="filePath">c:\Projects\TodoApp9\frontend\.github\copilot-instructions.md
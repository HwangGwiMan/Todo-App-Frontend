// OpenAPI로 생성된 타입들을 재export
export type {
  // Auth
  AuthResponse,
  LoginRequest,
  SignupRequest,
  
  // Todo
  TodoResponse,
  TodoRequest,
  TodoSearchRequest,
  TodoStatsResponse,
  
  // Page
  PageTodoResponse,
  PageableObject,
  SortObject,
  
  // API Response
  ApiResponseAuthResponse,
  ApiResponseTodoResponse,
  ApiResponsePageTodoResponse,
  ApiResponseTodoStatsResponse,
  ApiResponseVoid
} from '@/client'

// 타입 별칭 정의
export type TodoStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type TodoPriority = 'HIGH' | 'MEDIUM' | 'LOW'


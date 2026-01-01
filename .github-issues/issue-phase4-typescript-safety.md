# Phase 4: TypeScript 타입 안전성 강화

## 📋 개요
공통 타입 정의를 추가하고 `any` 타입을 제거하여 타입 안전성을 강화합니다.

## 🎯 목표
- 타입 안전성 100% 달성
- `any` 타입 완전 제거
- 컴파일 타임 에러 감지 향상

## 📝 구현할 타입 정의

### types/index.ts 개선
```typescript
// API 응답 래퍼 타입
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
}

// 페이지네이션 타입
export interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
  first: boolean
  last: boolean
}

// 작업 결과 타입
export interface OperationResult<T = void> {
  success: boolean
  data?: T
  error?: Error
  cancelled?: boolean
}

// Form 상태 타입
export interface FormState<T> {
  data: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isValid: boolean
  isDirty: boolean
}
```

### 사용 예시
```typescript
const createTodo = async (
  data: TodoRequest
): Promise<OperationResult<TodoResponse>> => {
  try {
    const result = await todoStore.createTodo(data)
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}
```

## ✅ 체크리스트
- [x] 공통 타입 정의
- [x] Store의 모든 메서드 반환 타입 명시
- [x] Composable 타입 정의
- [x] `any` 타입 제거
- [x] 타입 가드 함수 작성
- [x] TypeScript strict 모드 검증

## ⏱️ 예상 소요 시간
2-3시간

## 🏷️ 레이블
- 우선순위: 중간
- 카테고리: 타입 안전성, 리팩토링

## 📌 관련 이슈
- Phase 4 아키텍처 개선

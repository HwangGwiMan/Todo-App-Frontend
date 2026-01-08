/**
 * API 응답, Composable 등에서 작업의 성공/실패 여부와 결과 데이터를 나타내는 표준 타입
 * @template T 성공 시 반환될 데이터의 타입
 * @template E 실패 시 반환될 에러 객체의 타입 (기본값: Error)
 */
export interface OperationResult<T = void, E = Error> {
  success: boolean;
  data?: T;
  error?: E;
  cancelled?: boolean;
}

/**
 * Spring Page<T> 객체에 대응하는 페이지네이션 응답 타입
 * @template T 컨텐츠 아이템의 타입
 */
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // 현재 페이지 번호 (0-based)
  first: boolean;
  last:boolean;
}

/**
 * SelectField 컴포넌트에서 사용할 옵션 타입
 */
export interface SelectOption {
  value: string | number | null;
  label: string;
  disabled?: boolean;
}

// 여기에 추가적인 공통 타입을 정의할 수 있습니다.
// 예: FormState, ErrorResponse 등

/**
 * API 응답을 감싸는 표준 래퍼 타입
 * @template T API가 반환하는 데이터의 타입
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

/**
 * 폼 상태를 관리하기 위한 타입
 * @template T 폼 데이터의 구조에 해당하는 타입
 */
export interface FormState<T extends object> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
}

/**
 * Toast 알림 타입
 */
export type ToastType = 'error' | 'success' | 'info';

/**
 * Toast 알림 컴포넌트의 인스턴스 인터페이스
 */
export interface ToastNotificationInstance {
  // eslint-disable-next-line no-unused-vars
  addToast: (message: string, type: ToastType, duration?: number) => void;
  // eslint-disable-next-line no-unused-vars
  removeToast: (id: number) => void;
}
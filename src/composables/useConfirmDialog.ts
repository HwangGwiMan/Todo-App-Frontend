import { ref } from 'vue'

/**
 * 확인 다이얼로그 상태 관리를 위한 Composable
 * 
 * 컴포넌트 기반 커스텀 다이얼로그를 사용할 경우 활용
 * 현재는 기본 confirm() 사용하지만, 향후 확장 가능
 */
export function useConfirmDialog() {
  const isOpen = ref(false)
  const message = ref('')
  const title = ref('확인')
  // eslint-disable-next-line no-unused-vars
  const resolveCallback = ref<((result: boolean) => void) | null>(null)

  /**
   * 확인 다이얼로그 표시
   * 
   * @param msg 표시할 메시지
   * @param dialogTitle 다이얼로그 제목 (선택)
   * @returns Promise<boolean> - 확인: true, 취소: false
   */
  const confirm = (msg: string, dialogTitle: string = '확인'): Promise<boolean> => {
    message.value = msg
    title.value = dialogTitle
    isOpen.value = true

    return new Promise((resolve) => {
      resolveCallback.value = resolve
    })
  }

  /**
   * 확인 버튼 클릭 처리
   */
  const handleConfirm = () => {
    resolveCallback.value?.(true)
    isOpen.value = false
    resolveCallback.value = null
  }

  /**
   * 취소 버튼 클릭 처리
   */
  const handleCancel = () => {
    resolveCallback.value?.(false)
    isOpen.value = false
    resolveCallback.value = null
  }

  /**
   * 간단한 확인 (기본 브라우저 confirm 사용)
   */
  const simpleConfirm = (msg: string): boolean => {
    return window.confirm(msg)
  }

  /**
   * 삭제 확인 (사전 정의된 메시지)
   */
  const confirmDelete = (itemName: string = '이 항목'): boolean => {
    return simpleConfirm(`정말 ${itemName}을(를) 삭제하시겠습니까?`)
  }

  /**
   * 저장 확인 (사전 정의된 메시지)
   */
  const confirmSave = (msg: string = '변경사항을 저장하시겠습니까?'): boolean => {
    return simpleConfirm(msg)
  }

  /**
   * 취소 확인 (사전 정의된 메시지)
   */
  const confirmCancel = (msg: string = '작업을 취소하시겠습니까?\n변경사항이 저장되지 않습니다.'): boolean => {
    return simpleConfirm(msg)
  }

  return {
    // 상태
    isOpen,
    message,
    title,

    // 메서드
    confirm,
    handleConfirm,
    handleCancel,
    simpleConfirm,
    confirmDelete,
    confirmSave,
    confirmCancel
  }
}


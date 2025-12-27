# Phase 6: 파일 출력(Export) 기능

## 📋 개요
TODO 및 프로젝트 데이터를 다양한 파일 형식(JSON, Excel, PDF)으로 내보내기할 수 있는 기능을 구현합니다.

## 🎯 목표
- 데이터 백업 및 마이그레이션 지원
- 외부 도구와의 연동 가능
- 보고서 생성 및 공유

## 📝 구현 컴포넌트

### 1. ExportButton.vue (1시간)
**기능:**
- 내보내기 모달 트리거 버튼
- 위치: TodoListView, TodoDetailView, 프로젝트 카드

```vue
<ExportButton
  export-type="single"  // 'single' | 'list' | 'selected'
  :todo-id="todoId"
  @open-modal="showExportModal = true"
/>
```

### 2. ExportModal.vue (2-3시간)
**기능:**
- 파일 형식 선택 UI (JSON / Excel / PDF)
- 각 형식의 설명 표시
- 시각적으로 구분된 옵션 카드
- ESC 키로 닫기

**UI 디자인:**
```
┌─────────────────────────────────┐
│  파일 형식 선택          ✕      │
├─────────────────────────────────┤
│                                 │
│  📄 JSON                    →   │
│  데이터 백업 및 마이그레이션    │
│                                 │
│  📊 Excel                   →   │
│  편집 및 분석 가능한 스프레드시트 │
│                                 │
│  📋 PDF                     →   │
│  인쇄 및 공유용 문서            │
│                                 │
│          [취소]                 │
└─────────────────────────────────┘
```

### 3. Store에 Export 액션 추가 (2-3시간)
```typescript
// stores/todo.ts
async function exportSingleTodo(todoId: number, format: 'json' | 'excel' | 'pdf') {
  const response = await client.GET(`/api/todos/${todoId}/export/${format}`, {
    responseType: 'blob',
  })
  
  if (response.data) {
    const filename = generateFilename(`todo_${todoId}`, format)
    downloadBlob(response.data, filename)
    toast.success(`${format.toUpperCase()} 파일로 내보내기 완료`)
  }
}

async function exportFilteredTodos(format: 'json' | 'excel') {
  // 현재 필터 조건으로 TODO 목록 내보내기
}

async function exportSelectedTodos(todoIds: number[], format: 'json' | 'excel') {
  // 선택된 TODO들만 내보내기
}
```

### 4. 파일 다운로드 유틸리티 (1시간)
```typescript
// utils/fileDownload.ts
export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export function generateFilename(
  prefix: string,
  extension: string,
  includeTimestamp = true
): string {
  const date = new Date()
  const dateStr = date.toISOString().split('T')[0]  // YYYY-MM-DD
  const timeStr = includeTimestamp
    ? `_${date.getHours()}${date.getMinutes()}${date.getSeconds()}`
    : ''
  
  return `${prefix}_${dateStr}${timeStr}.${extension}`
}
```

## 📍 내보내기 버튼 위치

### TodoListView
- 필터/정렬 바 옆에 내보내기 버튼 추가
- 현재 필터링된 TODO 목록 전체를 내보내기

### TodoDetailView
- 상세 페이지 상단 액션 버튼 영역에 추가
- 현재 보고 있는 TODO 단건 내보내기

### 프로젝트 섹션
- 각 프로젝트 카드에 내보내기 버튼 추가 (선택사항)
- 해당 프로젝트의 모든 TODO를 내보내기

## ✅ 체크리스트

**1단계: 기본 인프라 (2-3시간)**
- [ ] `ExportButton.vue` 컴포넌트 생성
- [ ] `ExportModal.vue` 컴포넌트 생성
- [ ] `src/utils/fileDownload.ts` 유틸리티 생성
- [ ] Heroicons 아이콘 추가 (다운로드, 파일, X 아이콘)
- [ ] 모달 스타일링 및 애니메이션
- [ ] ESC 키로 모달 닫기 기능

**2단계: JSON 내보내기 (2-3시간)**
- [ ] JSON 내보내기 API 연동
- [ ] TodoListView에 내보내기 버튼 추가
- [ ] TodoDetailView에 내보내기 버튼 추가
- [ ] 프로젝트 카드에 내보내기 버튼 추가 (선택)
- [ ] 다운로드 성공/실패 Toast 알림
- [ ] 로딩 상태 처리

**3단계: Excel 내보내기 (1시간)**
- [ ] Excel 내보내기 API 연동
- [ ] 모달에 Excel 옵션 추가
- [ ] 다운로드 테스트

**4단계: PDF 내보내기 (1시간)**
- [ ] PDF 내보내기 API 연동
- [ ] 모달에 PDF 옵션 추가
- [ ] 다운로드 테스트

**5단계: 고급 기능 (선택사항, 2-3시간)**
- [ ] 일괄 선택 모드 추가 (체크박스)
- [ ] 선택된 항목만 내보내기
- [ ] 내보내기 전 미리보기 모달
- [ ] 내보내기 옵션 설정

## ⏱️ 예상 소요 시간
- 기본 기능: 8-11시간
- 고급 기능 포함: 10-14시간

## 🏷️ 레이블
- 우선순위: 중간
- 카테고리: 기능 추가, 데이터 관리
- 백엔드 의존: Phase 5 백엔드 완료 필요

## 📌 관련 이슈
- 백엔드 Phase 5: 파일 출력(Export) 기능

## 🛠️ 기술 스택
- **파일 다운로드**: Blob API + URL.createObjectURL
- **아이콘**: Heroicons 또는 Lucide Vue
- **상태 관리**: Pinia Store에 export 액션 추가
- **에러 처리**: 기존 Toast 알림 시스템 활용

## 📚 참고 자료
- [MDN - Blob API](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [MDN - Download Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download)
- [Heroicons](https://heroicons.com/)


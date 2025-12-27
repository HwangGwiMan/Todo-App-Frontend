# Phase 5: 사용자 경험(UX) 개선

## 📋 개요
키보드 단축키, 다크 모드, 접근성 등 사용자 경험을 개선하는 기능을 구현합니다.

## 🎯 목표
- 키보드만으로 앱 사용 가능
- 다크 모드 지원으로 눈의 피로 감소
- WCAG 2.1 Level AA 접근성 준수

## 📝 구현 기능

### 1. 키보드 단축키 (3-4시간)
```typescript
// composables/useKeyboardShortcuts.ts
export function useKeyboardShortcuts() {
  const shortcuts = {
    'ctrl+n': () => openCreateModal(),
    'ctrl+k': () => focusSearch(),
    'ctrl+/': () => showShortcutsHelp(),
    'escape': () => closeModal(),
    'j': () => selectNextTodo(),
    'k': () => selectPreviousTodo(),
    'enter': () => openSelectedTodo(),
    'd': () => markAsDone(),
  }
  
  onMounted(() => {
    document.addEventListener('keydown', handleKeyPress)
  })
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyPress)
  })
}
```

**단축키 도움말 모달**
- `Ctrl + /` 또는 `?`로 단축키 목록 표시
- 일반 단축키 / 편집 모드 단축키 구분

### 2. 다크 모드 (4-5시간)
```vue
<!-- composables/useDarkMode.ts -->
<script setup>
import { useDark, useToggle } from '@vueuse/core'

export function useDarkMode() {
  const isDark = useDark({
    storageKey: 'todo-app-theme',
    valueDark: 'dark',
    valueLight: 'light',
  })
  
  const toggleDark = useToggle(isDark)
  
  return {
    isDark,
    toggleDark
  }
}
</script>
```

**Tailwind CSS 다크 모드 설정**
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1a1a1a',
          surface: '#2d2d2d',
          border: '#3d3d3d',
          text: '#e5e5e5',
        }
      }
    }
  }
}
```

**다크 모드 스타일**
```vue
<template>
  <div class="bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text">
    <div class="card bg-gray-50 dark:bg-dark-surface">
      <!-- 컨텐츠 -->
    </div>
  </div>
</template>
```

### 3. 접근성 (a11y) 개선 (4-5시간)
```vue
<!-- 시맨틱 HTML 사용 -->
<template>
  <main role="main" aria-label="TODO 목록">
    <h1 class="sr-only">할 일 관리</h1>
    
    <!-- 키보드 네비게이션 -->
    <button
      @click="handleCreate"
      @keydown.enter="handleCreate"
      aria-label="새 TODO 만들기"
      class="btn-primary"
    >
      <span aria-hidden="true">+</span>
      <span>새 TODO</span>
    </button>
    
    <!-- ARIA 속성 -->
    <div
      role="alert"
      aria-live="polite"
      v-if="errorMessage"
    >
      {{ errorMessage }}
    </div>
    
    <!-- 포커스 관리 -->
    <input
      ref="titleInput"
      v-model="title"
      aria-required="true"
      aria-describedby="title-error"
      aria-invalid="!!titleError"
    />
    <span id="title-error" role="alert">
      {{ titleError }}
    </span>
  </main>
</template>
```

**포커스 트랩 (모달)**
```typescript
// composables/useFocusTrap.ts
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

export function useModalFocus(modalRef: Ref<HTMLElement>) {
  const { activate, deactivate } = useFocusTrap(modalRef, {
    immediate: true,
    escapeDeactivates: true,
  })
  
  return { activate, deactivate }
}
```

### 4. 애니메이션 효과 (2-3시간)
```vue
<!-- Transition 컴포넌트 활용 -->
<template>
  <TransitionGroup name="todo-list" tag="div">
    <TodoCard
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
    />
  </TransitionGroup>
</template>

<style>
.todo-list-move {
  transition: transform 0.3s ease;
}

.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.3s ease;
}

.todo-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.todo-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
```

## ✅ 체크리스트

**키보드 단축키**
- [ ] `useKeyboardShortcuts` composable 생성
- [ ] 주요 단축키 구현 (새 TODO, 검색, 네비게이션)
- [ ] 단축키 도움말 모달
- [ ] 입력 필드에서 단축키 비활성화

**다크 모드**
- [ ] `useDarkMode` composable 생성
- [ ] Tailwind dark 모드 설정
- [ ] 모든 컴포넌트에 다크 모드 스타일 적용
- [ ] 다크 모드 토글 버튼 (헤더)
- [ ] localStorage에 테마 설정 저장

**접근성**
- [ ] 시맨틱 HTML 사용
- [ ] ARIA 속성 추가
- [ ] 키보드 네비게이션 지원
- [ ] 포커스 관리 (모달, 드롭다운)
- [ ] 스크린 리더 테스트
- [ ] WCAG 2.1 AA 준수 검증

**애니메이션**
- [ ] TODO 추가/삭제 애니메이션
- [ ] 페이지 전환 애니메이션
- [ ] 모달 열기/닫기 애니메이션
- [ ] 로딩 스피너 개선

## ⏱️ 예상 소요 시간
13-17시간

## 🏷️ 레이블
- 우선순위: 중간
- 카테고리: UX, 접근성

## 📌 관련 이슈
- Phase 5 기능 확장

## 📚 참고 자료
- [VueUse - useDark](https://vueuse.org/core/useDark/)
- [VueUse - useFocusTrap](https://vueuse.org/integrations/useFocusTrap/)
- [WCAG 2.1 가이드라인](https://www.w3.org/WAI/WCAG21/quickref/)
- [Vue Transition 문서](https://vuejs.org/guide/built-ins/transition.html)


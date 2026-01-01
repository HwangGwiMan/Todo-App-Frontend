# Phase 4: 컴포넌트 분리 및 재사용성 향상

## 📋 개요
공통 UI 컴포넌트를 분리하여 코드 중복을 제거하고 재사용성을 향상시킵니다.

## 🎯 목표
- 공통 컴포넌트 생성으로 코드 중복 제거
- 일관된 UI/UX 제공
- 유지보수성 향상

## 📝 구현할 컴포넌트

### 1. ConfirmDialog.vue (확인 다이얼로그)
```vue
<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
        <p class="text-gray-600 mb-6">{{ message }}</p>
        
        <div class="flex justify-end gap-3">
          <button @click="onCancel" class="btn-secondary">취소</button>
          <button @click="onConfirm" class="btn-primary">확인</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
```

### 2. EmptyState.vue (빈 상태 화면)
```vue
<template>
  <div class="flex flex-col items-center justify-center py-12">
    <div class="text-6xl mb-4">{{ icon }}</div>
    <h3 class="text-xl font-semibold text-gray-700 mb-2">{{ title }}</h3>
    <p class="text-gray-500 mb-6">{{ message }}</p>
    <slot name="action"></slot>
  </div>
</template>
```

### 3. LoadingOverlay.vue (로딩 오버레이)
```vue
<template>
  <div v-if="isLoading" class="fixed inset-0 z-40 flex items-center justify-center bg-white bg-opacity-75">
    <LoadingSpinner :size="size" />
  </div>
</template>
```

### 4. ErrorBoundary.vue (에러 경계, 선택)
Vue 3의 에러 핸들링 개선

## ✅ 체크리스트
- [x] `ConfirmDialog` 공통 컴포넌트 생성
- [x] `EmptyState` 컴포넌트 생성
- [x] `LoadingOverlay` 컴포넌트 생성
- [x] `ErrorBoundary` 컴포넌트 생성 (선택)
- [x] 모든 페이지에서 공통 컴포넌트 사용
- [x] 중복 코드 제거

## ⏱️ 예상 소요 시간
4-5시간

## 🏷️ 레이블
- 우선순위: 중간
- 카테고리: 리팩토링, UI/UX

## 📌 관련 이슈
- Phase 4 아키텍처 개선


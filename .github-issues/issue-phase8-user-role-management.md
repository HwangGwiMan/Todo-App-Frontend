# Phase 8: 사용자 및 권한 관리 화면

## 📋 개요

백엔드 Phase 7의 Role & Permission 관리 시스템과 연동하여 관리자가 사용자와 역할을 관리할 수 있는 UI를 구현합니다.

## 🎯 목표

- 사용자 목록 조회 및 관리 (관리자 전용)
- 사용자 역할 할당/제거 인터페이스
- 역할 관리 (생성/수정/삭제/권한 할당)
- 권한 기반 UI 접근 제어
- 현재 사용자 권한 표시

## 📝 구현 컴포넌트

### 1. UserListView.vue (5-6시간)
**기능:**
- 사용자 목록 표시 (테이블 또는 카드 형태)
- 사용자 검색 및 필터링 (사용자명, 역할별)
- 사용자 정보 표시 (ID, 사용자명, 역할 목록, 가입일)
- 사용자 역할 관리 버튼 (역할 할당 모달 열기)
- 관리자 전용 페이지 (권한 체크)

**UI 레이아웃:**
```vue
<UserListView>
  <FilterBar>
    - 검색 입력
    - 역할 필터
  </FilterBar>
  
  <UserTable>
    - ID
    - 사용자명
    - 역할 목록 (배지)
    - 가입일
    - 액션 (역할 관리)
  </UserTable>
</UserListView>
```

### 2. UserRoleAssignModal.vue (4-5시간)
**기능:**
- 사용자 역할 할당/제거
- 현재 할당된 역할 표시
- 역할 선택 (체크박스 또는 멀티셀렉트)
- 역할 일괄 업데이트
- 권한 미리보기 (선택한 역할의 권한 목록)

```vue
<UserRoleAssignModal
  v-model:open="isOpen"
  :user-id="selectedUserId"
  @updated="handleRolesUpdated"
/>
```

### 3. RoleListView.vue (4-5시간)
**기능:**
- 역할 목록 표시
- 역할 정보 (이름, 설명, 권한 목록)
- 역할 생성/수정/삭제 버튼
- 역할별 사용자 수 표시 (선택)
- 관리자 전용 페이지

**UI 레이아웃:**
```vue
<RoleListView>
  <ActionBar>
    - 생성 버튼
  </ActionBar>
  
  <RoleTable>
    - 이름
    - 설명
    - 권한 목록 (배지)
    - 사용자 수
    - 액션 (수정/삭제)
  </RoleTable>
</RoleListView>
```

### 4. RoleCreateModal.vue / RoleEditModal.vue (5-6시간)
**기능:**
- 역할 이름 및 설명 입력
- 권한 선택 (PermissionSelector 컴포넌트 사용)
- 권한 카테고리별 그룹화 (TODO, PROJECT, USER, ADMIN)
- 유효성 검사
- 생성/수정 API 호출

```vue
<RoleCreateModal
  v-model:open="isOpen"
  @created="handleRoleCreated"
/>

<RoleEditModal
  v-model:open="isOpen"
  :role-id="selectedRoleId"
  @updated="handleRoleUpdated"
/>
```

### 5. PermissionSelector.vue (3-4시간)
**기능:**
- 권한 목록 표시 (카테고리별 그룹화)
- 권한 체크박스 선택
- 전체 선택/해제
- 선택된 권한 요약 표시

**권한 그룹:**
- TODO 권한: READ, WRITE, DELETE
- PROJECT 권한: READ, WRITE, DELETE
- USER 권한: READ, MANAGE
- ADMIN 권한: ACCESS

```vue
<PermissionSelector
  v-model:selected-permissions="form.permissions"
  :permissions="availablePermissions"
/>
```

### 6. 권한 Store 및 Composable (3-4시간)

**stores/permission.ts:**
```typescript
export const usePermissionStore = defineStore('permission', () => {
  const roles = ref<RoleResponse[]>([])
  const permissions = ref<PermissionResponse[]>([])
  const userRoles = ref<UserRoleResponse[]>([])
  
  // Actions
  const fetchRoles = async () => { ... }
  const fetchPermissions = async () => { ... }
  const fetchUserRoles = async (userId: number) => { ... }
  const assignRoleToUser = async (userId: number, roleId: number) => { ... }
  const removeRoleFromUser = async (userId: number, roleId: number) => { ... }
  const updateUserRoles = async (userId: number, roleIds: number[]) => { ... }
  const createRole = async (data: RoleRequest) => { ... }
  const updateRole = async (roleId: number, data: RoleRequest) => { ... }
  const deleteRole = async (roleId: number) => { ... }
  
  // Getters
  const hasPermission = (permission: string) => { ... }
  const hasRole = (roleName: string) => { ... }
  const isAdmin = computed(() => hasRole('ADMIN'))
})
```

**composables/usePermission.ts:**
```typescript
export function usePermission() {
  const permissionStore = usePermissionStore()
  const authStore = useAuthStore()
  
  const checkPermission = (permission: string): boolean => { ... }
  const checkRole = (roleName: string): boolean => { ... }
  const requireAdmin = () => { ... }
  
  return {
    checkPermission,
    checkRole,
    requireAdmin,
    isAdmin: permissionStore.isAdmin
  }
}
```

### 7. 라우터 가드 확장 (2시간)
**기능:**
- 관리자 전용 라우트 보호
- 권한 기반 접근 제어
- 권한 없을 시 접근 거부 페이지로 리다이렉트

```typescript
// router/index.ts
const adminRoutes = [
  { path: '/admin/users', name: 'UserManagement', component: UserListView },
  { path: '/admin/roles', name: 'RoleManagement', component: RoleListView }
]

router.beforeEach((to, from, next) => {
  const { requireAdmin } = usePermission()
  
  if (to.path.startsWith('/admin')) {
    if (!requireAdmin()) {
      next({ name: 'Forbidden' })
      return
    }
  }
  
  next()
})
```

### 8. 사용자 정보 Store 확장 (2시간)
**기능:**
- 현재 사용자 역할/권한 정보 저장
- 로그인 시 사용자 권한 정보 로드
- 권한 체크 헬퍼 함수

```typescript
// stores/auth.ts 확장
const userRoles = ref<RoleResponse[]>([])
const userPermissions = ref<PermissionResponse[]>([])

const fetchCurrentUserRoles = async () => { ... }
const hasPermission = (permission: string) => { ... }
const hasRole = (roleName: string) => { ... }
```

### 9. ForbiddenView.vue (1시간)
**기능:**
- 권한 없음 페이지
- 접근 거부 메시지 표시
- 홈으로 돌아가기 버튼

## ✅ 체크리스트

**Phase 8-1: 권한 Store 및 Composable (3-4시간)**
- [ ] `stores/permission.ts` 생성
- [ ] `composables/usePermission.ts` 생성
- [ ] 권한 체크 헬퍼 함수 구현
- [ ] auth store 확장 (사용자 권한 정보)

**Phase 8-2: 라우터 가드 및 접근 제어 (2-3시간)**
- [ ] 관리자 라우트 정의
- [ ] 라우터 가드 확장 (권한 체크)
- [ ] `ForbiddenView.vue` 생성
- [ ] 네비게이션 메뉴에 관리자 링크 추가 (권한 체크)

**Phase 8-3: 역할 관리 UI (9-11시간)**
- [ ] `RoleListView.vue` 생성
- [ ] `RoleCreateModal.vue` 생성
- [ ] `RoleEditModal.vue` 생성
- [ ] `PermissionSelector.vue` 생성
- [ ] 역할 CRUD API 연동
- [ ] 권한 선택 UI 구현

**Phase 8-4: 사용자 관리 UI (9-11시간)**
- [ ] `UserListView.vue` 생성
- [ ] 사용자 목록 API 연동 (백엔드 API 필요시 추가)
- [ ] `UserRoleAssignModal.vue` 생성
- [ ] 사용자 역할 할당/제거 UI
- [ ] 사용자 검색/필터링

**Phase 8-5: 권한 기반 UI 접근 제어 (2-3시간)**
- [ ] 컴포넌트 레벨 권한 체크 (v-if 디렉티브)
- [ ] 버튼/링크 권한 체크
- [ ] 네비게이션 메뉴 권한 체크

**Phase 8-6: 테스트 및 문서화 (2-3시간)**
- [ ] 컴포넌트 단위 테스트
- [ ] Composable 테스트
- [ ] 권한 체크 로직 테스트
- [ ] README 업데이트

## ⏱️ 예상 소요 시간

- Phase 8-1: 3-4시간
- Phase 8-2: 2-3시간
- Phase 8-3: 9-11시간
- Phase 8-4: 9-11시간
- Phase 8-5: 2-3시간
- Phase 8-6: 2-3시간

**총 예상 시간: 27-35시간**

## 🏷️ 레이블

- 우선순위: 높음
- 카테고리: 기능 추가, UI/UX, 보안
- 백엔드 의존: Phase 7 백엔드 완료 필요

## 📌 관련 이슈

- 백엔드 Phase 7: DB 기반 Role & Permission 관리 시스템

## 📦 필요한 백엔드 API

### 역할 관리 API
- `GET /api/admin/roles`: 모든 역할 조회
- `GET /api/admin/roles/{id}`: 역할 상세 조회
- `POST /api/admin/roles`: 역할 생성
- `PUT /api/admin/roles/{id}`: 역할 수정
- `DELETE /api/admin/roles/{id}`: 역할 삭제

### 사용자 역할 관리 API
- `GET /api/admin/users`: 사용자 목록 조회 (필요시 추가)
- `GET /api/admin/users/{userId}/roles`: 사용자 역할 조회
- `POST /api/admin/users/{userId}/roles`: 사용자에 역할 할당
- `DELETE /api/admin/users/{userId}/roles/{roleId}`: 사용자에서 역할 제거
- `PUT /api/admin/users/{userId}/roles`: 사용자 역할 일괄 업데이트

### 권한 정보 API (필요시)
- `GET /api/admin/permissions`: 모든 권한 조회
- `GET /api/auth/me`: 현재 사용자 정보 및 권한 조회 (확장)

## 📚 참고 자료

- [Vue Router Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html)
- [RBAC (Role-Based Access Control)](https://en.wikipedia.org/wiki/Role-based_access_control)
- 백엔드 Phase 7 이슈: `.github/issues/phase7-role-permission-management.md`

## 🔒 보안 고려사항

1. **프론트엔드 권한 체크는 보안을 보장하지 않음**
   - 백엔드에서 항상 권한 검증 필요
   - 프론트엔드 권한 체크는 UX 향상용

2. **관리자 페이지 접근 제어**
   - 라우터 가드에서 권한 체크
   - API 호출 실패 시 접근 거부 처리

3. **민감 정보 표시 주의**
   - 사용자 비밀번호 등은 절대 표시하지 않음
   - 사용자 정보 최소화 표시

## 🎨 UI/UX 가이드라인

1. **관리자 전용 페이지 표시**
   - 페이지 헤더에 "관리자 전용" 배지 표시
   - 관리자 메뉴는 권한이 있을 때만 표시

2. **역할 및 권한 표시**
   - 역할: 색상 배지로 표시
   - 권한: 작은 배지 또는 태그로 표시
   - 카테고리별 그룹화 (TODO, PROJECT, USER, ADMIN)

3. **사용자 친화적 메시지**
   - 권한 없음: "이 페이지에 접근할 권한이 없습니다"
   - 역할 할당 성공/실패 토스트 메시지
   - 확인 다이얼로그 (역할 삭제 등)

4. **반응형 디자인**
   - 모바일/태블릿/데스크톱 대응
   - 테이블은 모바일에서 카드 형태로 변환 고려


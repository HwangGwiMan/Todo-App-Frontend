## 변경 사항

### 🎯 목표
- 개별 TODO/Project 조회 성능 향상 (O(n) → O(1))
- 부분 업데이트 효율성 증가
- 메모리 사용 최적화

### 📝 주요 변경사항

#### Todo Store 최적화
- ✅ Map 구조(`todosMap`)로 상태 관리 변경
- ✅ `getTodoById` 메서드로 O(1) 조회 제공
- ✅ `fetchTodoById`에서 Map 캐싱 추가 (API 호출 최적화)
- ✅ 불필요한 `todoList` computed 속성 제거

#### Project Store 최적화
- ✅ Map 구조(`projectsMap`)로 상태 관리 변경
- ✅ `getProjectById` 메서드로 O(1) 조회 제공
- ✅ `fetchProject`에서 Map 캐싱 추가
- ✅ `fetchDefaultProject`에서도 Map 저장하도록 개선

#### 성능 개선
- **조회 성능**: 배열 순회 O(n) → Map 조회 O(1)
- **캐싱**: API 응답을 Map에 저장하여 중복 호출 방지
- **메모리**: 중복 computed 속성 제거

### 📊 변경된 파일
- `src/stores/todo.ts` - Map 구조로 리팩토링
- `src/stores/project.ts` - Map 구조로 리팩토링 및 캐싱 추가
- `.github-issues/issue-phase4-store-optimization.md` - 체크리스트 업데이트
- `README.md` - Phase 4 진행 상황 업데이트

## 관련 이슈
<!-- 관련된 이슈 번호를 입력해주세요 -->
Closes #(이슈번호)
관련: `.github-issues/issue-phase4-store-optimization.md`

## 체크리스트
- [x] 코드가 정상적으로 작동하는지 확인했습니다
- [x] 문서를 업데이트했습니다
- [x] 린트 검사를 통과했습니다 (No linter errors found)
- [ ] 코드 리뷰를 요청했습니다

## 테스트 방법

### 수동 테스트
1. **Todo 조회 성능 확인**
   - TODO 목록 페이지에서 개별 TODO 조회
   - TODO 상세 페이지에서 빠른 로딩 확인
   - 브라우저 개발자 도구에서 네트워크 요청 최소화 확인

2. **Project 조회 성능 확인**
   - 프로젝트 목록에서 개별 프로젝트 조회
   - 프로젝트 필터링 시 빠른 응답 확인

3. **캐싱 동작 확인**
   - TODO 상세 페이지 접근 후 다시 접근 시 API 호출 없이 로드되는지 확인
   - 프로젝트 정보도 동일하게 캐싱되는지 확인

### 성능 측정
- Map 조회: O(1) - 즉시 조회
- 배열 순회: O(n) - 제거됨
- 캐싱으로 인한 API 호출 감소 확인

## 스크린샷 (UI 변경인 경우)
N/A - 백엔드 최적화로 UI 변경 없음

## 추가 참고사항
- 기존 코드와의 호환성을 위해 `todos`와 `projects` computed 속성은 배열로 반환하도록 유지
- 순서 유지를 위해 `todoIds`와 `projectIds` 배열을 별도로 관리
- 낙관적 업데이트(Optimistic Update) 기능은 그대로 유지
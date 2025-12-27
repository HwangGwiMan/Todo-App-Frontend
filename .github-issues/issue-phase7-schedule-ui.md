# Phase 7: TODO 일정 관리 및 알림 기능 UI

## 📋 개요
TODO에 상세한 일정 관리 필드를 입력/수정할 수 있는 UI와 알림 설정 인터페이스를 구현합니다.

## 🎯 목표
- 일정 시작/종료 일시, 종일 일정 지원
- 반복 일정 설정 (일간/주간/월간/년간)
- 알림 설정 (이메일, SMS, 카카오톡, 브라우저 푸시)
- 캘린더 뷰로 일정 시각화

## 📝 구현 컴포넌트

### 1. DateTimeRangePicker.vue (4-5시간)
**기능:**
- 종일 일정 토글
- 시작/종료 일시 입력
- 예상 소요 시간 입력 (시간 + 분)
- 장소 입력

```vue
<DateTimeRangePicker
  v-model:start-date="form.startDate"
  v-model:end-date="form.endDate"
  v-model:is-all-day="form.isAllDay"
  v-model:location="form.location"
  v-model:estimated-duration="form.estimatedDuration"
/>
```

### 2. RecurrenceRuleEditor.vue (5-6시간)
**기능:**
- 반복 유형 선택 (일간/주간/월간/년간)
- 반복 간격 설정 (예: 2일마다, 3주마다)
- 요일 선택 (주간 반복 시)
- 날짜 선택 (월간 반복 시)
- 반복 종료 조건 (날짜/횟수/무한)
- 반복 요약 미리보기

```vue
<RecurrenceRuleEditor
  v-model:recurrence-rule="form.recurrenceRule"
/>
```

**반복 규칙 JSON 형식:**
```json
{
  "type": "WEEKLY",
  "interval": 2,
  "daysOfWeek": [1, 3, 5],
  "endDate": "2026-12-31",
  "count": null
}
```

### 3. NotificationSettingsEditor.vue (4-5시간)
**기능:**
- 알림 활성화 토글
- 알림 타입 선택 (이메일/SMS/카카오톡/푸시)
- 알림 시간 설정 (정시, 5분전, 30분전, 1시간전, 1일전 등)
- 여러 알림 추가/삭제
- 알림 요약 미리보기

```vue
<NotificationSettingsEditor
  v-model:notification-settings="form.notificationSettings"
  v-model:notification-enabled="form.notificationEnabled"
/>
```

**알림 설정 JSON 형식:**
```json
[
  {
    "type": "EMAIL",
    "timing": -30
  },
  {
    "type": "KAKAO",
    "timing": -1440
  }
]
```

### 4. TodoDetailView 확장 (2-3시간)
**일정 정보 섹션 추가:**
- 종일 일정 배지
- 시작/종료 일시 표시
- 예상 소요 시간 표시
- 장소 표시
- 반복 규칙 요약 표시

**알림 설정 섹션 추가:**
- 설정된 알림 목록 표시
- 알림 타입 및 시간 포맷팅

### 5. CalendarView.vue (선택, 8-10시간)
**라이브러리 선택:**
- **v-calendar** (가볍고 커스터마이징 용이)
- **FullCalendar** (기능이 풍부함)

```bash
npm install v-calendar
# 또는
npm install @fullcalendar/vue3 @fullcalendar/daygrid
```

**기능:**
- 월간 캘린더 뷰
- TODO 일정 표시 (시작일 기준)
- TODO 클릭 시 상세 페이지 이동
- 날짜 네비게이션 (이전/다음 월)
- 오늘 날짜 강조
- 반응형 디자인

## ✅ 체크리스트

**Phase 7-1: 기본 일정 입력 (4-5시간)**
- [ ] DateTimeRangePicker.vue 컴포넌트 생성
- [ ] 종일 일정 토글 기능
- [ ] 시작/종료 일시 입력
- [ ] 예상 소요 시간 입력 (시간 + 분 분리)
- [ ] 장소 입력
- [ ] TodoCreateModal/TodoEditModal에 통합

**Phase 7-2: 반복 설정 UI (5-6시간)**
- [ ] RecurrenceRuleEditor.vue 컴포넌트 생성
- [ ] 반복 유형 선택 (일간/주간/월간/년간)
- [ ] 반복 간격 설정
- [ ] 요일 선택 (주간 반복 시)
- [ ] 날짜 선택 (월간 반복 시)
- [ ] 반복 종료 조건 (날짜/횟수/무한)
- [ ] 반복 요약 표시

**Phase 7-3: 알림 설정 UI (4-5시간)**
- [ ] NotificationSettingsEditor.vue 컴포넌트 생성
- [ ] 알림 타입 선택 (이메일/SMS/카카오톡/푸시)
- [ ] 알림 시간 설정 (분/시간/일 전)
- [ ] 여러 알림 추가/삭제
- [ ] 알림 요약 표시

**Phase 7-4: TODO 상세 페이지 확장 (2-3시간)**
- [ ] 일정 정보 섹션 추가
- [ ] 알림 설정 섹션 추가
- [ ] 날짜/시간 포맷팅 (date-fns)
- [ ] 반복 규칙 표시

**Phase 7-5: 캘린더 뷰 (선택, 8-10시간)**
- [ ] 캘린더 컴포넌트 생성 또는 라이브러리 통합
- [ ] 월간 뷰 구현
- [ ] TODO 표시 및 클릭 이벤트
- [ ] 날짜 네비게이션
- [ ] 반응형 디자인

**Phase 7-6: 알림 관리 페이지 (선택, 3-4시간)**
- [ ] 알림 이력 조회
- [ ] 알림 설정 전역 관리
- [ ] 알림 테스트 기능

## ⏱️ 예상 소요 시간
- 기본 (캘린더 뷰 제외): 15-19시간
- 전체 (캘린더 뷰 포함): 23-29시간

## 🏷️ 레이블
- 우선순위: 높음
- 카테고리: 기능 추가, UI/UX
- 백엔드 의존: Phase 6 백엔드 완료 필요

## 📌 관련 이슈
- 백엔드 Phase 6: TODO 일정 관리 및 알림 기능

## 📦 필요한 패키지
```json
{
  "dependencies": {
    "v-calendar": "^3.0.0",
    "@fullcalendar/vue3": "^6.1.0",
    "@heroicons/vue": "^2.0.0"
  }
}
```

## 📚 참고 자료
- [v-calendar 문서](https://vcalendar.io/)
- [FullCalendar Vue 문서](https://fullcalendar.io/docs/vue)
- [date-fns 문서](https://date-fns.org/)
- [MDN - Input type datetime-local](https://developer.mozilla.org/ko/docs/Web/HTML/Element/input/datetime-local)


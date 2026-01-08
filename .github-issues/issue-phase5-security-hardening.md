# Phase 5: 보안 강화

## 📋 개요
프론트엔드 애플리케이션의 보안을 강화하여 XSS, CSRF 등의 공격으로부터 보호합니다.

## 🎯 목표
- Content Security Policy 설정
- XSS 방지 검증
- 보안 헤더 설정
- HTTPS 강제화

## 📝 구현 기능

### 1. Content Security Policy (CSP) 설정 (1-2시간)
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https:;
  connect-src 'self' http://localhost:8080;
  frame-ancestors 'none';
">
```

Vite 설정에서 CSP 적용:
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    // CSP 플러그인 추가
  ],
  build: {
    rollupOptions: {
      output: {
        // CSP nonce 적용
      }
    }
  }
})
```

### 2. XSS 방지 검증 (1-2시간)
```typescript
// utils/security.ts
export function sanitizeHtml(input: string): string {
  // DOMPurify 사용
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
    ALLOWED_ATTR: []
  })
}

export function validateInput(input: string): boolean {
  // 잠재적 XSS 패턴 검증
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi
  ]
  
  return !xssPatterns.some(pattern => pattern.test(input))
}
```

컴포넌트에서 입력 검증 적용:
```vue
<script setup>
import { sanitizeHtml, validateInput } from '@/utils/security'

const handleInput = (value: string) => {
  if (!validateInput(value)) {
    toast.error('잘못된 입력입니다.')
    return
  }
  
  const sanitized = sanitizeHtml(value)
  // 처리 로직
}
</script>
```

### 3. 보안 헤더 설정 (0.5-1시간)
```typescript
// vite.config.ts 또는 nginx.conf
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
}
```

### 4. HTTPS 강제화 (0.5-1시간)
```typescript
// src/main.ts
if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
  window.location.href = window.location.href.replace('http:', 'https:')
}
```

## ✅ 체크리스트
- [ ] Content Security Policy 설정 및 적용
- [ ] XSS 방지 유틸리티 함수 구현
- [ ] 모든 사용자 입력에 검증 적용
- [ ] 보안 헤더 설정 (nginx 또는 Vite)
- [ ] HTTPS 강제화 로직 구현
- [ ] 보안 취약점 스캔 (OWASP ZAP 등)
- [ ] 프로덕션 배포 시 보안 검토

## 📊 예상 시간
3-4시간

## 🏷️ 라벨
security, enhancement, production
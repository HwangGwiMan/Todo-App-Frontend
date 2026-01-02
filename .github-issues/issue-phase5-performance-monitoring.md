# Phase 5: 성능 모니터링 및 최적화

## 📋 개요
애플리케이션의 성능을 모니터링하고 최적화하여 사용자 경험을 향상시킵니다.

## 🎯 목표
- Web Vitals 측정 및 모니터링
- 번들 분석 및 최적화
- Core Web Vitals 개선
- API 호출 성능 모니터링

## 📝 구현 기능

### 1. Web Vitals 측정 (1-2시간)
```typescript
// composables/useWebVitals.ts
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'

export function useWebVitals() {
  onCLS(console.log)
  onFID(console.log)
  onFCP(console.log)
  onLCP(console.log)
  onTTFB(console.log)
}

// main.ts에서 사용
import { useWebVitals } from '@/composables/useWebVitals'
useWebVitals()
```

모니터링 서비스 연동 (선택):
```typescript
// Google Analytics 또는 Sentry
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics({ name, delta, value, id }) {
  // 분석 서비스로 전송
  gtag('event', name, {
    event_category: 'Web Vitals',
    event_label: id,
    value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    non_interaction: true,
  })
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
// ...
```

### 2. 번들 분석 및 최적화 (1-2시간)
```bash
# 번들 분석
npm install -D rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          ui: ['@headlessui/vue', 'heroicons']
        }
      }
    }
  }
})
```

### 3. Core Web Vitals 개선 (0.5-1시간)
```typescript
// composables/usePerformance.ts
export function usePerformance() {
  // 이미지 지연 로딩
  const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]')
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src!
          img.classList.remove('lazy')
          imageObserver.unobserve(img)
        }
      })
    })
    
    images.forEach(img => imageObserver.observe(img))
  }
  
  // 불필요한 리렌더링 방지
  const optimizeRenders = () => {
    // Vue 컴포넌트 최적화
  }
  
  onMounted(() => {
    lazyLoadImages()
    optimizeRenders()
  })
}
```

### 4. API 호출 성능 모니터링 (0.5-1시간)
```typescript
// config/client.ts 개선
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

// 요청/응답 인터셉터로 성능 측정
apiClient.interceptors.request.use((config) => {
  config.metadata = { startTime: Date.now() }
  return config
})

apiClient.interceptors.response.use((response) => {
  const duration = Date.now() - response.config.metadata.startTime
  console.log(`API ${response.config.url}: ${duration}ms`)
  
  // 느린 API 호출 로깅
  if (duration > 1000) {
    console.warn(`Slow API call: ${response.config.url} took ${duration}ms`)
  }
  
  return response
})
```

## ✅ 체크리스트
- [ ] Web Vitals 측정 및 로깅 구현
- [ ] 번들 분석 도구 설정 및 최적화
- [ ] Core Web Vitals 점수 개선 (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] 이미지 지연 로딩 구현
- [ ] API 호출 성능 모니터링 추가
- [ ] 프로덕션에서 성능 모니터링 활성화
- [ ] Lighthouse 점수 90+ 달성

## 📊 예상 시간
3-4시간

## 🏷️ 라벨
performance, monitoring, optimization
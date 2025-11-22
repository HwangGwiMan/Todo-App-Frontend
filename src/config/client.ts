import { client } from '../client/client.gen';
import axios, { type AxiosInstance } from 'axios';
import router from '../router';
import { useAuthStore } from '../stores/auth';

// 인증 토큰을 localStorage에서 가져와서 자동으로 주입
const getAuthToken = async (): Promise<string | undefined> => {
  const token = localStorage.getItem('token');
  return token || undefined;
};

// axios 인스턴스 생성 및 인터셉터 설정
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080'
});

// 응답 인터셉터: 401 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 401 Unauthorized 응답 시
      const authStore = useAuthStore();
      
      // 로그아웃 처리
      authStore.logout();
      
      // 현재 경로가 로그인 페이지가 아닌 경우에만 리다이렉트
      if (router.currentRoute.value.name !== 'Login') {
        router.push({ name: 'Login' });
      }
    }
    return Promise.reject(error);
  }
);

// 클라이언트 설정 업데이트 (커스텀 axios 인스턴스 사용)
client.setConfig({
  auth: getAuthToken,
  axios: axiosInstance,
});

export { client };

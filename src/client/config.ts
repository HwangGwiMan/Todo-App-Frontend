import { client } from './client.gen';
import type { Auth } from './core/auth.gen';

// 인증 토큰을 localStorage에서 가져와서 자동으로 주입
const getAuthToken = async (): Promise<string | undefined> => {
  const token = localStorage.getItem('token');
  return token || undefined;
};

// 클라이언트 설정 업데이트
client.setConfig({
  auth: getAuthToken,
});

export { client };

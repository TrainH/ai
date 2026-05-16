import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── 요청 인터셉터: Access Token 자동 첨부 ──────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── 응답 인터셉터: 401 시 Refresh Token으로 자동 갱신 ─────────
let isRefreshing = false; // 동시에 여러 요청이 갱신을 시도하지 않도록 방지
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// 갱신 중 대기한 요청들을 새 토큰으로 일괄 처리
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response, // 성공 응답은 그대로 통과
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 아직 재시도하지 않은 요청만 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      // refresh 엔드포인트 자체가 401이면 무한루프 방지
      if (originalRequest.url?.includes('/auth/refresh')) {
        handleLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // 이미 갱신 중이라면 큐에 넣고 대기
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // Refresh Token 자체가 없으면 즉시 로그아웃
        handleLogout();
        return Promise.reject(error);
      }

      try {
        // 새 Access Token 요청
        const { data } = await axios.post('http://localhost:8080/api/auth/refresh', {
          refreshToken,
        });

        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        // 새 토큰 저장
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // 대기 중이던 요청들을 새 토큰으로 재실행
        processQueue(null, newAccessToken);

        // 원래 실패했던 요청도 새 토큰으로 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh Token도 만료되었으면 강제 로그아웃
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// 로그아웃 처리 (페이지 이동 포함)
function handleLogout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  // 로그인 페이지로 리다이렉트 (React Router 외부에서 호출하므로 window 사용)
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

export default api;

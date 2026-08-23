import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
export const API = `${BACKEND_URL}/api`;

const api = axios.create({ baseURL: API });

export const USER_ACCESS_TOKEN_KEY = "nv_token";
export const USER_REFRESH_TOKEN_KEY = "nv_refresh_token";

type SessionResponse = {
  token?: string;
  access_token?: string;
  refresh_token?: string;
};

type RetryableRequest = InternalAxiosRequestConfig & { _nvRetried?: boolean };

let refreshRequest: Promise<string> | null = null;

export function persistUserSession(session: SessionResponse) {
  if (typeof window === "undefined") return;
  const accessToken = session.access_token || session.token;
  if (accessToken) localStorage.setItem(USER_ACCESS_TOKEN_KEY, accessToken);
  if (session.refresh_token) localStorage.setItem(USER_REFRESH_TOKEN_KEY, session.refresh_token);
}

export function clearUserSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_REFRESH_TOKEN_KEY);
}

async function refreshAccessToken() {
  if (typeof window === "undefined") throw new Error("Session refresh is only available in the browser");
  const refreshToken = localStorage.getItem(USER_REFRESH_TOKEN_KEY);
  if (!refreshToken) throw new Error("No refresh session is available");

  if (!refreshRequest) {
    refreshRequest = axios
      .post<SessionResponse>(`${API}/auth/refresh`, { refresh_token: refreshToken })
      .then(({ data }) => {
        persistUserSession(data);
        const accessToken = data.access_token || data.token;
        if (!accessToken) throw new Error("The refreshed session did not include an access token");
        return accessToken;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(USER_ACCESS_TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetryableRequest | undefined;
    const isPublicAuthRequest = /\/auth\/(refresh|login|register)/.test(request?.url || "");
    if (error.response?.status !== 401 || !request || request._nvRetried || isPublicAuthRequest) {
      throw error;
    }

    request._nvRetried = true;
    try {
      const accessToken = await refreshAccessToken();
      request.headers.Authorization = `Bearer ${accessToken}`;
      return api(request);
    } catch {
      clearUserSession();
      throw error;
    }
  },
);

export default api;

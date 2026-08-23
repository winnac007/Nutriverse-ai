import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API } from "./api";

export const PROFESSIONAL_ACCESS_TOKEN_KEY = "nv_professional_token";
export const PROFESSIONAL_REFRESH_TOKEN_KEY = "nv_professional_refresh_token";

type ProfessionalSession = {
  token?: string;
  access_token?: string;
  refresh_token?: string;
};

type RetryableRequest = InternalAxiosRequestConfig & { _professionalRetried?: boolean };

const professionalApi = axios.create({ baseURL: API });
let refreshRequest: Promise<string> | null = null;

export function persistProfessionalSession(session: ProfessionalSession) {
  if (typeof window === "undefined") return;
  const accessToken = session.access_token || session.token;
  if (accessToken) localStorage.setItem(PROFESSIONAL_ACCESS_TOKEN_KEY, accessToken);
  if (session.refresh_token) localStorage.setItem(PROFESSIONAL_REFRESH_TOKEN_KEY, session.refresh_token);
}

export function clearProfessionalSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROFESSIONAL_ACCESS_TOKEN_KEY);
  localStorage.removeItem(PROFESSIONAL_REFRESH_TOKEN_KEY);
}

professionalApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(PROFESSIONAL_ACCESS_TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function refreshProfessionalAccess() {
  if (typeof window === "undefined") throw new Error("Professional session refresh requires a browser");
  const refreshToken = localStorage.getItem(PROFESSIONAL_REFRESH_TOKEN_KEY);
  if (!refreshToken) throw new Error("No professional refresh session is available");

  if (!refreshRequest) {
    refreshRequest = axios
      .post<ProfessionalSession>(`${API}/professionals/refresh`, { refresh_token: refreshToken })
      .then(({ data }) => {
        persistProfessionalSession(data);
        const accessToken = data.access_token || data.token;
        if (!accessToken) throw new Error("The refreshed professional session is incomplete");
        return accessToken;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }
  return refreshRequest;
}

professionalApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetryableRequest | undefined;
    const isPublicAuthRequest = /\/professionals\/(refresh|login|register)/.test(request?.url || "");
    if (error.response?.status !== 401 || !request || request._professionalRetried || isPublicAuthRequest) {
      throw error;
    }
    request._professionalRetried = true;
    try {
      const accessToken = await refreshProfessionalAccess();
      request.headers.Authorization = `Bearer ${accessToken}`;
      return professionalApi(request);
    } catch {
      clearProfessionalSession();
      throw error;
    }
  },
);

export default professionalApi;

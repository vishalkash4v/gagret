import axios from "axios";

/** Browser calls go through our same-origin relay because the upstream API sends no CORS headers. */
export const API_BASE_URL = "/api/public/admin-proxy";
const TOKEN_KEY = "admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

export const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      clearToken();
      if (!window.location.pathname.startsWith("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  },
);

export function apiErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string; error?: string } | undefined)?.message ??
      (error.response?.data as { error?: string } | undefined)?.error ??
      error.message ??
      fallback
    );
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

/** Backends differ: unwrap { data: [...] } / { users: [...] } shapes into a plain array. */
export function unwrapList<T>(payload: unknown, ...keys: string[]): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    for (const key of ["data", "results", "items", ...keys]) {
      const value = obj[key];
      if (Array.isArray(value)) return value as T[];
      if (value && typeof value === "object") {
        const nested = unwrapList<T>(value, ...keys);
        if (nested.length) return nested;
      }
    }
  }
  return [];
}

export function unwrapObject<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in (payload as Record<string, unknown>)) {
    const inner = (payload as Record<string, unknown>)["data"];
    if (inner && typeof inner === "object") return inner as T;
  }
  return payload as T;
}

export function formatCurrency(value: number | undefined | null) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

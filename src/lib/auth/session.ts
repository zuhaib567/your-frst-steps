import { redirect } from "@tanstack/react-router";
import { AUTH_SESSION_KEY, FIXED_PASSWORD } from "@/lib/auth/config";

export function isAuthenticated() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(AUTH_SESSION_KEY) === "1";
}

export function loginWithPassword(password: string) {
  const ok = password === FIXED_PASSWORD;

  if (!ok || typeof window === "undefined") {
    return ok;
  }

  window.sessionStorage.setItem(AUTH_SESSION_KEY, "1");
  return true;
}

export function logout() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(AUTH_SESSION_KEY);
}

export function requireAuth(redirectTo?: string) {
  if (!isAuthenticated()) {
    throw redirect({
      to: "/login",
      search: { redirect: redirectTo ?? "/" },
    });
  }
}
